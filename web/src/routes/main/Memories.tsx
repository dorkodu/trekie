import NoMemoriesCard from "@/components/cards/NoMemoriesCard";
import ChevronTitle from "@/components/custom/ChevronTitle";
import Memory from "@/components/custom/Memory";
import { useApiStore } from "@/stores/apiStore";
import { Flex } from "@mantine/core"

function Memories() {
  const memories = useApiStore(state => state.getMemories(state.userId));

  return (
    <Flex direction="column" m="md" gap="md">

      <ChevronTitle order={4}>Memories</ChevronTitle>

      {memories.length > 0 ?
        <Flex direction="row" justify="center" wrap="wrap" gap="md">
          {memories.map((memory) => <Memory key={memory.id} memory={memory} />)}
        </Flex>
        :
        <NoMemoriesCard />
      }

    </Flex>
  )
}

export default Memories