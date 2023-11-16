import { ActionIcon, Avatar, Card, Flex, Image, Text } from "@mantine/core"
import { IconDots, IconStar } from "@tabler/icons-react"

interface Props {

}

function Memory({ }: Props) {
  return (
    <Card withBorder w={200}>

      <Card.Section>
        <Image
          src="https://i.pinimg.com/564x/80/12/d1/8012d171d4d5bcfea05ef04af626b3a3.jpg"
          alt="Image of a memory"
          w={200}
          h={150}
        />
      </Card.Section>

      <Flex direction="column" gap="xs" mt="md">

        <Text lineClamp={3}>
          Me and my friends rewriting Minecraft in C++ because Java is trash.
        </Text>

        <Flex gap="xs">
          <Avatar src="/favicon.svg" size={32} />
          <Flex direction="column">
            <Text>John Doe</Text>
            <Text size="sm">3 days ago</Text>
          </Flex>
        </Flex>

        <Flex justify="space-between" gap="xs">
          <Flex align="center" gap="xs">
            <ActionIcon variant="subtle"><IconStar /></ActionIcon>
            <Text>123</Text>
          </Flex>
          <ActionIcon variant="subtle"><IconDots /></ActionIcon>
        </Flex>

      </Flex>

    </Card>
  )
}

export default Memory