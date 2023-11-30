import {
  Box,
  Button,
  Flex,
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

function Home() {
  const navigate = useNavigate()

  const userId = useTrekieStore(state => state.userId)
  const users = useTrekieStore(state => state.users)
  const user = userId ? users[userId] : undefined

  return (
    <Stack m="md" gap="xl">
      <Stack gap="xs">
        <Title order={4} className={wrapContent}>
          <Emoji emoji="👋" /> Welcome,&nbsp;
          <TextParser ids={['emoji']} text={user?.name ?? ''} />
        </Title>

        <Flex></Flex>

        <SimpleGrid cols={2} spacing="md">
          <Flex direction="column" align="start" gap="xs">
            <Text>
              Hey! Welcome <b>The gamified digital life companion.</b>
            </Text>

            <Paper>
              <Image />
              <Text>Welcome, Doruk.</Text>
              <Text>
                Manage your information, privacy, and security to make Dorkodu
                work better for you.
              </Text>
            </Paper>

            <Button variant="filled">Primary action</Button>
            <Button variant="default">Secondary action</Button>
          </Flex>

          {user && (
            <Paper withBorder p="md">
              <Flex direction="column" justify="space-evenly" gap="xs"></Flex>
            </Paper>
          )}
        </SimpleGrid>
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
