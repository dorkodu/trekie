import { getUser } from "@api/namespaces/user/repository"
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Flex,
  Group,
  Image,
  Paper,
  rem,
  Skeleton,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IUser } from "@sdk/core/index"
import {
  IconAlertCircle,
  IconBriefcase,
  IconCake,
  IconCalendar,
  IconCopyCheck,
  IconLink,
  IconMapPin,
  IconTargetArrow,
} from "@tabler/icons-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import CenterLoader from "@web/components/loaders/CenterLoader"
import { db } from "@web/lib/db"
import { trekie } from "@web/lib/trekie"
import GoalCard from "@web/namespaces/goal/GoalCard"
import NoGoalsCard from "@web/namespaces/goal/NoGoalsCard"
import HabitCounter from "@web/namespaces/habit/HabitCounter"
import NoHabitsCard from "@web/namespaces/habit/NoHabitsCard"
import { DailyStats } from "@web/namespaces/life/DailyStats"
import { vanilla } from "@web/styles/theme"
import { relativeDateString } from "@web/utils/format"
import { useLiveQuery } from "dexie-react-hooks"
import { getProfile } from "./getProfile"

export const ProfileEntry = ({
  icon,
  text,
}: { icon: React.ReactNode; text: React.ReactNode }) => (
  <Group gap={2}>
    <ThemeIcon c="dimmed" variant="transparent" size={26}>
      {icon}
    </ThemeIcon>
    <Text c="dimmed" lh={1} size="sm" mt={4}>
      {text}
    </Text>
  </Group>
)

export function Profile({ username }: { username: string }) {
  const isMobile = !useMediaQuery(vanilla.largerThan(768))

  const { isPending, isError, isSuccess, error, data } = useQuery({
    queryKey: ["profile:" + username],
    queryFn: () => getProfile(username),
  })

  // TODO: remove this forced type, let trpc handle it
  const user = data as IUser

  if (isPending) return <CenterLoader />
  if (isError)
    return (
      <Alert color="red" icon={<IconAlertCircle />}>
        Failed to get user profile.
      </Alert>
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

          <Text c="dimmed" fw={500}>
            @{user.username}
          </Text>
        </Stack>
      </Group>

      <Stack gap={4}>
        <Text size="sm">{user.bio}</Text>

        <Group gap={4} pb={8}>
          <ProfileEntry
            icon={<IconCalendar size={24} />}
            text={`Joined ${relativeDateString(user.joinedAt)}`}
          />
          {user.birthDate && (
            <ProfileEntry
              icon={<IconCake size={24} />}
              text={`Born ${relativeDateString(user.birthDate)}`}
            />
          )}
          {user.location && (
            <ProfileEntry
              icon={<IconMapPin size={24} />}
              text={user.location}
            />
          )}
          {user.url && (
            <ProfileEntry
              icon={<IconLink size={24} />}
              text={
                <Anchor
                  href={user.url}
                  referrerPolicy="no-referrer"
                  target="_blank"
                >
                  {user.url}
                </Anchor>
              }
            />
          )}
        </Group>

        {isMobile && <DailyStats />}

        <Tabs
          mt={8}
          color="green"
          variant="default"
          radius="md"
          defaultValue="habits"
        >
          <Tabs.List>
            <Tabs.Tab
              value="goals"
              leftSection={<IconTargetArrow style={iconStyle} />}
            >
              Life Goals
            </Tabs.Tab>
            <Tabs.Tab
              value="habits"
              leftSection={<IconCopyCheck style={iconStyle} />}
            >
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

export function UserHabitSummary() {
  const userId = trekie.use(($) => $.user?.id)

  if (!userId)
    return (
      <Box py={10}>
        <NoHabitsCard />
      </Box>
    )

  const habits = useLiveQuery(async () => {
    return db.habits.where("userId").equals(userId).toArray()
  }, [userId])

  // TODO: maybe add skeleton?? needed? not sure.
  if (!habits) return <></>

  const hasAnyHabits = habits?.length > 0
  if (!hasAnyHabits)
    return (
      <Box py={10}>
        <NoHabitsCard />
      </Box>
    )

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
        {habits.map((habit) => (
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

export function LifeGoalSummary() {
  const userId = trekie.use(($) => $.user?.id)
  if (!userId)
    return (
      <Box py={10}>
        <NoHabitsCard />
      </Box>
    )

  const queryClient = useQueryClient()

  const goals = useLiveQuery(
    async () => db.goals.where("userId").equals(userId).toArray(),
    [],
    "loading",
  )

  if (goals == "loading")
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={8} radius="xl" />
        <Skeleton height={8} mt={8} width="70%" radius="xl" />
      </>
    )

  const hasAnyLifeGoals = goals.length > 0

  if (!hasAnyLifeGoals) return <NoGoalsCard />

  return (
    <Box py={10}>
      <Stack>
        {goals.map((goal) => (
          <GoalCard id={goal.id} key={goal.id} />
        ))}
      </Stack>
    </Box>
  )
}
