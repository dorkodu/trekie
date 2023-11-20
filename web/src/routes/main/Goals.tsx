import NoGoalsCard from "@/components/cards/NoGoalsCard";
import ChevronTitle from "@/components/custom/ChevronTitle";
import Goal from "@/components/custom/Goal";
import { useApiStore } from "@/stores/apiStore";
import { Flex } from "@mantine/core"

function Goals() {
  const goals = useApiStore(state => state.getGoals(state.userId));

  return (
    <Flex direction="column" m="md" gap="md">

      <ChevronTitle order={4}>Goals</ChevronTitle>

      {goals.length > 0 ?
        goals.map((goal) => <Goal key={goal.id} goal={goal} />)
        :
        <NoGoalsCard />
      }

    </Flex>
  )
}

export default Goals