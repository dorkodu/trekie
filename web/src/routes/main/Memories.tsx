import Memory from "@/components/custom/Memory";
import { useApiStore } from "@/stores/apiStore";
import { Flex } from "@mantine/core"

function Memories() {
  const memories = useApiStore(state => state.getMemories(state.userId));

  return (
    <Flex direction="column" m="md" gap="md">

      {memories.map((memory) => <Memory key={memory.id} memory={memory} />)}

    </Flex>
  )
}

export default Memories