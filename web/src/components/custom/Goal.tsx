import { Badge, Flex, Paper, Text, Title } from "@mantine/core"
import Emoji from "../Emoji"
import { IGoal } from "@api/types/goal"
import TextParser from "../util/TextParser";
import { truncate } from "@/styles/shared.css";

interface Props {
  goal: IGoal;
}

function Goal({ goal }: Props) {
  return (
    <Paper withBorder p="md">
      <Flex gap="md">

        <Emoji emoji="👨‍💻" size={32} />

        <Flex direction="column" style={{ display: "grid", gridTemplateColumns: "auto" }}>
          <Title order={5} className={truncate}><TextParser ids={["emoji"]} text={goal.title} /></Title>
          <Text truncate><TextParser ids={["emoji", "url", "username"]} text={goal.description} /></Text>
          <Flex mt="xs" gap="xs">
            <Badge>{goal.tasksDone} / {goal.tasksTodo} Tasks</Badge>
          </Flex>
        </Flex>

      </Flex>
    </Paper>
  )
}

export default Goal