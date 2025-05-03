import { Flex, Image, Title } from '@mantine/core'
import OnlyPremium from '@web/shared/components/cards/OnlyPremium'
import WIPCard from '@web/shared/components/cards/WIPCard'

export default function Settings() {
  return (
    <Flex direction="column" m="md">
      <Title order={1} size="h2">Help</Title>
      <WIPCard />
    </Flex>
  )
}