import { Route, useAppStore } from '#/stores/appStore'
import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Flex,
  Image,
  MantineColor,
  Modal,
  Paper,
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
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

import CreateMenu from '#/components/menus/CreateMenu'
import Footer from '#/components/custom/Footer'
import { NavBar } from '#/components/cards/NavBar'
import { AppMenu } from '#/components/cards/Menu'

import { useTrekieStore } from '#/stores/trekieStore'

import * as styles from '#/styles/Layout.css'
import { vanilla } from '#/styles/theme'

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
          <Button
            variant="subtle"
            c={getRouteColor('home')}
            p={0}
            w="20%"
            h="auto"
            radius={0}
            component={Link}
            to="/home"
          >
            <Flex direction="column" align="center">
              <IconHome />
              <Text size="xs">Home</Text>
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
            style={{ visibility: route === 'home' ? 'hidden' : 'visible' }}
            c="var(--text-color)"
          >
            <IconArrowLeft />
          </ActionIcon>

          <Anchor underline="never" to="/home" component={Link}>
            <Image
              src={
                colorScheme === 'dark' ? '/brand-light.svg' : '/brand-dark.svg'
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

  return (
    <>
      {TopBar}

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
