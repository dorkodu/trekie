import { Anchor, Box, Divider, Flex, Group, Image, Stack, Text, ThemeIcon, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCoinFilled, IconHelp, IconSettings } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'

import trekie from '@/shared/lib/trekie'
import { useAppStore } from '@/shared/stores/appStore'
import { Menu as styles } from '@/styles/Layout.css'
import { UserButton } from '../buttons/UserButton'
import ColorToggle from '../misc/ColorToggle'

export function AppMenu() {
  const isWideScreen = useMediaQuery('(min-width: 768px)')
  const navigate = useNavigate()
  const user = trekie.use($ => $.user)
  const menu = useAppStore($ => $.menu)

  return (
    <Stack w={isWideScreen ? 310 : 260} gap={2} >
      <div>
        <UserButton onClick={() => {
          menu.close()
          navigate('/me')
        }}
          user={{
            avatar: user?.pictureUrl,
            name: user?.name,
            username: user?.username,
          }}
        />
      </div>

      <div style={{ marginTop: 10 }}></div>

      <MenuItem icon={<IconCoinFilled />} onClick={() => {
        menu.close()
        navigate('/premium')
      }}>Premium</MenuItem>
      <MenuItem icon={<IconHelp />} onClick={() => {
        menu.close()
        navigate('/help')
      }}>Help Center</MenuItem>
      <MenuItem icon={<IconSettings />} onClick={() => {
        menu.close()
        navigate('/settings')
      }}>Settings</MenuItem>

      <div style={{ marginTop: 10 }}></div>
      <div><ColorToggle size='lg' /></div>

      <Divider my={8} />

      {Footer}
    </Stack >
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
  onClick = () => { }
}: {
  children: React.ReactNode
  icon?: JSX.Element
  right?: React.ReactNode
  onClick?: Function
}) => {
  return (
    <UnstyledButton className={styles.Item} onClick={(e) => {
      e.preventDefault()
      onClick()
    }}>
      <Group wrap="nowrap" justify="space-between" align="center">
        <Group gap={6}>
          <ThemeIcon variant="default" size={32}>
            {icon}
          </ThemeIcon>
          <Text fz={16} lh={1}>
            {children}
          </Text>
        </Group>
        <Box mx={8}>{right}</Box>
      </Group>
    </UnstyledButton>
  )
}
