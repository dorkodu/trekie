import { DailyStats } from '@/namespaces/life/DailyStats'
import OnlyPremium from '@/shared/components/cards/OnlyPremium'
import WIPCard from '@/shared/components/cards/WIPCard'
import trekie from '@/shared/lib/trekie'
import { vanilla } from '@/styles/theme'
import { relativeDateString } from '@core/lib/util'
import { Anchor, Flex, Group, Image, Paper, Stack, Tabs, Text, ThemeIcon, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCalendar, IconCake, IconBriefcase, IconMapPin, IconLink, IconTargetArrow, IconCopyCheck } from '@tabler/icons-react'

function Profile() {
  return (
    <Flex direction="column" m="md">
      <WIPCard />
    </Flex>
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


export default Profile
