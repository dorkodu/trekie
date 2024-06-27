import { useAppStore } from '@/shared/stores/appStore'
import { useThemed, vanilla } from '@/styles/theme'
import { ActionIcon, Badge, Box, Button, Divider, Flex, FloatingPosition, Menu, Stack, rgba } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCopyCheck } from '@tabler/icons-react'
import { IconPhotoPlus, IconPlus, IconTargetArrow } from '@tabler/icons-react'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  popupPosition: FloatingPosition
}

function CreateMenu({ children, popupPosition = "top-end" }: Props) {
  const [opened, { open, close }] = useDisclosure()

  const onHabit = () => {
    useAppStore.setState(s => {
      s.modals.habitEditor.opened = true
    })
    close()
  }

  const onGoal = () => {
    useAppStore.setState(s => {
      s.modals.goalEditor.opened = true
    })
    close()
  }

  const onStory = () => {
    useAppStore.setState(s => {
      s.modals.memoryEditor.opened = true
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
          <Button variant="gradient" gradient={{ deg: 45, from: "green", to: "teal" }} py={4} h="auto" styles={{ label: { flex: 1, fontSize: 14 } }} radius={12}
            leftSection={<IconPhotoPlus size={26} />}
            onClick={onStory}>
            Add To Story
          </Button>

        </Stack>
      </Menu.Dropdown>
    </Menu>
  )
}

export default CreateMenu
