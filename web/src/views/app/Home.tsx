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
import HabitCounter from '#/components/custom/Habit'

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

          {Habits}
          {Goals}
        </Flex>

        <SimpleGrid cols={2} spacing="md"></SimpleGrid>
      </Stack>
    </Stack>
  )
}

export default Home

const Habits = (
  <section>
    <Title order={3}>Habits</Title>
    <HabitCounter
      habit={{
        id: '1',
        title: 'Read 50 pages everyday.',
        count: 1,
        dailyTarget: 5,
        description: 'YOu should read something each day.',
        userId: '1',
        date: 1000000000000,
        heatmap: { 1: 1, 2: 1 },
      }}
      showHeatmap
    />
  </section>
)

const Goals = (
  <section>
    <Title order={3}>Life Goals</Title>
  </section>
)
