import ChevronTitle from "@/components/custom/ChevronTitle";
import Memory from "@/components/custom/Memory";
import { useApiStore } from "@/stores/apiStore";
import { Flex } from "@mantine/core"

function Memories() {
  const memories = useApiStore(state => state.getMemories(state.userId));

  return (
    <Flex direction="column" m="md" gap="md">

      <ChevronTitle order={4}>Memories</ChevronTitle>

      <Flex direction="row" justify="center" wrap="wrap" gap="md">
        {memories.map((memory) => <Memory key={memory.id} memory={memory} />)}
      </Flex>

    </Flex>
  )
}

export default Memories