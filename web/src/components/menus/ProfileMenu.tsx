import { ActionIcon, Menu } from "@mantine/core"
import { IconDots, IconExclamationCircle } from "@tabler/icons-react"

function ProfileMenu() {
  return (
    <Menu position="bottom-end">

      <Menu.Target>
        <ActionIcon radius="xl" size={32}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item color="red" leftSection={<IconExclamationCircle />}>
          Report User
        </Menu.Item>
      </Menu.Dropdown>

    </Menu>
  )
}

export default ProfileMenu