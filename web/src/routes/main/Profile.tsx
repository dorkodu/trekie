import ChevronTitle from "@/components/custom/ChevronTitle"
import Community from "@/components/custom/Community"
import Goal from "@/components/custom/Goal"
import Memory from "@/components/custom/Memory"
import ProfileMenu from "@/components/menus/ProfileMenu"
import TextParser from "@/components/util/TextParser"
import { useApiStore } from "@/stores/apiStore"
import { Anchor, Avatar, Button, Card, Flex, Paper, Text, Title, px, rem, useMantineTheme } from "@mantine/core"
import { IconDiscountCheckFilled, IconFlame, IconRocket, IconStarFilled } from "@tabler/icons-react"
import { useParams } from "react-router-dom"

function Profile() {
  const theme = useMantineTheme();
  const params = useParams();

  const username = params["username"];
  const userId = useApiStore(state => username && state.usernameToUserId[username]);
  const user = useApiStore(state => userId && state.users[userId]);

  const currentUserId = useApiStore(state => state.userId);

  const previewMemories = useApiStore(state => state.getMemories(userId));
  const previewGoals = useApiStore(state => state.getGoals(userId));

  if (!user) {
    return (
      <>User not found.</>
    )
  }

  return (
    <Flex direction="column" m="md">

      <Card withBorder padding="md">

        <Card.Section
          h={200}
          style={{
            backgroundImage: "url(https://i.pinimg.com/564x/80/12/d1/8012d171d4d5bcfea05ef04af626b3a3.jpg)",
          }}
        />

        <Flex direction="column" gap="md">

          <Avatar
            src="/assets/avatar.webp"
            radius={80}
            size={80}
            mt={-40 + (px(theme.spacing.xs) as number)}
            style={{ border: `${rem(2)} solid var(--mantine-color-body)`, backgroundColor: "var(--mantine-color-body)" }}
            pos="absolute"
          />

          <Flex align="center" justify="end" gap="xs" mt="xs">
            <ProfileMenu user={user} />
            {currentUserId !== user.id &&
              <Button
                onClick={() => useApiStore.getState().followUser(user)}
                variant={!user.following ? "filled" : "default"}
                radius="xl"
              >
                {!user.following ? "Follow" : "Unfollow"}
              </Button>
            }
          </Flex>

          <Flex direction="column" gap="xs">

            <Flex direction="column">
              <Flex align="center">
                <Title order={5}><TextParser ids={["emoji"]} text={user.name} /></Title>
                {user.premium && <>&nbsp;<IconDiscountCheckFilled /></>}
              </Flex>
              <Text>@{user.username}</Text>
            </Flex>

            {user.bio &&
              <Text>
                <TextParser ids={["emoji", "url"]} text={user.bio} />
              </Text>
            }

            <Flex gap="xs">
              <Anchor>{user.followerCount} Followers</Anchor>
              <Anchor>{user.followingCount} Following</Anchor>
            </Flex>

            <Flex direction="column" align="start" gap="xs">

              <Paper withBorder p="md">
                <Flex align="center" gap="xs">
                  Momentum
                  <Flex gap="xs">
                    <IconRocket />
                    <Text>80%</Text>
                  </Flex>
                </Flex>
              </Paper>

              <Paper withBorder p="md">
                <Flex align="center" gap="xs">
                  Experience
                  <Flex gap="xs">
                    <IconStarFilled />
                    <Text>964</Text>
                  </Flex>
                </Flex>
              </Paper>

              <Paper withBorder p="md">
                <Flex align="center" gap="xs">
                  Streaks
                  <Flex gap="xs">
                    <IconFlame />
                    <Text>6 days</Text>
                  </Flex>
                </Flex>
              </Paper>

            </Flex>

          </Flex>

          <Flex direction="column" gap="xs">

            <ChevronTitle order={5} href={`/goals/${user.username}`}>
              Goals
            </ChevronTitle>

            {previewGoals.length > 0 ?
              <Goal goal={previewGoals[0]!} />
              :
              <>No goals.</>
            }

          </Flex>

          <Flex direction="column" gap="xs">

            <ChevronTitle order={5} href={`/memories/${user.username}`}>
              Memories
            </ChevronTitle>

            {previewMemories.length > 0 ?
              <Memory memory={previewMemories[0]!} />
              :
              <>No memories.</>
            }

          </Flex>

          <Flex direction="column" gap="xs">

            <ChevronTitle order={5} href={`/communities/${user.username}`}>
              Communities
            </ChevronTitle>

            <Community />

          </Flex>

        </Flex>

      </Card>

    </Flex>
  )
}

export default Profile