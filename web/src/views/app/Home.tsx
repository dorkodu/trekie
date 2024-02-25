import { Badge, Box, Button, Card, Divider, Flex, Group, Image, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPinned } from '@tabler/icons-react'

import { useNavigate } from 'react-router-dom'

import Emoji from '#/components/custom/Emoji'
import TextParser from '#/components/util/TextParser'
import HabitCounter from '#/components/custom/HabitCounter'
import NoHabitsCard from '#/components/cards/NoHabitsCard'
import NoGoalsCard from '#/components/cards/NoGoalsCard'
import { DailyStats, MinimalSumCard } from '#/components/cards/DailyStats'

import { wrapContent } from '#/styles/shared.css'
import { vanilla } from '#/styles/theme'

import { useSocialStore } from '#/stores/socialStore'

import { trekie } from "#/lib/trekie"


function Home() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery(vanilla.smallerThan("sm"))

  const user = trekie.game($ => $.user)

  const momentum = trekie.game($ => $.momentum)
  const xp = trekie.game($ => $.xp)
  const coins = trekie.game($ => $.coins)
  const streak = trekie.game($ => $.streak)
  const progress = trekie.game($ => $.dailyProgress)

  return (
    <Stack gap="xs" m="xs">

      <Group justify="space-between">
        <Image src={user?.pictureUrl} w={64} h={64} radius={10} />
        <SimpleGrid cols={{ base: 2 }} spacing="xs">
          <MinimalSumCard
            icon={<Emoji emoji="💎" size={24} />}
            value={28347}
            color="blue"
            kind='XP'
          />
          <MinimalSumCard
            icon={<Emoji emoji="🪙" size={24} />}
            value={coins}
            color="yellow"
            kind='COINS'
          />
        </SimpleGrid>
      </Group>

      <Title order={4} className={wrapContent}>
        <Emoji emoji="👋" size={24} /> Welcome,{' '}
        <TextParser ids={['emoji']} text={user?.name ?? ''} />
      </Title>

      <Text>
        Hey! Welcome to <b>your social & gamified life companion.</b>
      </Text>

      {isMobile && <DailyStats />}

      {Goals}
      {PinnedHabits}
      {Habits}
    </Stack>
  )
}

export default Home

const Habits = (
  <section>
    <Title order={4}>Habits</Title>
    <Divider mb={8} />
    <UserHabitSummary />
  </section>
)

const PinnedHabits = (
  <section>
    <Divider
      mb={8}
      label={
        <>
          <IconPinned />
          Pinned
        </>
      }
      labelPosition="left"
      styles={{ label: { fontSize: 14, fontWeight: 600 } }}
    />
    <Box
      style={{
        background: vanilla.colors.gray.light,
        padding: 6,
        borderRadius: 20,
      }}
    >
      <Stack gap={0}></Stack>
      <Flex>
        <Badge variant="light" color="gray" mx="auto">
          {false ? 'Your favorite habits' : 'No pinned habits'}
        </Badge>
      </Flex>
    </Box>
  </section>
)

function UserHabitSummary() {
  const habits = trekie.habit.store($ => $.habits)
  const habitCount = trekie.habit.count()
  const hasAnyHabits = habitCount > 0

  if (!hasAnyHabits) return <NoHabitsCard />

  return (
    <Box
      style={{
        background: vanilla.colors.gray.light,
        padding: 6,
        borderRadius: 20,
      }}
    >
      <Stack gap={0}>
        {Object.keys(habits).map(habitId => (
          <HabitCounter habitId={habitId} key={habitId} />
        ))}
      </Stack>
      <Flex>
        <Badge variant="light" color="gray" mx="auto">
          Check your daily habits!
        </Badge>
      </Flex>
    </Box>
  )
}

function LifeGoalSummary() {
  const hasAnyLifeGoals = false

  if (!hasAnyLifeGoals) return <NoGoalsCard />

  return (
    <Box>
      <Stack>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Stack>
    </Box>
  )
}

const Goals = (
  <section>
    <Title order={4}>Life Goals</Title>
    <Divider mb={8} />
    <LifeGoalSummary />
  </section>
)
