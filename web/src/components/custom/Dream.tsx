import { Badge, Flex, Paper, Text, Title } from "@mantine/core"
import Emoji from "../Emoji"

interface Props {

}

function Dream({ }: Props) {
  return (
    <Paper withBorder p="md">
      <Flex gap="md">

        <Emoji emoji="👨‍💻" size={32} />

        <Flex direction="column">
          <Title order={5}>Become the best Programmer</Title>
          <Text>No one can stop me afterwards.</Text>
          <Flex mt="xs" gap="xs">
            <Badge>10/20 Tasks</Badge>
          </Flex>
        </Flex>

      </Flex>
    </Paper>
  )
}

export default Dream