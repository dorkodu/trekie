import { Badge, Flex, Paper, Text, Title } from "@mantine/core"
import Emoji from "../Emoji"
import { IGoal } from "@api/types/goal"
import TextParser from "../util/TextParser";

interface Props {
  goal: IGoal;
}

function Goal({ goal }: Props) {
  return (
    <Paper withBorder p="md">
      <Flex gap="md">

        <Emoji emoji="👨‍💻" size={32} />

        <Flex direction="column">
          <Title order={5}><TextParser ids={["emoji"]} text={goal.title} /></Title>
          <Text><TextParser ids={["emoji", "url"]} text={goal.description} /></Text>
          <Flex mt="xs" gap="xs">
            <Badge>{goal.tasksDone} / {goal.tasksTodo} Tasks</Badge>
          </Flex>
        </Flex>

      </Flex>
    </Paper>
  )
}

export default Goal