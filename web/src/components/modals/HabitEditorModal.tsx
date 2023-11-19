import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore";
import { IHabit } from "@api/types/habit";
import { Button, Flex, Modal, TextInput, Textarea } from "@mantine/core";

function HabitEditorModal() {
  const habitEditor = useAppStore(state => state.modals.habitEditor);
  const close = () => {
    useAppStore.setState(s => {
      s.modals.habitEditor.opened = false;

      // If created/edited a habit, perform cleanup
      if (s.modals.habitEditor.id) {
        s.modals.habitEditor.id = undefined;
        s.modals.habitEditor.title = "";
        s.modals.habitEditor.description = "";
      }
    });
  }

  const setTitle = (text: string) => { useAppStore.setState(s => { s.modals.habitEditor.title = text }) }
  const setDescription = (text: string) => { useAppStore.setState(s => { s.modals.habitEditor.description = text }) }

  const onCreate = () => {
    const currentUserId = useApiStore.getState().userId;
    if (!currentUserId) return;

    const habit: IHabit = {
      id: Date.now().toString(),
      userId: currentUserId,
      title: habitEditor.title,
      description: habitEditor.description,
      count: 0,
    }

    useApiStore.getState().addHabit(habit);
    useAppStore.setState(s => { s.modals.habitEditor.id = habit.id });
    close();
  }

  const onEdit = () => {
    const currentUserId = useApiStore.getState().userId;
    if (!currentUserId) return;

    useApiStore.setState(s => {
      if (!habitEditor.id) return;
      const habit = s.habits[habitEditor.id];
      if (!habit) return;

      habit.title = habitEditor.title;
      habit.description = habitEditor.description;
    });

    close();
  }

  return (
    <Modal
      opened={habitEditor.opened}
      onClose={close}
      lockScroll={false}
      centered
      size={360}
      title="Habit editor"
    >
      <Flex direction="column" gap="md">

        <TextInput
          label="Title"
          placeholder="Title..."
          value={habitEditor.title}
          onChange={(ev) => setTitle(ev.currentTarget.value)}
        />

        <Textarea
          label="Description"
          placeholder="Description..."
          value={habitEditor.description}
          onChange={(ev) => setDescription(ev.currentTarget.value)}
          autosize
        />

        <Button onClick={!habitEditor.id ? onCreate : onEdit}>
          {!habitEditor.id ? "Create" : "Edit"}
        </Button>

      </Flex>
    </Modal>
  )
}

export default HabitEditorModal