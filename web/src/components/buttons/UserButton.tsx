import { Button, Group, Avatar, Stack, ThemeIcon, Text } from '@mantine/core'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'

interface Props {
  user: { name?: string; username?: string; avatar?: string }
  onClick?: () => void;

  compact?: boolean
}

export function UserButton({ user, onClick, compact = false }: Props) {
  let avatar = user?.avatar ?? '/images/avatar.webp'
  let name = user?.name ?? "Anonymous"
  let username = "@" + user?.username ?? ''

  return (
    <Button
      variant="default"
      h="auto"
      p={compact ? 4 : 6}
      mx={4}
      radius="lg"
      onClick={onClick}
    >
      <Group justify="space-between" gap={10}>
        <Group gap={compact ? 8 : 12}>
          <Avatar
            src={avatar}
            radius={compact ? 12 : 16}
            size={compact ? 36 : 44}
          />
          <Stack gap={0} ta="left" mr={10}>
            <Text fw={700} lh={1.1} size={compact ? 'sm' : 'md'} c="var(--mantine-color-text)">
              {name}
            </Text>
            <Text fw={500} lh={1.1} c="dimmed" size={compact ? 'sm' : 'md'}>
              {username}
            </Text>
          </Stack>
        </Group>
        <ThemeIcon variant="transparent" color="dark">
          <IconChevronRight />
        </ThemeIcon>
      </Group>
    </Button>
  )
}
