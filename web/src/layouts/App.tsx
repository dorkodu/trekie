import { Anchor, Card, Divider, Group, Image, Modal, Paper, Stack, ThemeIcon, useMantineColorScheme, } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Link, Outlet } from 'react-router-dom'

import { AppMenu } from '@web/shared/components/cards/Menu'
import * as Nav from '@web/shared/components/layout/Nav'

import Emoji from '@web/shared/components/misc/Emoji'

import { DailyStats } from '@web/namespaces/life/DailyStats'
import { useAppStore } from '@web/shared/stores/appStore'

import { HeadBar } from '@web/shared/components/layout/HeadBar'
import { Header } from '@web/shared/components/layout/Header'
import { NavigationBar } from '@web/shared/components/layout/NavigationBar'

import { DailyHintCard } from '@web/shared/components/cards/DailyHintCard'
import * as styles from '@web/styles/Layout.css'

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
          <Nav.Bar links={Nav.navLinks} />
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