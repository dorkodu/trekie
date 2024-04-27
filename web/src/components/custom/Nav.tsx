import {
  Text,
  Button,
  Stack,
  UnstyledButton,
  Group,
  Box,
} from '@mantine/core'
import {
  IconPlus
} from '@tabler/icons-react'

import { useLocation, useNavigate } from 'react-router-dom'

import styles from '@/styles/components/NavBar.css'
import React from 'react'

export function Bar({
  links,
}: {
  links: { icon: React.ReactNode; text: string; path: string }[]
}) {
  return (
    <Box p={12}>
      <Stack gap={2} maw={180}>
        {links.map($ => (
          <LinkButton icon={$.icon} key={$.text} path={$.path} text={$.text} />
        ))}
      </Stack>

      <Button my={10} size="md" w="100%" leftSection={<IconPlus />} radius="lg">
        Create
      </Button>
    </Box>
  )
}

export function LinkButton({
  icon = <></>,
  path,
  text,
}: {
  icon?: React.ReactNode
  path: string
  text: string
}) {
  const navigate = useNavigate()

  const location = useLocation()
  let isCurrentRoute = location.pathname === path

  return (
    <UnstyledButton
      onClick={() => navigate(path)}
      className={`${styles.LinkButton[isCurrentRoute ? 'active' : 'plain']}`}
    >
      <Group gap={12} align="center">
        {icon}
        <Text fz={16} fw={500} lh={1}>
          {text}
        </Text>
      </Group>
    </UnstyledButton>
  )
}
