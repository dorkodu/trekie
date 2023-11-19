import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore";
import { IGoal } from "@api/types/goal";
import { Button, Flex, Modal, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";

function CreateGoalModal() {
  const createGoal = useAppStore(state => state.modals.createGoal);
  const close = () => useAppStore.setState(s => { s.modals.createGoal.opened = false })

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onCreate = () => {
    const currentUserId = useApiStore.getState().userId;
    if (!currentUserId) return;

    const goal: IGoal = {
      id: Date.now().toString(),
      userId: currentUserId,
      title,
      description,
      tasksTodo: 0,
      tasksDone: 0,
    }

    useApiStore.getState().addGoal(goal);

    close();
  }

  return (
    <Modal
      opened={createGoal.opened}
      onClose={close}
      lockScroll={false}
      centered
      size={360}
      title="Create a goal"
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

export default CreateGoalModal