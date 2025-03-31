import { Flex, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import CenterLoader from '@web/shared/components/loaders/CenterLoader'
import { trekie } from '@web/shared/lib/trekie'
import { useEffect, useState } from 'react'

export default function Me() {
  const selfUser = trekie.use($ => $.user)

  let loading = false

  if (loading) return <CenterLoader />

  return (
    <Flex direction="column" m="md">
      <Title>Me</Title>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      {/* Add more profile details and self actions here */}
    </Flex>
  )
}

