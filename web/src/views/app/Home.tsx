import { Alert, Anchor, Badge, Box, Button, Card, Divider, Flex, Group, Image, Loader, Paper, SimpleGrid, Skeleton, Stack, Tabs, Text, ThemeIcon, Title, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBriefcase, IconCake, IconCalendar, IconCopyCheck, IconInfoCircle, IconLink, IconLocation, IconMapPin, IconPinned, IconTarget, IconTargetArrow } from '@tabler/icons-react'

import { useNavigate } from 'react-router-dom'

import Emoji from '@/components/custom/Emoji'

import EnhancedText from '@/components/util/TextParser'
import HabitCounter from '@/components/custom/HabitCounter'
import NoHabitsCard from '@/components/cards/NoHabitsCard'
import NoGoalsCard from '@/components/cards/NoGoalsCard'
import { DailyStats, SumCard } from '@/components/cards/DailyStats'

import { wrapContent } from '@/styles/shared.css'
import { vanilla } from '@/styles/theme'

import { useSocialStore } from '@/stores/socialStore'

import { trekie } from "@/commons/lib/trekie"
import GoalCard from '@/components/cards/GoalCard'
import { relativeDateString } from '@/commons/lib/util'
import { useLiveQuery } from 'dexie-react-hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'


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


        <Tabs mt={8} variant="default" radius="md" defaultValue="gallery">
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
    async () => {
      console.log("goals query started")

      return await trekie.db.goals
        .where('userId')
        .equals("0")
        .toArray()
    },
    [],
    "loading"
  )

  if (goals == "loading")
    return <>
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={8} radius="xl" />
      <Skeleton height={8} mt={8} width="70%" radius="xl" />
    </>

  console.log("Al sana goals knk")
  console.log(goals)

  const hasAnyLifeGoals = goals.length > 0

  if (!hasAnyLifeGoals) return <NoGoalsCard />

  return (
    <Box py={10}>
      <Stack>
        {goals.map((goal) =>
          <p key={goal.id}>{goal.title}</p>
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
