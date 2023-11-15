import { ActionIcon, Avatar, Badge, Button, Card, Flex, Text, Title } from "@mantine/core"
import { IconCalendar, IconDiscountCheckFilled, IconDots } from "@tabler/icons-react"

function Profile() {
  return (
    <Flex direction="column" m="md">

      <Card withBorder padding="md">

        <Card.Section
          h={150}
          style={{
            backgroundImage: "url(https://i.pinimg.com/564x/80/12/d1/8012d171d4d5bcfea05ef04af626b3a3.jpg)",
          }}
        />

        <Flex direction="column" gap="xs">

          <Flex justify="space-between" gap="md" align="center">

            <Avatar
              src="https://avatars.githubusercontent.com/u/50113500?v=4"
              radius={80}
              size={80}
              mt={-30}
              style={{ border: "2px solid var(--mantine-color-body)" }}
            />

            <Flex align="center" gap="xs">
              <ActionIcon radius="xl" size={32}>
                <IconDots />
              </ActionIcon>

              <Button radius="xl">Follow</Button>
            </Flex>

          </Flex>

          <Flex direction="column">
            <Flex align="center" gap="xs">
              <Title order={5}>John Doe</Title>
              <IconDiscountCheckFilled />
            </Flex>
            <Text>@johndoe</Text>

            <Text mt="xs">Hello, world! This is my biography. I am John Doe.</Text>
          </Flex>

        </Flex>

      </Card>

    </Flex>
  )
}

export default Profile