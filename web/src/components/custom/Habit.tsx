import { util } from "@/lib/util";
import { useApiStore } from "@/stores/apiStore";
import { truncate } from "@/styles/shared.css";
import { IHabit } from "@api/types/habit"
import { Button, Card, Flex, Paper, Text, Title } from "@mantine/core"
import { IconMinus, IconPlus } from "@tabler/icons-react"
import TextParser from "../util/TextParser";

interface Props {
  habit: IHabit;
}

function Habit({ habit }: Props) {
  const onChangeCount = (count: number) => {
    useApiStore.setState(s => {
      const h = s.habits[habit.id];
      if (!h) return;
      h.count += count;
    });
  }

  return (
    <Card withBorder p={0} mb="xs" style={{ overflow: "visible" }}>

      <Button.Group h={80}>
        <Button h="auto" onClick={() => onChangeCount(-1)}>
          <IconMinus />
        </Button>
        <Flex direction="column" justify="center" p="md" style={{ flex: 1 }}>
          <Flex style={{ display: "grid", gridTemplateRows: "auto" }}>
            <Title order={5} className={truncate}><TextParser ids={["emoji"]} text={habit.title} /></Title>
            <Text truncate><TextParser ids={["emoji", "url", "username"]} text={habit.description} /></Text>
          </Flex>
        </Flex>
        <Button h="auto" onClick={() => onChangeCount(+1)}>
          <IconPlus />
        </Button>
      </Button.Group>

      <Paper
        withBorder px="md"
        pos="absolute" bottom="0" left="50%"
        style={{ transform: "translate(-50%,50%)" }}
      >
        <Title order={5} title={util.formatNumber(habit.count, true)}>
          {util.formatNumber(habit.count)}
        </Title>
      </Paper>

    </Card>
  )
}

export default Habit