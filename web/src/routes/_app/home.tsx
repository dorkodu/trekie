import { Alert, Badge, Box, Center, Flex, SegmentedControl, Skeleton, Stack, Tabs, rem } from '@mantine/core'
import { IconCopyCheck, IconTargetArrow } from '@tabler/icons-react'

import NoGoalsCard from '@web/namespaces/goal/NoGoalsCard'
import HabitCounter from '@web/namespaces/habit/HabitCounter'
import NoHabitsCard from '@web/namespaces/habit/NoHabitsCard'
import { DailyStats } from '@web/namespaces/life/DailyStats'

import GoalCard from '@web/namespaces/goal/GoalCard'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from 'new/src/lib/db'
import { errors } from 'new/src/lib/errors'
import { trekie } from 'new/src/lib/trekie'
import { useState } from 'react'

function Home() {

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
            <CommitmentsFeed />
          </Tabs.Panel>
          <Tabs.Panel value="goals">
            <GoalsFeed />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  )
}

export default Home

function CommitmentsFeed() {
  const userId = trekie.use($ => $.user.id)


  const query = useLiveQuery(() =>
    db.habits
      .where({ 'userId': userId })
      .filter((habit) => !Object.hasOwn(habit, 'isDeleted'))
      .toArray()
    , [])


  if (!query)
    return (
      <Box h={250}>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={8} radius="xl" />
        <Skeleton height={8} mt={8} width="70%" radius="xl" />
      </Box>
    )

  const hasAnyHabits = query?.length > 0
  if (!hasAnyHabits) return <NoHabitsCard />

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet} h="auto" mih={150}>
      <Stack gap={0}>
        {query.map(habit => (
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

function GoalsFeed() {
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
      <Stack gap="xs">
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