import NoHabitsCard from "@/components/cards/NoHabitsCard";
import ChevronTitle from "@/components/custom/ChevronTitle";
import Habit from "@/components/custom/Habit";
import { useApiStore } from "@/stores/apiStore"
import { Flex } from "@mantine/core"

function Habits() {
  const habits = useApiStore(state => state.getHabits(state.userId));

  return (
    <Flex direction="column" m="md" gap="md">

      <ChevronTitle order={4}>Habits</ChevronTitle>

      {habits.length > 0 ?
        habits.map((habit) => <Habit key={habit.id} habit={habit} showHeatmap />)
        :
        <NoHabitsCard />
      }

    </Flex>
  )
}

export default Habits