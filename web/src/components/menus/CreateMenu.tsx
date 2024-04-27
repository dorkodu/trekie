import { useAppStore } from '@/stores/appStore'
import { useThemed, vanilla } from '@/styles/theme'
import { ActionIcon, Badge, Box, Button, Divider, Flex, Group, Menu, MenuDivider, Stack, Text, Title, rgba } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconAngle, IconCopyCheck, IconEqualDouble, IconHandLittleFinger, IconMetronome } from '@tabler/icons-react'
import { IconMoodEmpty } from '@tabler/icons-react'
import { IconHandClick } from '@tabler/icons-react'
import {
  IconCheckbox,
  IconChecklist,
  IconChecks,
  IconEyePlus,
  IconH6,
  IconLinkPlus,
  IconNotebook,
  IconPencilPlus,
  IconPhoto,
  IconPhotoPlus,
  IconPictureInPicture,
  IconPinned,
  IconPlus,
  IconPlusEqual,
  IconPlusMinus,
  IconTargetArrow,
} from '@tabler/icons-react'

interface Props { }

function CreateMenu({ }: Props) {
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
    <Menu position="top-end" opened={opened} onOpen={open} onClose={close}>
      <Menu.Target>
        <ActionIcon radius="lg" size={50}>
          <IconPlus size={32} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown style={{ padding: 8, border: 0, background: rgba("#fff", 0), minWidth: 240 }}>
        <Stack gap={6} style={{ borderRadius: 16, padding: 10, border: 0, background: rgba(useThemed({ dark: "#111", light: "#fff" }), 0.5) }}>
          <Box
            style={{
              background: vanilla.colors.gray.light,
              padding: 6,
              borderRadius: 20,
            }}
          >
            <Stack gap={0}></Stack>
            <Flex>
              <Badge variant="light" color="gray" mx="auto">
                {false ? 'Your favorite habits' : 'No pinned habits'}
              </Badge>
            </Flex>
          </Box>
          <Divider />
          <Button
            variant="gradient"
            onClick={onHabit}
            h="auto"
            py={4}
            styles={{ label: { flex: 1, fontSize: 14 } }}
            leftSection={<IconCopyCheck size={26} />}
            radius={12}
          >
            New Habit
          </Button>
          <Button
            variant="gradient"
            onClick={onGoal}
            py={4}
            h="auto"
            styles={{ label: { flex: 1, fontSize: 14 } }}
            leftSection={<IconTargetArrow size={26} />}
            radius={12}
          >
            New Goal
          </Button>
          <Button
            variant="gradient"
            onClick={onStory}
            py={4}
            h="auto"
            styles={{ label: { flex: 1, fontSize: 14 } }}
            leftSection={<IconPhotoPlus size={26} />}
            radius={12}
          >
            Add To Story
          </Button>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  )
}

export default CreateMenu
