import { useEffect, useState } from 'react'
import { trekie } from '@web/shared/lib/trekie'
import { ActionIcon, Avatar, Badge, Box, Button, Flex, Paper, Stack, Text, Title } from '@mantine/core'
import { IconBell, IconMessage, IconUserPlus, IconUsers } from '@tabler/icons-react'
import OnlyPremium from '@web/shared/components/cards/OnlyPremium'
import WIPCard from '@web/shared/components/cards/WIPCard'
import { ContainerSheet } from '@web/styles/shared.css'
import { Feature, useFeature } from 'flagged'
import { useLiveQuery } from 'dexie-react-hooks'

function Social() {
  const isPremium = useFeature("premium")

  return (
    <Flex direction="column" m="md">
      {isPremium ? <NewsFeed /> : <OnlyPremium />}
    </Flex>
  )
}

export default Social

function NewsFeed() {
  const userId = trekie.use($ => $.user.id)
  const records = useLiveQuery(
    () => userId ? trekie.db.commitRecords.where('userId').equals(userId).reverse().sortBy('timestamp') : Promise.resolve([]),
    [userId]
  ) || []

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet}>
      <Stack gap={8}>
        {records.length === 0 ? (
          <Text ta="center" my="xs" c="dimmed">
            Nothing to see here yet.
          </Text>
        ) : (
          records.map(record => (
            <CommitActivityCard key={record.id} record={record} />
          ))
        )}
      </Stack>
      <Flex>
        <Badge variant="light" color="gray" mx="auto">
          Your Activities
        </Badge>
      </Flex>
    </Box>
  )
}

function CommitActivityCard({ record }: { record: any }) {
  return (
    <Paper shadow="xs" p="md" radius="lg" mb={8}>
      <Flex gap={8} justify="space-between" align="center">
        <Flex gap={8} align="center">
          <Avatar size={40} radius="xl" />
          <Stack gap={0}>
            <Text fw={600}>{record.kind} - {record.event}</Text>
            <Text c="dimmed" size="sm">{new Date(record.timestamp).toLocaleString()}</Text>
            <Text size="sm">Instance: {record.instanceId}</Text>
            <Text size="sm">Reward: XP {record.reward?.xp ?? 0}, Coins {record.reward?.coins ?? 0}</Text>
            {record.data && <Text size="xs" c="dimmed">Data: {JSON.stringify(record.data)}</Text>}
          </Stack>
        </Flex>
        <ActionIcon variant="subtle" color="blue">
          <IconBell size={20} />
        </ActionIcon>
      </Flex>
    </Paper>
  )
}