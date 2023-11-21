import NoHabitsCard from "@/components/cards/NoHabitsCard";
import ChevronTitle from "@/components/custom/ChevronTitle";
import Habit from "@/components/custom/Habit";
import { UserStats } from "@/components/custom/UserStats";
import { useApiStore } from "@/stores/apiStore"
import { Divider, Flex, Paper } from "@mantine/core"

function Habits() {
  const user = useApiStore(state => state.userId && state.users[state.userId]);
  const habits = useApiStore(state => state.getHabits(state.userId));

  return (
    <Flex direction="column" m="md" gap="md">

      <ChevronTitle order={4}>Habits</ChevronTitle>

      {user &&
        <Paper withBorder p="md">
          <Flex justify="space-evenly">
            <UserStats.Momentum user={user} />
            <Divider orientation="vertical" />
            <UserStats.Experience user={user} />
            <Divider orientation="vertical" />
            <UserStats.Streaks user={user} />
          </Flex>
        </Paper>
      }

      {habits.length > 0 ?
        habits.map((habit) => <Habit key={habit.id} habit={habit} showHeatmap />)
        :
        <NoHabitsCard />
      }

    </Flex>
  )
}

export default Habits