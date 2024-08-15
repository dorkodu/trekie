import OnlyPremium from '@/shared/components/cards/OnlyPremium'
import WIPCard from '@/shared/components/cards/WIPCard'
import { Flex, Image } from '@mantine/core'
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
