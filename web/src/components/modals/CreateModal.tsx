import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore";
import { IHabit } from "@api/types/habit";
import { IMemory } from "@api/types/memory";
import { Button, Flex, Modal, Select, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";

function CreateModal() {
  const create = useAppStore(state => state.modals.create);
  const close = () => useAppStore.setState(s => { s.modals.create.opened = false })

  const [type, setType] = useState("habit");

  return (
    <Modal
      opened={create.opened}
      onClose={close}
      lockScroll={false}
      centered
      size={360}
      title="Create"
    >
      <Flex direction="column" gap="md">

        <Select
          data={[
            { value: "habit", label: "Habit" },
            { value: "goal", label: "Goal" },
            { value: "memory", label: "Memory" },
          ]}
          value={type}
          onChange={(ev) => setType(ev ?? "")}
          allowDeselect={false}
        />

        {type === "habit" && <CreateHabit close={close} />}
        {type === "goal" && <CreateGoal close={close} />}
        {type === "memory" && <CreateMemory close={close} />}

      </Flex>
    </Modal>
  )
}

export default CreateModal

function CreateHabit({ close }: { close: () => void }) {
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
    <>
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
    </>
  )
}

function CreateGoal({ close }: { close: () => void }) {
  return (
    <>CreateGoal</>
  )
}

function CreateMemory({ close }: { close: () => void }) {
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
    <>
      <Textarea
        label="Description"
        placeholder="Description..."
        value={description}
        onChange={(ev) => setDescription(ev.currentTarget.value)}
        autosize
      />

      <Button onClick={onCreate}>Create</Button>
    </>
  )
}