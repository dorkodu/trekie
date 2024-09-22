import { Alert, Badge, Box, Center, Flex, SegmentedControl, Skeleton, Stack, Tabs, rem } from '@mantine/core'
import { IconCopyCheck, IconTargetArrow } from '@tabler/icons-react'

import HabitCounter from '@/namespaces/habit/HabitCounter'
import NoHabitsCard from '@/namespaces/habit/NoHabitsCard'
import NoGoalsCard from '@/namespaces/goal/NoGoalsCard'
import { DailyStats } from '@/namespaces/life/DailyStats'

import { trekie } from '@/shared/lib/trekie'
import { useLiveQuery } from 'dexie-react-hooks'
import { useQuery } from '@tanstack/react-query'
import GoalCard from '@/namespaces/goal/GoalCard'
import { errors } from '@/shared/lib/errors'
import { useState } from 'react'
import { ContainerSheet } from '@/styles/shared.css'

function Home() {

  const user = trekie.game($ => $.user)
  if (!user) {
    errors.handle('NO_SESSION', new Error('Failed to load user in home page.'))
    return <Alert>Failed to load user in home page.</Alert>
  }

  const iconStyle = { width: rem(20), height: rem(20) }

  const [tab, setTab] = useState('habits')

  return (
    <Box m="xs">
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
          ]}
        />

        <Tabs mt={8} color="green" variant="pills" radius="md" defaultValue="feed" value={tab}>
          <Tabs.Panel value="habits">
            <HabitSummary />
          </Tabs.Panel>
          <Tabs.Panel value="goals">
            <LifeGoalSummary />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  )
}

export default Home

function HabitSummary() {
  const userId = trekie.game($ => $.user?.id)

  if (!userId) return <NoHabitsCard />

  const { data, error, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['todos'], queryFn: async () => {
      return trekie.db.habits.where('userId').equals(userId).toArray()
    }
  })

  if (isLoading)
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={8} radius="xl" />
        <Skeleton height={8} mt={8} width="70%" radius="xl" />
      </>
    )

  const hasAnyHabits = isSuccess && data?.length > 0
  if (!hasAnyHabits) return <NoHabitsCard />

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet}>
      <Stack gap={0}>
        {data.map(habit => (
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

  const goals = useLiveQuery(async () => trekie.db.goals.where('userId').equals(userId).toArray(), [userId])

  if (!goals)
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

// Confetti
// https://www.kirilv.com/canvas-confetti