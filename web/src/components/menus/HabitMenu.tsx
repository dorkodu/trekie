import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore"
import { IHabit } from "@api/types/habit";
import { ActionIcon, Menu } from "@mantine/core"
import { IconClipboardText, IconDots, IconEdit, IconExclamationCircle, IconShare, IconTrash } from "@tabler/icons-react"

interface Props {
  habit: IHabit;
}

function HabitMenu({ habit }: Props) {
  const currentUserId = useApiStore(state => state.userId);

  const onShare = () => { }
  const onClipboard = () => { }
  const onEdit = () => {
    useAppStore.setState(s => {
      s.modals.habitEditor.opened = true;
      s.modals.habitEditor.id = habit.id;
      s.modals.habitEditor.title = habit.title;
      s.modals.habitEditor.description = habit.description;
    });
  }
  const onReport = () => { }
  const onDelete = () => { useApiStore.getState().removeHabit(habit) }

  return (
    <Menu position="bottom-end">

      <Menu.Target>
        <ActionIcon variant="subtle" c="var(--text-color)" radius="xl">
          <IconDots />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>

        <Menu.Item onClick={onShare} leftSection={<IconShare />}>
          Share
        </Menu.Item>

        <Menu.Item onClick={onClipboard} leftSection={<IconClipboardText />}>
          Copy To Clipboard
        </Menu.Item>

        {currentUserId &&
          <>
            <Menu.Divider />

            {currentUserId === habit.userId ?
              <>
                <Menu.Item onClick={onEdit} leftSection={<IconEdit />}>
                  Edit habit
                </Menu.Item>
                <Menu.Item onClick={onDelete} leftSection={<IconTrash />} c="red">
                  Delete habit
                </Menu.Item>
              </>
              :
              <Menu.Item onClick={onReport} color="red" leftSection={<IconExclamationCircle />}>
                Report habit
              </Menu.Item>
            }
          </>
        }

      </Menu.Dropdown>

    </Menu>
  )
}

export default HabitMenu