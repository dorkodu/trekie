import { Anchor, Button, Center, Flex, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'

function CreateAccount() {

  return (
    <Stack maw={460} mx="auto" p={10} mt={"5vw"} mb={"10vw"}>

      <Title ta="center">Create Account</Title>
      <Text ta="center" c="dimmed" size="sm">
        Already have an account?{' '}
        <Anchor component={Link} to="/login" size="sm">
          Log in
        </Anchor>
      </Text>

      <form>
        <Stack>
          <input type="text" placeholder="Username" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <Button type="submit" rightSection={<IconArrowRight size={18} />}>
            Sign Up
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}

export default CreateAccount
