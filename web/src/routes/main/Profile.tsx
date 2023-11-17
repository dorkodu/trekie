import Community from "@/components/custom/Community"
import Goal from "@/components/custom/Goal"
import Memory from "@/components/custom/Memory"
import ProfileMenu from "@/components/menus/ProfileMenu"
import TextParser from "@/components/util/TextParser"
import { useApiStore } from "@/stores/apiStore"
import { Anchor, Avatar, Button, Card, Flex, Paper, Text, Title, px, rem, useMantineTheme } from "@mantine/core"
import { IconChevronRight, IconDiscountCheckFilled, IconFlame, IconRocket, IconStarFilled } from "@tabler/icons-react"
import { useParams } from "react-router-dom"

function Profile() {
  const theme = useMantineTheme();
  const params = useParams();

  const username = params["username"];
  const usernameToId = useApiStore(state => username && state.usernameToId[username]);
  const user = useApiStore(state => usernameToId && state.users[usernameToId]);

  const currentUserId = useApiStore(state => state.userId);

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
            src="https://avatars.githubusercontent.com/u/50113500?v=4"
            radius={80}
            size={80}
            mt={-40 + (px(theme.spacing.xs) as number)}
            style={{ border: `${rem(2)} solid var(--mantine-color-body)` }}
            pos="absolute"
          />

          <Flex align="center" justify="end" gap="xs" mt="xs">
            <ProfileMenu user={user} />
            {currentUserId !== user.id && <Button radius="xl">Follow</Button>}
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
              <Anchor>{user.followers} Followers</Anchor>
              <Anchor>{user.following} Following</Anchor>
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

            <Flex align="center">
              <Title order={5}>Goals</Title>
              <IconChevronRight />
            </Flex>

            <Goal />

          </Flex>

          <Flex direction="column" gap="xs">

            <Flex align="center">
              <Title order={5}>Memories</Title>
              <IconChevronRight />
            </Flex>

            <Memory />

          </Flex>

          <Flex direction="column" gap="xs">

            <Flex align="center">
              <Title order={5}>Communities</Title>
              <IconChevronRight />
            </Flex>

            <Community />

          </Flex>

        </Flex>

      </Card>

    </Flex>
  )
}

export default Profile