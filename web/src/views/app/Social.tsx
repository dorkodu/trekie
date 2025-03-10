import { ActionIcon, Avatar, Badge, Box, Button, Flex, Paper, Stack, Text, Title } from '@mantine/core'
import { IconBell, IconMessage, IconUserPlus, IconUsers } from '@tabler/icons-react'
import OnlyPremium from '@web/shared/components/cards/OnlyPremium'
import WIPCard from '@web/shared/components/cards/WIPCard'
import { ContainerSheet } from '@web/styles/shared.css'
import { Feature, useFeature } from 'flagged'

function Social() {
  const isPremium = useFeature("premium")

  return (
    <Flex direction="column" m="md">
      <Stack gap="md">
        <NewsFeed />
        <ActivityFeed />
      </Stack>
      {isPremium ? <WIPCard /> : <OnlyPremium />}
    </Flex>
  )
}

export default Social

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

function ActivityFeed() {
  const activities = [
    { type: 'achievement', title: 'New Badge Earned', description: 'You earned the "Early Bird" badge', time: 'Today' },
    { type: 'friend', title: 'New Connection', description: 'Jenny accepted your friend request', time: 'Yesterday' },
    { type: 'event', title: 'Upcoming Event', description: 'Tech Conference starts in 3 days', time: 'Mon, 10:00 AM' },
  ]

  return (
    <Box style={{ borderRadius: 20, padding: 16 }} className={ContainerSheet} mt="md">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={4}><IconBell size={18} style={{ marginRight: 8 }} />Recent Activity</Title>
      </Flex>
      <Stack gap="md">
        {activities.map((activity, index) => (
          <Paper key={index} p="xs" withBorder>
            <Text size="sm" fw={500}>{activity.title}</Text>
            <Text size="xs" c="dimmed">{activity.description}</Text>
            <Flex justify="space-between" mt={4}>
              <Badge size="xs" variant="light">{activity.type}</Badge>
              <Text size="xs" c="dimmed">{activity.time}</Text>
            </Flex>
          </Paper>
        ))
        }
      </Stack >
    </Box >
  )
}
