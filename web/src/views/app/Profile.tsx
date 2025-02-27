import { Alert, Anchor, Badge, Box, Flex, Group, Image, Loader, Paper, Skeleton, Stack, Tabs, Text, ThemeIcon, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertCircle, IconBriefcase, IconCake, IconCalendar, IconCopyCheck, IconLink, IconMapPin, IconTargetArrow } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IUser, USERHANDLE_REGEX } from '@web/core'
import GoalCard from '@web/namespaces/goal/GoalCard'
import NoGoalsCard from '@web/namespaces/goal/NoGoalsCard'
import HabitCounter from '@web/namespaces/habit/HabitCounter'
import NoHabitsCard from '@web/namespaces/habit/NoHabitsCard'
import { DailyStats } from '@web/namespaces/life/DailyStats'
import { Profile } from '@web/namespaces/social/profile/Profile'
import { errors } from '@web/shared/lib/errors'
import { trekie } from '@web/shared/lib/trekie'
import { Maybe } from '@web/shared/utils'
import { relativeDateString } from '@web/shared/utils/format'
import { vanilla } from '@web/styles/theme'
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
