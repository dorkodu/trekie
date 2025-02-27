import { ActionIcon, Menu } from '@mantine/core'
import { modals } from "@mantine/modals"
import { IconClipboardText, IconDots, IconDotsVertical, IconEdit, IconExclamationCircle, IconShare, IconTrash } from '@tabler/icons-react'
import { IHabit } from '@web/namespaces/habit'
import { trekie } from "@web/shared/lib/trekie"
import { useAppStore } from '@web/shared/stores/appStore'
import { vanilla } from '@web/styles/theme'
import { MouseEvent } from 'react'
import { habits } from '.'

interface Props {
  habit: IHabit
}

function HabitCounterMenu({ habit }: Props) {
  const currentUserId = trekie.use($ => $.user?.id)
  const isHabitOwner = habit.userId === currentUserId

  const onShare = (ev: MouseEvent) => { ev.stopPropagation() }
  const onClipboard = (ev: MouseEvent) => { ev.stopPropagation() }

  const onEdit = (ev: MouseEvent) => {
    ev.stopPropagation()

    modals.openContextModal({
      modal: "habitEditor",
      title: "Edit Habit",
      innerProps: {
        mode: "EDIT"
      }
    })
  }

  const onReport = (ev: MouseEvent) => {
    ev.stopPropagation()
  }

  const onDelete = (ev: MouseEvent) => {
    ev.stopPropagation()

    habits.delete(habit.id)
  }

  return (
    <Menu position="bottom-end" withArrow>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={ev => ev.stopPropagation()}
          size="lg"
        >
          <IconDotsVertical color={vanilla.colors.gray.lightColor} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown style={{
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}>
        <Menu.Item onClick={onShare} leftSection={<IconShare />}>
          Share
        </Menu.Item>

        <Menu.Item onClick={onClipboard} leftSection={<IconClipboardText />}>
          Copy To Clipboard
        </Menu.Item>

        {currentUserId && (
          <>
            <Menu.Divider />

            {isHabitOwner ? (<>
              <Menu.Item onClick={onEdit} leftSection={<IconEdit />}>
                Edit Habit
              </Menu.Item>
              <Menu.Item onClick={onDelete} leftSection={<IconTrash />} c="red">
                Delete Habit
              </Menu.Item>
            </>) :
              (<Menu.Item onClick={onReport} color="red" leftSection={<IconExclamationCircle />}>
                Report habit
              </Menu.Item>)}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}

export default HabitCounterMenu
