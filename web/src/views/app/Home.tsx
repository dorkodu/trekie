import { Alert, Badge, Box, Center, Flex, SegmentedControl, Skeleton, Stack, Tabs, rem } from '@mantine/core'
import { IconCopyCheck, IconTargetArrow } from '@tabler/icons-react'

import NoGoalsCard from '@web/namespaces/goal/NoGoalsCard'
import HabitCounter from '@web/namespaces/habit/HabitCounter'
import NoHabitsCard from '@web/namespaces/habit/NoHabitsCard'
import { DailyStats } from '@web/namespaces/life/DailyStats'

import { useQuery } from '@tanstack/react-query'
import GoalCard from '@web/namespaces/goal/GoalCard'
import { db } from '@web/shared/lib/db'
import { errors } from '@web/shared/lib/errors'
import { trekie } from '@web/shared/lib/trekie'
import { trpc } from '@web/shared/lib/trpc'
import { ContainerSheet } from '@web/styles/shared.css'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

function Home() {

  const greetingQuery = useQuery({
    ...trpc.greeting.queryOptions({ name: 'Jerry' })
  })


  const user = trekie.use($ => $.user)
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
                  <span>Commitments</span>
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
  const userId = trekie.use($ => $.user.id)

  const { data, error, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['habits'], queryFn: async () => {
      return db.habits.where('userId').equals(userId).toArray()
    }
  })

  if (isLoading)
    return (
      <Box h={250}>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={8} radius="xl" />
        <Skeleton height={8} mt={8} width="70%" radius="xl" />
      </Box>
    )

  const hasAnyHabits = isSuccess && data?.length > 0
  if (!hasAnyHabits) return <NoHabitsCard />

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet} h="auto" mih={150}>
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
  const userId = trekie.use($ => $.user?.id)

  if (!userId) return <Box py={10} hiddenFrom="md"><NoHabitsCard /></Box>

  const goals = useLiveQuery(async () => db.goals.where('userId').equals(userId).toArray(), [userId])

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