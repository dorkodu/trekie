import { Badge, Box, Button, Card, Divider, Flex, Group, Image, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCake, IconCalendar, IconCopyCheck, IconPinned, IconTarget, IconTargetArrow } from '@tabler/icons-react'

import { useNavigate } from 'react-router-dom'

import Emoji from '#/components/custom/Emoji'

import EnhancedText from '#/components/util/TextParser'
import HabitCounter from '#/components/custom/HabitCounter'
import NoHabitsCard from '#/components/cards/NoHabitsCard'
import NoGoalsCard from '#/components/cards/NoGoalsCard'
import { DailyStats, SumCard } from '#/components/cards/DailyStats'

import { wrapContent } from '#/styles/shared.css'
import { vanilla } from '#/styles/theme'

import { useSocialStore } from '#/stores/socialStore'

import { trekie } from "#/lib/trekie"
import GoalCard from '#/components/cards/GoalCard'
import { relativeDateString } from '#/lib/util'


function Home() {
  const navigate = useNavigate()
  const isMobile = !useMediaQuery(vanilla.largerThan(768))

  const user = trekie.game($ => $.user)

  return (
    <Stack gap="xs" m="xs">

      <MyProfile />

      {isMobile && <DailyStats />}

      {Goals}
      {PinnedHabits}
      {Habits}
    </Stack>
  )
}

const MyProfile = () => {
  const user = trekie.game($ => $.user)

  if (!user) return <Paper>Failed to load user.</Paper>

  return (
    <Paper>
      <Group mb={10} gap="sm" wrap="nowrap">
        <Image src={user.pictureUrl} w={64} h={64} radius={10} />
        <Stack gap={0}>
          <Text fw={700} size="lg" lh={1}>
            <EnhancedText ids={['emoji']} text={user.name} />
          </Text>
          <Text c="dimmed" fw={500}>@{user.username}</Text>
        </Stack>
      </Group>

      <Stack gap={0}>
        <Text size="sm">{user.bio}</Text>

        <Group gap="xs">
          <Group gap={2}>
            <ThemeIcon c="dimmed" variant="transparent" size={26}><IconCalendar size={24} /></ThemeIcon>
            <Text c="dimmed" lh={1} size="sm" mt={4}>Joined {relativeDateString(user.joinedAt)}</Text>
          </Group>

          <Group gap={2}>
            <ThemeIcon c="dimmed" variant="transparent" size={26}><IconCake size={24} /></ThemeIcon>
            <Text c="dimmed" lh={1} size="sm" mt={4}>Born {relativeDateString(user.joinedAt)}</Text>
          </Group>

          <Group gap={2}>
            <ThemeIcon c="dimmed" variant="transparent" size={26}><IconCalendar size={24} /></ThemeIcon>
            <Text c="dimmed" lh={1} size="sm" mt={4}>Joined {relativeDateString(user.joinedAt)}</Text>
          </Group>

        </Group>

      </Stack>
    </Paper >
  )
}


export default Home

const Habits = (
  <section>
    <Divider
      mb={8}
      label={
        <Group gap={4} align="center" justify="center">
          <IconCopyCheck />
          Habits
        </Group>
      }
      labelPosition="left"
      styles={{ label: { fontSize: 14, fontWeight: 600 } }}
    />
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
  const hasAnyLifeGoals = trekie.goal.count() > 0
  const goals = trekie.goal.store($ => $.goals)

  if (!hasAnyLifeGoals) return <NoGoalsCard />

  return (
    <Box>
      <Stack>
        {Object.keys(goals).map((id) =>
          <GoalCard id={id} />
        )}
      </Stack>
    </Box>
  )
}

const Goals = (
  <section>
    <Divider
      mb={8}
      label={
        <Group gap={4} align="center" justify="center">
          <IconTargetArrow />
          Life Goals
        </Group>
      }
      labelPosition="left"
      styles={{ label: { fontSize: 14, fontWeight: 600 } }}
    />
    <LifeGoalSummary />
  </section>
)
