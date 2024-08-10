import {
  Alert,
  Badge,
  Box,
  Center,
  Flex,
  Group,
  Image,
  Paper,
  SegmentedControl,
  Skeleton,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  darken,
  rem,
  rgba,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconCopyCheck,
  IconNews,
  IconTableRow,
  IconTargetArrow,
} from '@tabler/icons-react'

import HabitCounter from '@/namespaces/habit/HabitCounter'
import NoHabitsCard from '@/namespaces/habit/NoHabitsCard'
import NoGoalsCard from '@/namespaces/goal/NoGoalsCard'
import { DailyStats } from '@/namespaces/life/DailyStats'

import { vanilla } from '@/styles/theme'

import { trekie } from '@/shared/lib/trekie'
import { useLiveQuery } from 'dexie-react-hooks'
import { useQueryClient } from '@tanstack/react-query'
import GoalCard from '@/namespaces/goal/GoalCard'
import { errors } from '@/shared/lib/errors'
import { useState } from 'react'
import WIPCard from '@/shared/components/cards/WIPCard'
import { useThemed } from '@/shared/hooks'
import { ContainerSheet } from '@/styles/shared.css'

function Home() {
  return (
    <Stack gap="xs" m="xs">
      <MySummary />
    </Stack>
  )
}

const MySummary = () => {
  const isMobile = !useMediaQuery(vanilla.largerThan(768))

  const user = trekie.game($ => $.user)
  if (!user) {
    errors.handle('NO_SESSION', new Error('Failed to load user in home page.'))
    return <Alert>Failed to load user in home page.</Alert>
  }

  const iconStyle = { width: rem(20), height: rem(20) }

  const [tab, setTab] = useState('habits')

  return (
    <div>
      <Stack gap={4}>
        <Box mb="md" hiddenFrom="sm">
          <DailyStats />
        </Box>

        <SegmentedControl
          value={tab} onChange={setTab}
          radius={12}
          data={[
            {
              value: 'habits',
              label: (
                <Center style={{ gap: 6 }}>
                  <IconCopyCheck style={iconStyle} />
                  <span>Habits</span>
                </Center>
              ),
            },
            {
              value: 'goals',
              label: (
                <Center style={{ gap: 6 }}>
                  <IconTargetArrow style={iconStyle} />
                  <span>Goals</span>
                </Center>
              ),
            },
            {
              value: 'feed',
              label: (
                <Center style={{ gap: 6 }}>
                  <IconNews style={iconStyle} />
                  <span>Feed</span>
                </Center>
              ),
            },
          ]}
        />

        <Tabs mt={8} color="green" variant="pills" radius="md" defaultValue="feed" value={tab}>
          <Tabs.Panel value="feed">
            <NewsFeed />
          </Tabs.Panel>
          <Tabs.Panel value="habits">
            <UserHabitSummary />
          </Tabs.Panel>
          <Tabs.Panel value="goals">
            <LifeGoalSummary />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </div>
  )
}

export default Home

function NewsFeed() {
  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet}>
      <Stack gap={0}>
        <Text ta="center" my="xs" c="dimmed">
          Nothing to see here yet.
        </Text>
      </Stack>
      <Flex>
        <Badge variant="light" color="gray" mx="auto">
          Your Activities
        </Badge>
      </Flex>
    </Box>
  )
}

function UserHabitSummary() {
  const userId = trekie.game($ => $.user?.id)

  if (!userId) return <NoHabitsCard />

  const habits = useLiveQuery(async () => {
    return trekie.db.habits.where('userId').equals(userId).toArray()
  }, [userId])

  if (!habits)
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={8} radius="xl" />
        <Skeleton height={8} mt={8} width="70%" radius="xl" />
      </>
    )

  const hasAnyHabits = habits?.length > 0
  if (!hasAnyHabits) return <NoHabitsCard />

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet}>
      <Stack gap={0}>
        {habits.map(habit => (
          <HabitCounter habitId={habit.id} key={habit.id} />
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
  const userId = trekie.game($ => $.user?.id)

  if (!userId) return <Box py={10} hiddenFrom="md"><NoHabitsCard /></Box>

  const goals = useLiveQuery(async () => trekie.db.goals.where('userId').equals(userId).toArray(), [], 'loading')

  if (goals == 'loading')
    return (<>
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={8} radius="xl" />
      <Skeleton height={8} mt={8} width="70%" radius="xl" />
    </>)

  const hasAnyLifeGoals = goals.length > 0

  if (!hasAnyLifeGoals) return <NoGoalsCard />

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet}>
      <Stack gap={0}>
        {goals.map(goal => (
          <GoalCard id={goal.id} key={goal.id} />
        ))}
      </Stack>
      <Flex mt="xs">
        <Badge variant="light" color="gray" mx="auto">
          Track your goals!
        </Badge>
      </Flex>
    </Box>
  )
}
