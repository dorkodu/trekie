import { Button, Card, Flex, Text, Title } from "@mantine/core"
import { IconMinus, IconPlus } from "@tabler/icons-react"

interface Props {

}

function Habit({ }: Props) {
  return (
    <Card withBorder p={0}>
      <Button.Group h={64}>
        <Button h="auto">
          <IconMinus />
        </Button>
        <Flex direction="column" justify="center" p="md" style={{ flex: 1 }}>
          <Title order={5}>Write 15 pages of code</Title>
          <Text>Gotta beat Linus Torvalds.</Text>
        </Flex>
        <Button h="auto">
          <IconPlus />
        </Button>
      </Button.Group>
    </Card>
  )
}

export default Habit