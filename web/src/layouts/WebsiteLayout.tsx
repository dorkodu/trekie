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
  rgba,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'

import { IconUsers } from '@tabler/icons-react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

import * as Nav from '#/components/custom/Nav'

import { trekie } from "#/commons/lib/trekie"

import * as LayoutStyle from '#/styles/Layout.css'
import * as WebsiteStyle from '#/styles/website/Website.css'

import { useThemed, theme, vanilla } from '#/styles/theme'
import Emoji from '#/components/custom/Emoji'
import ColorToggle from '#/components/util/ColorToggle'
import { socialLinks } from '#/commons/lib/website'

function WebsiteLayout() {

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const navigate = useNavigate()
  const isWideScreen = useMediaQuery('(min-width: 768px)')

  return (
    <div className={LayoutStyle.Layout.Root}>
      <Header />
      <div className={LayoutStyle.Layout.Body}>
        <main className={LayoutStyle.Layout.Main}>
          {/* Paper can be a different element, but not likely */}
          <div>
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default WebsiteLayout

function Header() {
  const isMobile = useMediaQuery(vanilla.smallerThan("sm"))

  return (
    <Box p={10}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: 10,
          alignContent: "center",
          justifyItems: "center",
          alignItems: "center",
        }}>
        <Image
          src={useThemed({ dark: "/images/trekie_Brand_White.svg", light: "/images/trekie_Brand.svg" })}
          h="auto"
          w={220}
          px="md"
        />

        <Paper py={4} px={10}>
          <Group gap={2}>
            {[
              ['Features', '/welcome/#features'],
              ['Premium', '/welcome/#premium'],
              ['Company', '/welcome/#company'],
              ['FAQ', '/welcome/#faq'],
            ].map(link => (
              <Anchor
                component={Link}
                //@ts-ignore
                to={link[1]}
                key={link[1]}
                className={WebsiteStyle.Header.Link}
              >
                {link[0]}
              </Anchor>
            ))}
          </Group>
        </Paper>

        <Group gap={8}>
          <Button fw={700}>GET STARTED</Button>
          <ColorToggle size="xs" />
        </Group>
      </Box>
    </Box>
  )
}


function Footer() {
  return (
    <Box className={WebsiteStyle.Footer.Root}>
      <Group align="flex-start">
        <Stack gap={0} px={10} w={"35%"} miw={200}>
          <Anchor display="block" href="https://trekie.io" target="_blank">
            <Image
              src="/images/trekie_Icon.svg"
              w={80}
              h={80}
              display="block"
            />
          </Anchor>
          <Text className={WebsiteStyle.Footer.DorkoduMotto} fw={700} ta="left" mt={16} my={4} size="sm">
            Your social and gamified <br /> productivity companion.
          </Text>
          <Text c="dimmed" fw={500}>
            Dorkodu &copy; {new Date().getFullYear()}
          </Text>
        </Stack>
        <SimpleGrid style={{ flexGrow: 1 }} spacing="xs" cols={{ base: 2, xs: 2, sm: 4 }}>
          <Stack gap={4} p={10}>
            <Text className={WebsiteStyle.Footer.ListTitle}>Company</Text>
            {[
              ['About', '/about'],
              ['Features', '/welcome/#features'],
              ['Pricing', '/welcome/#pricing'],
              ['Roadmap', '/welcome/#roadmap'],
              ['Method', '/welcome/#method'],
              ['FAQs', '/welcome/#faq'],
            ].map(link => (
              <Anchor
                component={Link}
                //@ts-ignore
                to={link[1]}
                key={link[1]}
                className={WebsiteStyle.Footer.Link}
              >
                {link[0]}
              </Anchor>
            ))}
          </Stack>

          <Stack gap={4} p={10}>
            <Text className={WebsiteStyle.Footer.ListTitle}>Resources</Text>
            {[
              ['Help', '/help'],
              ['Blog', 'https://dorkodu.substack.com'],
              ['Community', 'https://t.me/dorkodu'],
              ['Jobs', 'https://dorkodu.com/jobs'],
              ['Press', '/press'],
              ['Contact', '/contact'],
            ].map(link => (
              <Anchor
                component={Link}
                //@ts-ignore
                to={link[1]}
                key={link[1]}
                className={WebsiteStyle.Footer.Link}
              >
                {link[0]}
              </Anchor>
            ))}
          </Stack>

          <Stack gap={4} p={10}>
            <Text className={WebsiteStyle.Footer.ListTitle}>Legal</Text>
            {[
              ['Terms', '/legal/terms'],
              ['Privacy', '/legal/privacy'],
              ['Community Rules', '/legal/community'],
              ['Company', 'https://dorkodu.com'],
            ].map(link => (
              <Anchor
                component={Link}
                //@ts-ignore
                to={link[1]}
                key={link[1]}
                classNames={{
                  root: WebsiteStyle.Footer.Link,
                }}
              >
                {link[0]}
              </Anchor>
            ))}
          </Stack>
          <Stack gap={4} p={10}>
            <Text className={WebsiteStyle.Footer.ListTitle}>Social</Text>
            {socialLinks.map(link => (
              <Anchor
                //@ts-ignore
                href={link.to} key={link.text}
                classNames={{
                  root: WebsiteStyle.Footer.Link,
                }}
              >
                <Group wrap='nowrap' gap={4}>
                  <span><link.icon /></span>
                  <span>{link.text}</span>
                </Group>
              </Anchor>
            ))}
          </Stack>
        </SimpleGrid>
      </Group>
    </Box>
  )
}
