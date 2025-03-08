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
        <FriendsList />
        <MessageCenter />
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

function FriendsList() {
  const friends = [
    { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1', online: true },
    { name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?img=2', online: true },
    { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=3', online: false },
    { name: 'Lisa Wong', avatar: 'https://i.pravatar.cc/150?img=4', online: false },
  ]

  return (
    <Box style={{ borderRadius: 20, padding: 16 }} className={ContainerSheet} mb="md">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={4}><IconUsers size={18} style={{ marginRight: 8 }} />Friends</Title>
        <ActionIcon variant="light" color="blue">
          <IconUserPlus size={18} />
        </ActionIcon>
      </Flex>
      <Stack gap="sm">
        {friends.map((friend, index) => (
          <Flex key={index} align="center" justify="space-between">
            <Flex align="center">
              <Avatar src={friend.avatar} size="md" mr="sm" />
              <Text size="sm">{friend.name}</Text>
            </Flex>
            <Badge color={friend.online ? 'green' : 'gray'} variant="dot">
              {friend.online ? 'Online' : 'Offline'}
            </Badge>
          </Flex>
        ))}
      </Stack>
      <Button fullWidth variant="light" mt="md" size="xs">
        See all friends
      </Button>
    </Box>
  )
}

function MessageCenter() {
  const messages = [
    { from: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1', text: 'Hey, how are you doing?', time: '2m ago' },
    { from: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?img=2', text: 'Check out this new event!', time: '1h ago' },
  ]

  return (
    <Box style={{ borderRadius: 20, padding: 16 }} className={ContainerSheet}>
      <Flex justify="space-between" align="center" mb="md">
        <Title order={4}><IconMessage size={18} style={{ marginRight: 8 }} />Messages</Title>
        <Badge>{messages.length}</Badge>
      </Flex>
      <Stack gap="md">
        {messages.map((message, index) => (
          <Paper key={index} p="xs" withBorder>
            <Flex align="flex-start">
              <Avatar src={message.avatar} size="md" mr="sm" />
              <Box>
                <Text size="sm" fw={500}>{message.from}</Text>
                <Text size="xs" c="dimmed">{message.text}</Text>
                <Text size="xs" c="dimmed" mt={4}>{message.time}</Text>
              </Box>
            </Flex>
          </Paper>
        ))}
      </Stack>
      <Button fullWidth variant="light" mt="md" size="xs">
        Open messenger
      </Button>
    </Box >
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
