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
  SimpleGrid,
  Stack,
  Text,
  px,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'

import { IconUsers } from '@tabler/icons-react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

import * as Nav from '#/components/custom/Nav'

import { useTrekieStore } from '#/stores/trekieStore'

import * as styles from '#/styles/Layout.css'
import { theme, vanilla } from '#/styles/theme'
import Emoji from '#/components/custom/Emoji'

const navLinks = [
  { icon: <Emoji emoji="🏡" size={26} />, text: 'Home', path: '/home' },
]

function WebsiteLayout() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const navigate = useNavigate()
  const isWideScreen = useMediaQuery('(min-width: 768px)')

  const Footer = (
    <>
      <Divider m={16} mb={0} />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
        <div></div>

        <Stack gap={4} p={10}>
          <Text fw={700}>Product</Text>
          {[
            ['About', '/about'],
            ['Method', '/about'],
            ['FAQs', '/about'],
            ['About', '/about'],
          ].map(link => (
            <Anchor
              component={Link}
              //@ts-ignore
              to={link[1]}
              key={link[1]}
              c="dimmed"
              fw={450}
            >
              {link[0]}
            </Anchor>
          ))}
        </Stack>

        <Stack gap={4} p={10}>
          <Text fw={800}>Resources</Text>
          {[
            ['Help', '/help'],
            ['FAQs', '/faq'],
            ['Press', '/press'],
            ['Careers', 'https://dorkodu.com/jobs'],
            ['Blog', 'https://dorkodu.substack.com'],
          ].map(link => (
            <Anchor
              component={Link}
              //@ts-ignore
              to={link[1]}
              key={link[1]}
              c="dimmed"
              fw={450}
            >
              {link[0]}
            </Anchor>
          ))}
          <Text fw={800}>Legal</Text>
          {[
            ['Terms', '/legal/terms'],
            ['Privacy', '/legal/privacy'],
            ['Company', 'https://dorkodu.com'],
          ].map(link => (
            <Anchor
              component={Link}
              //@ts-ignore
              to={link[1]}
              key={link[1]}
              c="dimmed"
              fw={450}
            >
              {link[0]}
            </Anchor>
          ))}
        </Stack>

        <Stack gap={0} px={10} justify="space-between">
          <Anchor display="block" href="https://dorkodu.com" target="_blank">
            <Image
              src="/images/dorkodu_Logo_Colorful.svg"
              w={150}
              m={10}
              h="auto"
              display="block"
            />
          </Anchor>
        </Stack>
      </SimpleGrid>
    </>
  )

  return (
    <div className={styles.Layout.Root}>
      <div className={styles.Layout.Body}>
        <main className={styles.Layout.Main}>
          {/* Paper can be a different element, but not likely */}
          <div>
            <Outlet />
          </div>
        </main>
      </div>
      {Footer}
    </div>
  )
}

export default WebsiteLayout
