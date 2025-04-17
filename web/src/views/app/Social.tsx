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
      {isPremium ? <NewsFeed /> : <OnlyPremium />}
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