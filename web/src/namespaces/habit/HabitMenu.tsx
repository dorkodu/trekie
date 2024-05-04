import { trekie } from "@/shared/lib/trekie"
import { useAppStore } from '@/shared/stores/appStore'
import { IHabit } from '@core/commons/habit'
import { ActionIcon, Menu } from '@mantine/core'
import {
  IconClipboardText,
  IconDots,
  IconDotsVertical,
  IconEdit,
  IconExclamationCircle,
  IconShare,
  IconTrash,
} from '@tabler/icons-react'
import { MouseEvent } from 'react'
import { vanilla } from '@/styles/theme'

interface Props {
  habit: IHabit
}

function HabitMenu({ habit }: Props) {
  const currentUserId = trekie.game($ => $.user?.id)

  const onShare = (ev: MouseEvent) => { ev.stopPropagation() }
  const onClipboard = (ev: MouseEvent) => { ev.stopPropagation() }

  const onEdit = (ev: MouseEvent) => {
    ev.stopPropagation()

    useAppStore.setState($ => {
      $.modals.habitEditor.opened = true
      $.modals.habitEditor.id = habit.id
      $.modals.habitEditor.title = habit.title
      $.modals.habitEditor.description = habit.description
      $.modals.habitEditor.dailyTarget = habit.dailyTarget
    })
  }

  const onReport = (ev: MouseEvent) => {
    ev.stopPropagation()
  }

  const onDelete = (ev: MouseEvent) => {
    ev.stopPropagation()

    trekie.habit.remove(habit.id)
  }

  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={ev => ev.stopPropagation()}
        >
          <IconDotsVertical color={vanilla.colors.gray.lightColor} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={onShare} leftSection={<IconShare />}>
          Share
        </Menu.Item>

        <Menu.Item onClick={onClipboard} leftSection={<IconClipboardText />}>
          Copy To Clipboard
        </Menu.Item>

        {currentUserId && (
          <>
            <Menu.Divider />

            {currentUserId === habit.userId ? (
              <>
                <Menu.Item onClick={onEdit} leftSection={<IconEdit />}>
                  Edit habit
                </Menu.Item>
                <Menu.Item
                  onClick={onDelete}
                  leftSection={<IconTrash />}
                  c="red"
                >
                  Delete habit
                </Menu.Item>
              </>
            ) : (
              <Menu.Item
                onClick={onReport}
                color="red"
                leftSection={<IconExclamationCircle />}
              >
                Report habit
              </Menu.Item>
            )}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}

export default HabitMenu
