import {
  Anchor,
  Box,
  Button,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'

import { Link, Outlet } from 'react-router-dom'
import { useMediaQuery } from '@mantine/hooks'


import * as LayoutStyle from '@/styles/Layout.css'
import * as WebsiteStyle from '@/styles/website/Website.css'

import { vanilla } from '@/styles/theme'
import ColorToggle from '@/shared/components/misc/ColorToggle'
import { socialLinks } from '@/shared/website'
import { useThemed } from '@/shared/hooks'

function WebsiteLayout() {
  return (
    <div className={LayoutStyle.Layout.Root}>
      <Header />
      <div className={LayoutStyle.Layout.Body}>
        <main className={LayoutStyle.Layout.Main}>
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
          w={"calc(200px + 2.5vw)"}
          px="md"
        />

        <Paper py={4}>
          <Group gap={0}>
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

        <Group gap={8} wrap="nowrap">
          <Button fw={700}>GET STARTED</Button>
          <ColorToggle size="md" />
        </Group>
      </Box>
    </Box>
  )
}

function Footer() {
  return (
    <Box className={WebsiteStyle.Footer.Root}>
      <Group align="flex-start">
        <Stack gap={0} px={10} w={"calc(20% + 5vw)"} miw={200}>
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
