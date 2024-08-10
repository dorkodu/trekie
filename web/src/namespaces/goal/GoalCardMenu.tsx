import { trekie } from '@/shared/lib/trekie'

import { useAppStore } from '@/shared/stores/appStore'
import { vanilla } from '@/styles/theme'
import { IGoal } from '@/core/commons/goal'
import { ActionIcon, Menu } from '@mantine/core'
import { IconClipboardText, IconDots, IconDotsVertical, IconEdit, IconExclamationCircle, IconShare, IconTrash } from '@tabler/icons-react'
import { MouseEvent } from 'react'
import { modals } from '@mantine/modals'

interface Props {
  goal: IGoal
}

function GoalMenu({ goal }: Props) {
  const currentUserId = trekie.game($ => $.user?.id)

  const onShare = (ev: MouseEvent) => { ev.stopPropagation() }
  const onReport = (ev: MouseEvent) => { ev.stopPropagation() }
  const onClipboard = (ev: MouseEvent) => { ev.stopPropagation() }

  const onEdit = (ev: MouseEvent) => {
    ev.stopPropagation()
    modals.openContextModal({
      modal: "goalEditor",
      title: "Edit Goal",
      innerProps: {
        mode: "EDIT",
        goal
      }
    })
  }

  const onDelete = (ev: MouseEvent) => {
    ev.stopPropagation()
    trekie.goal.remove(goal.id)
  }

  return (
    <Menu position="bottom-end" withArrow>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={e => e.stopPropagation()}
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

            {currentUserId === goal.userId ? (
              <>
                <Menu.Item onClick={onEdit} leftSection={<IconEdit />}>
                  Edit Goal
                </Menu.Item>
                <Menu.Item
                  onClick={onDelete}
                  leftSection={<IconTrash />}
                  c="red"
                >
                  Delete Goal
                </Menu.Item>
              </>
            ) : (
              <Menu.Item
                onClick={onReport}
                color="red"
                leftSection={<IconExclamationCircle />}
              >
                Report Goal
              </Menu.Item>
            )}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}

export default GoalMenu
