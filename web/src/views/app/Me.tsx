import CenterLoader from '@/shared/components/loaders/CenterLoader'
import { trekie } from '@/shared/lib/trekie'
import { Flex, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'

export default function Me() {
  const [user, setUser] = useState(null)
  const selfUser = trekie.use($ => $.user)

  useEffect(() => {
    async function fetchUserProfile() {
      const profile = await getUserProfile(selfUser.id)
      setUser(profile)
    }

    fetchUserProfile()
  }, [selfUser.id])

  if (!user) return <CenterLoader />

  return (
    <Flex direction="column" m="md">
      <Title>Me</Title>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      {/* Add more profile details and self actions here */}
    </Flex>
  )
}

