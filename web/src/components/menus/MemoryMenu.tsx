import { useApiStore } from "@/stores/apiStore";
import { useAppStore } from "@/stores/appStore"
import { IMemory } from "@api/types/memory";
import { ActionIcon, Menu } from "@mantine/core"
import { IconClipboardText, IconDots, IconEdit, IconExclamationCircle, IconShare } from "@tabler/icons-react"

interface Props {
  memory: IMemory;
}

function MemoryMenu({ memory }: Props) {
  const currentUserId = useApiStore(state => state.userId);

  const onShare = () => { }
  const onClipboard = () => { }
  const onEdit = () => {
    useAppStore.setState(s => {
      s.modals.memoryEditor = {
        opened: true,
        id: memory.id,
        description: memory.description,
      }
    });
  }
  const onReport = () => { }

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

            {currentUserId === memory.userId ?
              <Menu.Item onClick={onEdit} leftSection={<IconEdit />}>
                Edit memory
              </Menu.Item>
              :
              <Menu.Item onClick={onReport} color="red" leftSection={<IconExclamationCircle />}>
                Report memory
              </Menu.Item>
            }
          </>
        }

      </Menu.Dropdown>

    </Menu>
  )
}

export default MemoryMenu