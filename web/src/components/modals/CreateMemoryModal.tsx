import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore";
import { IMemory } from "@api/types/memory";
import { Button, Flex, Modal, Textarea } from "@mantine/core";
import { useState } from "react";

function CreateMemoryModal() {
  const createMemory = useAppStore(state => state.modals.createMemory);
  const close = () => useAppStore.setState(s => { s.modals.createMemory.opened = false })

  const [description, setDescription] = useState("");

  const onCreate = () => {
    const currentUserId = useApiStore.getState().userId;
    if (!currentUserId) return;

    const memory: IMemory = {
      id: Date.now().toString(),
      userId: currentUserId,
      date: Date.now(),
      description,
      favourites: 0,
    }

    useApiStore.getState().addMemory(memory);

    close();
  }

  return (
    <Modal
      opened={createMemory.opened}
      onClose={close}
      lockScroll={false}
      centered
      size={360}
      title="Create a goal"
    >
      <Flex direction="column" gap="md">

        <Textarea
          label="Description"
          placeholder="Description..."
          value={description}
          onChange={(ev) => setDescription(ev.currentTarget.value)}
          autosize
        />

        <Button onClick={onCreate}>Create</Button>

      </Flex>
    </Modal>
  )
}

export default CreateMemoryModal