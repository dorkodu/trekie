import { ActionIcon, Avatar, Badge, Box, Button, Card, Code, Flex, Group, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { IconBell, IconMessage, IconUserPlus, IconUsers } from '@tabler/icons-react'
import { goals } from '@web/namespaces/goal'
import { habits } from '@web/namespaces/habit'
import OnlyPremium from '@web/shared/components/cards/OnlyPremium'
import WIPCard from '@web/shared/components/cards/WIPCard'
import { trekie } from '@web/shared/lib/trekie'
import { ContainerSheet } from '@web/styles/shared.css'
import { useLiveQuery } from 'dexie-react-hooks'
import { Feature, useFeature } from 'flagged'
import { useEffect, useState } from 'react'

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
    () => trekie.db.commitRecords.where('userId').equals(userId).reverse().sortBy('timestamp'),
    [userId]
  ) || []

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet}>
      {records.length === 0 ? (
        <Text ta="center" my="xs" c="dimmed">
          Nothing to see here yet.
        </Text>
      ) : (
        <Stack gap="xs" w="100%">
          {records.map(record => (
            <CommitActivityCard key={record.id} record={record} />
          ))}
        </Stack>
      )}
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
    <Card shadow="sm" p="xs" radius="lg" withBorder w="100%">
      <Stack gap={2}>
        {/* Row 1: kind, event, timestamp */}
        <Group gap="md" wrap="nowrap">
          <Text size="xs" c="dimmed" fw={600}>{record.kind}</Text>
          <Text size="xs" fw={600}>{record.event}</Text>
          <Text size="xs" c="dimmed">{new Date(record.timestamp).toUTCString()}</Text>
        </Group>
        {/* Row 2: title */}
        <Box>
          <CommitmentInstanceTableCell kind={record.kind} instanceId={record.instanceId} />
        </Box>
        {/* Row 3: rewards */}
        <Box>
          <Text size="xs">XP {record.reward?.xp ?? 0}, Coins {record.reward?.coins ?? 0}</Text>
        </Box>
        {/* Row 4: data code block */}
        {record.data ? (
          <Code block maw={400} color="dark" w="100%" style={{ fontSize: 10, borderRadius: 10 }}>{JSON.stringify(record.data)}</Code>
        ) : null}
      </Stack>
    </Card>
  )
}

function CommitmentInstanceTableCell({ kind, instanceId }: { kind: string, instanceId: string }) {
  const entity = useLiveQuery(() => {
    switch (kind) {
      case 'Habit': return habits.getByCommitmentId(instanceId)
      default: return null
    }
  }, [kind, instanceId])

  if (!entity) return <Text size="sm" c="dimmed">{kind} not found</Text>
  return <Text size="sm">{entity.title || entity.id}</Text>
}