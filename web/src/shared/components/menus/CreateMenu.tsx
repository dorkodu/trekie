import { useThemed } from '@/shared/hooks'
import { useAppStore } from '@/shared/stores/appStore'
import { vanilla } from '@/styles/theme'
import { ActionIcon, Badge, Box, Button, Divider, Flex, FloatingPosition, Menu, Stack, rgba } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconCopyCheck } from '@tabler/icons-react'
import { IconPhotoPlus, IconPlus, IconTargetArrow } from '@tabler/icons-react'
import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props extends PropsWithChildren {
  popupPosition: FloatingPosition
}

function CreateMenu({ children, popupPosition = "top-end" }: Props) {
  const [opened, { open, close }] = useDisclosure()
  const navigate = useNavigate()

  const onHabit = () => {
    modals.openContextModal({
      modal: "habitEditor",
      title: "New Habit",
      innerProps: {
        mode: "CREATE"
      }
    })
    close()
  }

  const onGoal = () => {
    modals.openContextModal({
      modal: "goalEditor",
      title: "New Goal",
      innerProps: {
        mode: "CREATE"
      }
    })
    close()
  }

  return (
    <Menu position={popupPosition} opened={opened} onOpen={open} onClose={close}>
      <Menu.Target>
        {children}
      </Menu.Target>
      <Menu.Dropdown style={{ padding: 8, paddingBottom: 16, border: 0, background: rgba("#fff", 0), minWidth: 240 }}>
        <Stack gap={6} style={{ borderRadius: 16, padding: 10, border: 0, background: rgba(useThemed({ dark: vanilla.colors.dark[8], light: vanilla.colors.white }), 0.9) }}>
          <Button variant="gradient" gradient={{ deg: 45, from: "green", to: "teal" }} h="auto" py={4} styles={{ label: { flex: 1, fontSize: 14 } }} radius={12}
            leftSection={<IconCopyCheck size={26} />}
            onClick={onHabit}>
            New Habit
          </Button>
          <Button variant="gradient" gradient={{ deg: 45, from: "green", to: "teal" }} py={4} h="auto" styles={{ label: { flex: 1, fontSize: 14 } }} radius={12}
            leftSection={<IconTargetArrow size={26} />}
            onClick={onGoal}>
            New Goal
          </Button>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  )
}

export default CreateMenu
