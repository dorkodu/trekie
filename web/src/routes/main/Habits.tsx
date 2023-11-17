import Habit from "@/components/custom/Habit";
import { useApiStore } from "@/stores/apiStore"
import { Flex } from "@mantine/core"

function Habits() {
  const habits = useApiStore(state => state.habits);

  return (
    <Flex direction="column" m="md">

      {Object.values(habits).map((habit) => <Habit key={habit.id} habit={habit} />)}

    </Flex>
  )
}

export default Habits