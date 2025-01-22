import { IUser, USERHANDLE_REGEX } from '@/core'
import GoalCard from '@/namespaces/goal/GoalCard'
import NoGoalsCard from '@/namespaces/goal/NoGoalsCard'
import HabitCounter from '@/namespaces/habit/HabitCounter'
import NoHabitsCard from '@/namespaces/habit/NoHabitsCard'
import { DailyStats } from '@/namespaces/life/DailyStats'
import { Profile } from '@/namespaces/social/profile/Profile'
import { errors } from '@/shared/lib/errors'
import { trekie } from '@/shared/lib/trekie'
import { Maybe } from '@/shared/utils'
import { relativeDateString } from '@/shared/utils/format'
import { vanilla } from '@/styles/theme'
import { Alert, Anchor, Badge, Box, Flex, Group, Image, Loader, Paper, Skeleton, Stack, Tabs, Text, ThemeIcon, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertCircle, IconBriefcase, IconCake, IconCalendar, IconCopyCheck, IconLink, IconMapPin, IconTargetArrow } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLiveQuery } from 'dexie-react-hooks'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export default function Page() {
  let location = useLocation()
  let username = location.pathname.slice(2) // '/@username' => 'username'
  let result = null

  const handleRegexMatch = location.pathname.match(USERHANDLE_REGEX)

  if (handleRegexMatch) {

  }

  if (!username)
    result = <Text>User not found.</Text>
  else result = <Profile username={username} />

  return (
    <Stack gap="xs" m="xs">
      {result}
    </Stack>
  )
}
