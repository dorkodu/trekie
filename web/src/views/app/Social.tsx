import OnlyPremium from '@/shared/components/cards/OnlyPremium'
import WIPCard from '@/shared/components/cards/WIPCard'
import { ContainerSheet } from '@/styles/shared.css'
import { Badge, Box, Flex, Image, Stack, Text } from '@mantine/core'
import { Feature, useFeature } from 'flagged'

function Social() {
  const isPremium = useFeature("premium")


  return (
    <Flex direction="column" m="md">
      <Feature name="premium" render>

      </Feature>
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
