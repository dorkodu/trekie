import { ActionIcon, Menu } from "@mantine/core"
import { IconClipboardText, IconDots, IconEdit, IconExclamationCircle, IconShare } from "@tabler/icons-react"

function ProfileMenu() {
  return (
    <Menu position="bottom-end">

      <Menu.Target>
        <ActionIcon radius="xl" size={32}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>

        <Menu.Item leftSection={<IconShare />}>
          Share
        </Menu.Item>

        <Menu.Item leftSection={<IconClipboardText />}>
          Copy To Clipboard
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconEdit />}>
          Edit Profile
        </Menu.Item>

        <Menu.Item color="red" leftSection={<IconExclamationCircle />}>
          Report User
        </Menu.Item>

      </Menu.Dropdown>

    </Menu>
  )
}

export default ProfileMenu