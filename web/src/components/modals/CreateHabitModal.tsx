import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore";
import { IHabit } from "@api/types/habit";
import { Button, Flex, Modal, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";

function CreateHabitModal() {
  const createHabit = useAppStore(state => state.modals.createHabit);
  const close = () => useAppStore.setState(s => { s.modals.createHabit.opened = false })

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onCreate = () => {
    const currentUserId = useApiStore.getState().userId;
    if (!currentUserId) return;

    const habit: IHabit = {
      id: Date.now().toString(),
      userId: currentUserId,
      title,
      description,
      count: 0,
    }

    useApiStore.getState().addHabit(habit);

    close();
  }

  return (
    <Modal
      opened={createHabit.opened}
      onClose={close}
      lockScroll={false}
      centered
      size={360}
      title="Create a habit"
    >
      <Flex direction="column" gap="md">

        <TextInput
          label="Title"
          placeholder="Title..."
          value={title}
          onChange={(ev) => setTitle(ev.currentTarget.value)}
        />

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

export default CreateHabitModal