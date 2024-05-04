import { Anchor, Badge, Box, Divider, Flex, Group, Image, Paper, Skeleton, Stack, Tabs, Text, ThemeIcon, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBriefcase, IconCake, IconCalendar, IconCopyCheck, IconLink, IconMapPin, IconPinned, IconTargetArrow } from '@tabler/icons-react'

import { useNavigate } from 'react-router-dom'


import HabitCounter from '@/namespaces/habit/HabitCounter'
import NoHabitsCard from '@/namespaces/habit/NoHabitsCard'
import NoGoalsCard from '@/namespaces/goal/NoGoalsCard'
import { DailyStats } from '@/namespaces/life/DailyStats'

import { vanilla } from '@/styles/theme'


import { trekie } from "@/shared/lib/trekie"
import { relativeDateString } from '@/shared/utils/format'
import { useLiveQuery } from 'dexie-react-hooks'
import { useQueryClient } from '@tanstack/react-query'
import GoalCard from '@/namespaces/goal/GoalCard'


function Home() {
  const navigate = useNavigate()

  const user = trekie.game($ => $.user)

  return (
    <Stack gap="xs" m="xs">

      <MyProfile />

    </Stack>
  )
}

const MyProfile = () => {
  const isMobile = !useMediaQuery(vanilla.largerThan(768))

  const user = trekie.game($ => $.user)

  if (!user) return <Paper>Failed to load user.</Paper>

  const ProfileEntry = ({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) => (
    <Group gap={2}>
      <ThemeIcon c="dimmed" variant="transparent" size={26}>{icon}</ThemeIcon>
      <Text c="dimmed" lh={1} size="sm" mt={4}>{text}</Text>
    </Group>
  )

  const iconStyle = { width: rem(20), height: rem(20) }

  return (
    <Paper>
      <Group mb={10} gap="sm" wrap="nowrap">
        <Image src={user.pictureUrl} w={64} h={64} radius={10} />
        <Stack gap={0}>
          <Text fw={700} size="lg" lh={1}>
            {user.name}
          </Text>
          <Text c="dimmed" fw={500}>@{user.username}</Text>
        </Stack>
      </Group>

      <Stack gap={4}>
        <Text size="sm">{user.bio}</Text>

        <Group gap={4} pb={8}>
          <ProfileEntry icon={<IconCalendar size={24} />} text={`Joined ${relativeDateString(user.joinedAt)}`} />
          {user.birthday && <ProfileEntry icon={<IconCake size={24} />} text={`Born ${relativeDateString(user.birthday)}`} />}
          {user.category && <ProfileEntry icon={<IconBriefcase size={24} />} text={user.category} />}
          {user.location && <ProfileEntry icon={<IconMapPin size={24} />} text={user.location} />}
          {user.url && <ProfileEntry icon={<IconLink size={24} />} text={<Anchor href={user.url} referrerPolicy="no-referrer" target="_blank">{user.url}</Anchor>} />}
        </Group>

        {isMobile && <DailyStats />}

        <Tabs mt={8} color="green" variant="default" radius="md" defaultValue="habits">
          <Tabs.List>
            <Tabs.Tab value="goals" leftSection={<IconTargetArrow style={iconStyle} />}>
              Life Goals
            </Tabs.Tab>
            <Tabs.Tab value="habits" leftSection={<IconCopyCheck style={iconStyle} />}>
              Habits
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="habits">
            <UserHabitSummary />
          </Tabs.Panel>

          <Tabs.Panel value="goals">
            <LifeGoalSummary />
          </Tabs.Panel>
        </Tabs>

      </Stack>
    </Paper>
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
  const userId = trekie.game($ => $.user?.id)

  if (!userId) return <Box py={10}><NoHabitsCard /></Box>

  /** */

  const habits = useLiveQuery(
    async () => {
      return trekie.db.habits
        .where('userId')
        .equals(userId)
        .toArray();
    },
    [userId]
  )

  if (!habits)
    return <>
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={8} radius="xl" />
      <Skeleton height={8} mt={8} width="70%" radius="xl" />
    </>

  const hasAnyHabits = habits?.length > 0
  if (!hasAnyHabits)
    return <Box py={10}><NoHabitsCard /></Box>

  return (
    <Box
      style={{
        background: vanilla.colors.gray.light,
        padding: 6,
        borderRadius: 20,
      }}

      py={6}
      my={10}
    >
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
  if (!userId) return <Box py={10}><NoHabitsCard /></Box>

  const queryClient = useQueryClient()

  const goals = useLiveQuery(
    async () => trekie.db.goals.where('userId').equals(userId).toArray(),
    [], "loading"
  )

  if (goals == "loading")
    return <>
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={8} radius="xl" />
      <Skeleton height={8} mt={8} width="70%" radius="xl" />
    </>

  const hasAnyLifeGoals = goals.length > 0

  if (!hasAnyLifeGoals) return <NoGoalsCard />

  return (
    <Box py={10}>
      <Stack>
        {goals.map((goal) =>
          <GoalCard id={goal.id} key={goal.id} />
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
