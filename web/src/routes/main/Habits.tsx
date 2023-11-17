import Habit from "@/components/custom/Habit";
import { useApiStore } from "@/stores/apiStore"
import { Flex } from "@mantine/core"

function Habits() {
  const habits = useApiStore(state => state.getHabits(state.userId));

  return (
    <Flex direction="column" m="md" gap="md">

      {habits.map((habit) => <Habit key={habit.id} habit={habit} />)}

    </Flex>
  )
}

export default Habits