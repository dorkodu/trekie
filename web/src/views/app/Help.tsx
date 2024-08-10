import OnlyPremium from '@/shared/components/cards/OnlyPremium'
import WIPCard from '@/shared/components/cards/WIPCard'
import { Flex, Image, Title } from '@mantine/core'

export default function Help() {
  return (
    <Flex direction="column" m="md">
      <Title order={1} size="h2">Help</Title>
      <WIPCard />
    </Flex>
  )
}