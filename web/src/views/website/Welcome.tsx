import Footer from '#/components/custom/Footer'
import {
  Button,
  Divider,
  Flex,
  Image,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core'

export default function Welcome() {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Flex
      direction="column"
      justify="center"
      p="md"
      mx="auto"
      mih="100%"
      maw={360}
    >
      <Flex direction="column" gap="md">
        <Flex justify="center" mb={40}>
          <Image
            src={
              colorScheme == 'dark'
                ? '/images/superapp_Brand-Cool-White.svg'
                : '/images/superapp_Brand-Cool.svg'
            }
            alt="Dorkodu Superapp Logo"
            w={250}
            h={'auto'}
          />
        </Flex>

        <Title order={1} lh={1.15} fw={800}>
          Your Digital Life,
          <br />
          In One Place.
        </Title>

        <Text>
          Connect your account to get the best experience from Dorkodu apps you
          use.
        </Text>

        <Button size="lg" fw={800}>
          GET STARTED
        </Button>

        <Button variant="default">I ALREADY HAVE AN ACCOUNT</Button>

        <Footer />
      </Flex>
    </Flex>
  )
}
