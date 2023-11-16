import Community from "@/components/custom/Community"
import Dream from "@/components/custom/Dream"
import Memory from "@/components/custom/Memory"
import ProfileMenu from "@/components/menus/ProfileMenu"
import { Anchor, Avatar, Button, Card, Flex, Text, Title, rem } from "@mantine/core"
import { IconChevronRight, IconDiscountCheckFilled } from "@tabler/icons-react"

function Profile() {
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

          <Flex justify="space-between" gap="md" align="center">

            <Avatar
              src="https://avatars.githubusercontent.com/u/50113500?v=4"
              radius={80}
              size={80}
              mt={-30}
              style={{ border: `${rem(2)} solid var(--mantine-color-body)` }}
            />

            <Flex align="center" gap="xs">
              <ProfileMenu />
              <Button radius="xl">Follow</Button>
            </Flex>

          </Flex>

          <Flex direction="column">

            <Flex align="center" gap="xs">
              <Title order={5}>John Doe</Title>
              <IconDiscountCheckFilled />
            </Flex>
            <Text>@johndoe</Text>

            <Text my="xs">Hello, world! This is my biography. I am John Doe.</Text>

            <Flex gap="xs">
              <Anchor>123 Followers</Anchor>
              <Anchor>123 Following</Anchor>
            </Flex>

          </Flex>

          <Flex direction="column" gap="xs">

            <Flex align="center">
              <Title order={5}>Goals</Title>
              <IconChevronRight />
            </Flex>

            <Dream />

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