import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
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
  IconPigMoney,
  IconCoin,
  IconDiamond,
  IconCoinFilled,
  IconArrowRight,
  IconAlignRight,
  IconChevronRight,
} from '@tabler/icons-react'

import { Menu as styles } from '#/styles/Layout.css'
import ColorToggle from '../util/ColorToggle'
import { Link } from 'react-router-dom'

export function AppMenu() {
  return (
    <Stack miw={250} gap={2}>
      <UserButton />

      <div style={{ marginTop: 10 }}></div>

      <MenuItem icon={<IconCoinFilled />}>Premium</MenuItem>
      <MenuItem icon={<IconHelp />}>Help Center</MenuItem>
      <MenuItem icon={<IconSettings />}>Settings</MenuItem>

      <div style={{ marginTop: 10 }}></div>
      <ColorToggle />

      <Divider my={8} />

      {Footer}
    </Stack>
  )
}

const UserButton = () => {
  let avatar = '/assets/avatar.webp'
  let name = 'Doruk Eray'
  let username = '@doruk'

  return (
    <Paper
      component={Link}
      to="/profile"
      variant="light"
      color="white"
      p={8}
      withBorder
      mx={4}
    >
      <Group justify="space-between" gap={10}>
        <Group gap={10}>
          <Avatar src={avatar} radius="md" size={44} />
          <Stack gap={0} ta="left">
            <Text fw={700} lh={1.1}>
              {name}
            </Text>
            <Text fw={500} lh={1.1} c="dimmed">
              {username}
            </Text>
          </Stack>
        </Group>

        <ThemeIcon variant="transparent" color="dark">
          <IconChevronRight />
        </ThemeIcon>
      </Group>
    </Paper>
  )
}

const Footer = (
  <>
    <Flex direction="column" align="center">
      <Flex gap="xs">
        {[
          ['About', '/about'],
          ['Terms', '/legal/terms'],
          ['Privacy', '/legal/privacy'],
        ].map(link => (
          <Anchor
            component={Link}
            //@ts-ignore
            to={link[1]}
            key={link[1]}
            c="dimmed"
            fw={400}
            size="sm"
          >
            {link[0]}
          </Anchor>
        ))}
      </Flex>
    </Flex>

    <Group justify="center" gap={20} mt={8}>
      <Anchor href="https://dorkodu.com" target="_blank">
        <Image src="/images/dorkodu_Logo_Colorful.svg" w={120} h="auto" />
      </Anchor>
    </Group>
  </>
)

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
