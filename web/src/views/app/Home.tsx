import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconBuildingStore, IconSettings } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import Emoji from '#/components/custom/Emoji'
import TextParser from '#/components/util/TextParser'
import { useTrekieStore } from '#/stores/trekieStore'
import { wrapContent } from '#/styles/shared.css'
import Heatmap from '#/components/custom/Heatmap'
import NoHabitsCard from '#/components/cards/NoHabitsCard'

function Home() {
  const navigate = useNavigate()

  const userId = useTrekieStore(state => state.userId)
  const users = useTrekieStore(state => state.users)
  const user = userId ? users[userId] : undefined

  return (
    <Stack m="md" gap="xl">
      <Stack gap="xs">
        <Title order={4} className={wrapContent}>
          <Emoji emoji="👋" /> Welcome, Doruk
          <TextParser ids={['emoji']} text={user?.name ?? ''} />
        </Title>

        <Flex direction="column" align="start" gap="xs">
          <Text>
            Hey! Welcome to <b>your social & gamified life companion.</b>
          </Text>

          <Group>
            <Button variant="filled">Primary action</Button>
            <Button variant="default">Secondary action</Button>
          </Group>

          <Text>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
            autem optio veniam est atque natus quisquam culpa ipsum iste,
            placeat cumque vero, fugit, tenetur explicabo.
          </Text>

          <div>
            <NoHabitsCard />
          </div>
        </Flex>

        <SimpleGrid cols={2} spacing="md"></SimpleGrid>
      </Stack>
    </Stack>
  )
}

export default Home

function Sidebar() {
  return (
    <Box>
      <Stack>
        <Button leftSection={<IconBuildingStore />}>Home</Button>
        <Button leftSection={<IconBuildingStore />}>Your Page</Button>
        <Button leftSection={<IconBuildingStore />}></Button>
        <Button leftSection={<IconBuildingStore />}>Market</Button>
        <Button leftSection={<IconSettings />}>Settings</Button>
      </Stack>
    </Box>
  )
}
