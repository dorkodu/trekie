import { useAppStore } from '#/stores/appStore'
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Image,
  MantineColor,
  Modal,
  Paper,
  Stack,
  Text,
  px,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconBuildingStore,
  IconHome,
  IconMenu2,
  IconRoad,
  IconSearch,
  IconUsers,
} from '@tabler/icons-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

import CreateMenu from '#/components/menus/CreateMenu'
import * as Nav from '#/components/custom/Nav'
import { AppMenu } from '#/components/cards/Menu'

import { useTrekieStore } from '#/stores/trekieStore'

import * as styles from '#/styles/Layout.css'
import { vanilla } from '#/styles/theme'
import { UserButton } from '#/components/buttons/UserButton'
import { CommandCenter } from '#/components/custom/CommandCenter'
import { DailyStats } from '#/components/cards/DailyStats'
import Emoji from '#/components/custom/Emoji'

const navLinks = [
  { icon: <Emoji emoji="🏡" size={24} />, text: 'Home', path: '/home' },
  { icon: <Emoji emoji="🌎" size={24} />, text: 'Explore', path: '/explore' },
  { icon: <Emoji emoji="✅" size={24} />, text: 'Life', path: '/life' },
  {
    icon: <Emoji emoji="👥" size={24} />,
    text: 'Social',
    path: '/social',
  },
  { icon: <Emoji emoji="🏪" size={24} />, text: 'Market', path: '/market' },
]

function AppLayout() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const navigate = useNavigate()

  const [opened, { open, close }] = useDisclosure(false)

  const isWideScreen = useMediaQuery('(min-width: 768px)')

  const location = useLocation()

  const user = useTrekieStore($ => $.user)

  const getRouteColor = (_route: string): MantineColor | undefined => {
    return _route === location.pathname ? undefined : 'var(--text-color)'
  }

  const BottomBar = (
    <Flex
      direction="column"
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      mx="auto"
      style={{ zIndex: 99 }}
      hiddenFrom="sm"
      h={styles.BARHEIGHT}
    >
      <Paper
        style={{
          borderWidth: 0,
          borderTopWidth: 1,
          borderStyle: 'solid',
          borderColor: vanilla.colors.defaultBorder,
          borderRadius: 0,
        }}
      >
        <Button.Group h={styles.BARHEIGHT}>
          {
            navLinks.map(view =>
              <Button
                variant="subtle"
                c={getRouteColor(view.path.slice(1))}
                p={0}
                w="20%"
                h="auto"
                onClick={() => { console.log(view.path.slice(1) + "LİNK"); navigate(view.path); }}
                key={view.text}
              >
                <Flex direction="column" gap={2} align="center">
                  {view.icon}
                  <Text fz={11} fw={500}>{view.text}</Text>
                </Flex>
              </Button>
            )
          }
        </Button.Group>
      </Paper>

      <Flex
        pos="absolute"
        right={theme.spacing.md}
        top={-48 - (px(theme.spacing.md) as number)}
      >
        <CreateMenu />
      </Flex>
    </Flex >
  )

  const TopBar = (
    <Flex
      direction="column"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      mx="auto"
      style={{ zIndex: 99 }}
      hiddenFrom="sm"
    >
      <Paper
        style={{
          borderWidth: 0,
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: vanilla.colors.defaultBorder,
          borderRadius: 0,
        }}
      >
        <Flex align="center" justify="space-between" gap="md" px="md" h={56}>
          <ActionIcon
            variant="subtle"
            size={32}
            onClick={() => navigate(-1)}
            style={{
              visibility: location.pathname === '/home' ? 'hidden' : 'visible',
            }}
            c="var(--text-color)"
          >
            <IconArrowLeft />
          </ActionIcon>

          <Anchor underline="never" to="/home" component={Link}>
            <Image
              src={
                colorScheme == 'light'
                  ? '/images/trekie_Brand.svg'
                  : '/images/trekie_Brand_White.svg'
              }
              height={36}
              p={1}
            />
          </Anchor>

          <ActionIcon
            variant="subtle"
            size={32}
            onClick={() => open()}
            c="var(--text-color)"
          >
            <IconMenu2 />
          </ActionIcon>
        </Flex>
      </Paper>
    </Flex>
  )

  const Menu = (
    <Modal.Root
      size="auto"
      opened={opened}
      onClose={close}
      transitionProps={{
        transition: 'fade',
        duration: 50,
      }}
      styles={{
        inner: {
          margin: '0 auto !important',
        },
      }}
      keepMounted
      centered
      w={isWideScreen ? 400 : 280}
      zIndex={9999}
    >
      <Modal.Overlay blur={2.5} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Image
              src={
                colorScheme == 'dark'
                  ? '/images/trekie_Brand_White.svg'
                  : '/images/trekie_Brand.svg'
              }
              h={40}
              w="auto"
            />
          </Modal.Title>
          <Modal.CloseButton variant="default" />
        </Modal.Header>
        <Modal.Body>
          <AppMenu />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )

  const Header = (
    <Box m={10} mx={16}>
      <Group justify="space-between">
        <div>
          <Image
            src={
              colorScheme == 'light'
                ? '/images/trekie_Brand.svg'
                : '/images/trekie_Brand_White.svg'
            }
            h={50}
          />
        </div>
        <CommandCenter></CommandCenter>
        <Group gap={4}>
          <UserButton
            user={{
              avatar: user?.pictureUrl ?? '/images/avatar.webp',
              name: user?.name ?? "Anonymous",
              username: '@' + user?.username ?? '@------',
            }}
            compact
          />
          <ActionIcon
            variant="default"
            size={32}
            onClick={() => open()}
            c="var(--text-color)"
          >
            <IconMenu2 />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  )

  return (
    <div className={styles.Layout.Root}>
      {TopBar}

      <header className={styles.Layout.Header}>{Header}</header>
      <div className={styles.Layout.Body}>
        {Menu}

        <nav className={styles.Layout.Nav}>
          <Nav.Bar links={navLinks} />
        </nav>

        <main className={styles.Layout.Main}>
          {/* Paper can be a different element, but not likely */}
          <div>
            <Outlet />
          </div>
        </main>

        <aside className={styles.Layout.Aside}>
          <DailyStats />
          <Card withBorder m={10}>
            Ad
          </Card>

          <footer className={styles.Layout.Footer}>{Footer}</footer>
        </aside>
      </div>

      {BottomBar}
    </div>
  )
}

export default AppLayout

const Footer = (
  <>
    <Divider m={16} mb={0} />

    <Stack gap={0} px={10} align="center">
      <Group justify="center" gap="xs" p={10}>
        {[
          ['About', '/about'],
          ['Terms', '/legal/terms'],
          ['Privacy', '/legal/privacy'],
          ['Careers', 'https://dorkodu.com/jobs'],
          ['Blog', 'https://dorkodu.substack.com'],
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
      </Group>
      <Anchor display="block" href="https://dorkodu.com" target="_blank">
        <Image
          src="/images/dorkodu_Logo_Colorful.svg"
          w={120}
          display="block"
        />
      </Anchor>
    </Stack>
  </>
)
