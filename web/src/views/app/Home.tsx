import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import { useNavigate } from 'react-router-dom'

import Emoji from '#/components/custom/Emoji'
import TextParser from '#/components/util/TextParser'
import { useTrekieStore } from '#/stores/trekieStore'
import { wrapContent } from '#/styles/shared.css'
import HabitCounter from '#/components/custom/Habit'
import NoHabitsCard from '#/components/cards/NoHabitsCard'
import NoGoalsCard from '#/components/cards/NoGoalsCard'

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

        <Text>
          Hey! Welcome to <b>your social & gamified life companion.</b>
        </Text>

        {Habits}
        {Goals}
      </Stack>
    </Stack>
  )
}

export default Home

const Habits = (
  <section>
    <Title order={4}>Habits</Title>
    <Divider mb={8} />
    <NoHabitsCard />
  </section>
)

const Goals = (
  <section>
    <Title order={4}>Life Goals</Title>
    <Divider mb={8} />
    <NoGoalsCard />
  </section>
)
