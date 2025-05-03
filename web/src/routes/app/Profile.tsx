import { Stack, Text } from '@mantine/core'
import { USERHANDLE_REGEX } from '@sdk/core'
import { Profile } from '@web/namespaces/social/profile/Profile'
import { useLocation } from 'react-router-dom'

export default function Page() {
  let location = useLocation()
  let username = location.pathname.slice(2) // '/@username' => 'username'
  let result

  const handleRegexMatch = location.pathname.match(USERHANDLE_REGEX)

  if (handleRegexMatch) {

  }

  (!username)
    ? <Text>User not found.</Text>
    : <Profile username={username} />

  return (
    <Stack gap="xs" m="xs">
      {result}
    </Stack>
  )
}
