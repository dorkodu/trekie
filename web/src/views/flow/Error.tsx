import { Container, Text, Title } from '@mantine/core'
import { log } from '@web/shared/utils/log'
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  log(error)

  return (
    <Container>
      <Title>Error</Title>
      <Text>Something went wrong.</Text>
    </Container>
  )
}
