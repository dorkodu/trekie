import { Route, useAppStore } from '#/stores/appStore'
import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Divider,
  Drawer,
  Flex,
  Image,
  MantineColor,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
  px,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import {
  IconArchive,
  IconArrowLeft,
  IconBuildingStore,
  IconCashBanknote,
  IconChevronRight,
  IconExternalLink,
  IconHome,
  IconMenu2,
  IconRoad,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

import { useTrekieStore } from '#/stores/trekieStore'
import CreateMenu from '#/components/menus/CreateMenu'
import Footer from '#/components/custom/Footer'
import { NavBar } from '#/components/cards/NavBar'
import { AppMenu } from '#/components/cards/Menu'

import * as styles from '#/styles/Layout.css'

function AppLayout() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const isWideScreen = useMediaQuery('(min-width: 768px)')

  const route = useAppStore(state => state.route)

  const userId = useTrekieStore(state => state.userId)
  const users = useTrekieStore(state => state.users)
  const user = userId ? users[userId] : undefined

  const closeNavigate = (route: string) => {
    close()
    navigate(route)
  }
  const preventNavigate = (ev: React.MouseEvent, route: string) => {
    ev.preventDefault()
    navigate(route)
  }

  const getRouteColor = (_route: Route): MantineColor | undefined => {
    return _route === route ? undefined : 'var(--text-color)'
  }

  const BottomBar = (
    <Flex
      direction="column"
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      maw={theme.breakpoints.xs}
      mx="auto"
      style={{ zIndex: 99 }}
    >
      <Paper>
        <Divider w="100%" />
        <Button.Group h={64}>
          <Button
            variant="subtle"
            c={getRouteColor('home')}
            p={0}
            w="20%"
            h="auto"
            radius={0}
            onClick={() => navigate('/home')}
          >
            <Flex direction="column" align="center">
              <IconHome />
              <Text fz={10}>Home</Text>
            </Flex>
          </Button>
          <Button
            variant="subtle"
            c={getRouteColor('explore')}
            p={0}
            w="20%"
            h="auto"
            onClick={() => navigate('/explore')}
          >
            <Flex direction="column" align="center">
              <IconSearch />
              <Text fz={10}>Explore</Text>
            </Flex>
          </Button>
          <Button
            variant="subtle"
            c={getRouteColor('life')}
            p={0}
            w="20%"
            h="auto"
            onClick={() => navigate('/life')}
          >
            <Flex direction="column" align="center">
              <IconRoad />
              <Text fz={10}>Life</Text>
            </Flex>
          </Button>
          <Button
            variant="subtle"
            c={getRouteColor('community')}
            p={0}
            w="20%"
            h="auto"
            onClick={() => navigate('/community')}
          >
            <Flex direction="column" align="center">
              <IconUsers />
              <Text fz={10}>Community</Text>
            </Flex>
          </Button>
          <Button
            variant="subtle"
            c={getRouteColor('market')}
            p={0}
            w="20%"
            h="auto"
            radius={0}
            onClick={() => navigate('/market')}
          >
            <Flex direction="column" align="center">
              <IconBuildingStore />
              <Text fz={10}>Market</Text>
            </Flex>
          </Button>
        </Button.Group>
      </Paper>

      <Flex
        pos="absolute"
        right={theme.spacing.md}
        top={-48 - (px(theme.spacing.md) as number)}
      >
        <CreateMenu />
      </Flex>
    </Flex>
  )

  const Header = (
    <Flex
      direction="column"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      maw={theme.breakpoints.xs}
      mx="auto"
      style={{ zIndex: 99 }}
    >
      <Paper>
        <Flex align="center" justify="space-between" gap="md" px="md" h={64}>
          <ActionIcon
            variant="subtle"
            size={32}
            onClick={() => navigate(-1)}
            style={{ visibility: route === 'home' ? 'hidden' : 'visible' }}
            c="var(--text-color)"
          >
            <IconArrowLeft />
          </ActionIcon>

          <Anchor
            underline="never"
            href="/home"
            onClick={ev => preventNavigate(ev, '/home')}
          >
            <Image
              src={
                colorScheme === 'dark' ? '/brand-light.svg' : '/brand-dark.svg'
              }
              height={32}
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
        <Divider w="100%" />
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
      maw={isWideScreen ? 360 : 280}
      zIndex={9999}
    >
      <Modal.Overlay blur={2.5} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Image
              src={
                colorScheme == 'dark'
                  ? '/images/superapp_Brand-Cool-White.svg'
                  : '/images/superapp_Brand-Cool.svg'
              }
              h="auto"
              w={160}
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

  return (
    <>
      {Header}

      <div className={styles.Layout.Body}>
        {Menu}

        <aside className={styles.Layout.SideBar}>
          <NavBar />
        </aside>

        <main className={styles.Layout.Main}>
          {/* Paper can be a different element, but not likely */}
          <div>
            <Outlet />
          </div>
        </main>
      </div>
      <div className={styles.Layout.Footer}>
        <Footer />
      </div>

      {BottomBar}
    </>
  )
}

export default AppLayout
