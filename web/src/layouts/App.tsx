import { Anchor, Card, Divider, Group, Image, Modal, Paper, Stack, ThemeIcon, useMantineColorScheme, }
  from '@mantine/core'
import { Link, Outlet } from 'react-router-dom'
import { useMediaQuery } from '@mantine/hooks'

import * as Nav from '@/shared/components/layout/Nav'
import { AppMenu } from '@/shared/components/cards/Menu'

import Emoji from '@/shared/components/misc/Emoji'

import { useAppStore } from '@/shared/stores/appStore'
import { DailyStats } from '@/namespaces/life/DailyStats'

import { Header } from '@/shared/components/layout/Header'
import { HeadBar } from '@/shared/components/layout/HeadBar'
import { NavigationBar } from '@/shared/components/layout/NavigationBar'

import * as styles from '@/styles/Layout.css'
import { DailyHintCard } from '@/shared/components/cards/DailyHintCard'

export const navLinks = [
  { icon: <Emoji emoji="🏡" size={24} />, text: 'Home', path: '/home' },
  { icon: <Emoji emoji="🌎" size={24} />, text: 'Explore', path: '/explore' },
  { icon: <Emoji emoji="👥" size={24} />, text: 'Social', path: '/social' },
  { icon: <Emoji emoji="💸" size={24} />, text: 'Market', path: '/market' },
]

function AppLayout() {
  return (
    <div className={styles.Layout.Root}>
      <HeadBar />

      <header className={styles.Layout.Header}>
        <Header />
      </header>
      <div className={styles.Layout.Body}>

        <Menu />

        <nav className={styles.Layout.Nav}>
          <Nav.Bar links={navLinks} />
        </nav>

        <main className={styles.Layout.Main}>
          <div><Outlet /></div>
        </main>

        <aside className={styles.Layout.Aside}>
          <DailyStats />
          <DailyHintCard />
          <footer className={styles.Layout.Footer}>{Footer}</footer>
        </aside>
      </div>

      <NavigationBar />
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

function Menu() {
  const { colorScheme } = useMantineColorScheme()
  const isWideScreen = useMediaQuery('(min-width: 768px)')
  const menu = useAppStore($ => $.menu)

  return (
    <Modal.Root
      size="auto"
      opened={menu.opened}
      onClose={menu.close}
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
        <Paper style={{ backgroundColor: "unset" }}>
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
        </Paper>
      </Modal.Content>
    </Modal.Root>
  )
}