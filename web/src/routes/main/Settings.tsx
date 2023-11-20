import { useApiStore } from "@/stores/apiStore"
import { Button, Flex } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"

function Settings() {
  return (
    <Flex direction="column" m="md">

      <Button
        onClick={() => useApiStore.getState().reset()}
        leftSection={<IconTrash />}
        variant="light"
        color="red"
        styles={{ label: { flex: 1 } }}
      >
        Delete Data
      </Button>

    </Flex>
  )
}

export default Settings