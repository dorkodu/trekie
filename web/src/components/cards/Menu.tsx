import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core'
import {
  IconSettings,
  IconLogout,
  IconUserCircle,
  IconHelp,
} from '@tabler/icons-react'

import { Menu as styles } from '#/styles/Layout.css'

export function AppMenu() {
  return (
    <Stack miw={250}>
      <MenuLabel>Application</MenuLabel>
      <MenuItem icon={<IconSettings />}>Settings</MenuItem>
      <MenuItem icon={<IconHelp />}>Help Center</MenuItem>
      <MenuItem icon={<IconUserCircle />}>Your Dorkodu Account</MenuItem>

      <Divider my={8} />

      <Button color="red" leftSection={<IconLogout />}>
        Log Out
      </Button>
    </Stack>
  )
}

const MenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text fw={500} c="dimmed" size="sm">
    {children}
  </Text>
)

const MenuItem = ({
  icon = <></>,
  right = <></>,
  children,
}: {
  children: React.ReactNode
  icon?: JSX.Element
  right?: React.ReactNode
}) => {
  return (
    <UnstyledButton className={styles.Item}>
      <Group wrap="nowrap" justify="space-between" align="center">
        <Group gap={6}>
          <ThemeIcon variant="default" size={32}>
            {icon}
          </ThemeIcon>
          <Text fz={16}>{children}</Text>
        </Group>
        <Box mx={8}>{right}</Box>
      </Group>
    </UnstyledButton>
  )
}
