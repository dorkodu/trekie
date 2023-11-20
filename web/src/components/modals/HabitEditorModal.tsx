import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore";
import { IHabit } from "@api/types/habit";
import { Button, Flex, Modal, NumberInput, NumberInputHandlers, TextInput, Textarea } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useRef } from "react";

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
  const setDailyTarget = (target: number) => { useAppStore.setState(s => { s.modals.habitEditor.dailyTarget = target }) }

  const dailyTargetRef = useRef<NumberInputHandlers>(null);

  const onCreate = () => {
    const currentUserId = useApiStore.getState().userId;
    if (!currentUserId) return;

    const habit: IHabit = {
      id: Date.now().toString(),
      userId: currentUserId,
      date: Date.now(),
      title: habitEditor.title,
      description: habitEditor.description,
      count: 0,
      dailyTarget: 0,
      heatmap: {},
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

        <Flex gap="md" align="end">
          <Button variant="default" onClick={() => dailyTargetRef.current?.decrement()}>
            <IconChevronLeft />
          </Button>

          <NumberInput
            label="Daily Target"
            value={habitEditor.dailyTarget}
            onChange={(value) => setDailyTarget(Number(value))}
            hideControls
            min={0} max={99}
            handlersRef={dailyTargetRef}
          />

          <Button variant="default" onClick={() => dailyTargetRef.current?.increment()}>
            <IconChevronRight />
          </Button>
        </Flex>


        <Button onClick={!habitEditor.id ? onCreate : onEdit}>
          {!habitEditor.id ? "Create" : "Edit"}
        </Button>

      </Flex>
    </Modal>
  )
}

export default HabitEditorModal