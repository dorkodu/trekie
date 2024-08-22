import { Flex, Title } from '@mantine/core'

export default function Me() {
  /**
   * 
   * get self user from store
   * ping API for fresh state 
   * use profile components but with only available self actions
   * 
   */

  return (
    <Flex direction="column" m="md">
      <Title>Me</Title>
    </Flex>
  )
}

