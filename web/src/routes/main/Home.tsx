import { Button, Flex, Paper, SimpleGrid, Text, Title } from "@mantine/core"
import { IconFlame, IconMinus, IconPlus, IconRocket, IconStarFilled } from "@tabler/icons-react"

function Home() {
  return (
    <Flex direction="column" m="md" gap="xl">

      <Flex direction="column" gap="xs">

        <Title order={4}>Welcome John!</Title>

        <SimpleGrid cols={2} spacing="md">

          <Flex direction="column" align="start" gap="xs">
            <Text>
              Hello, world! Welcome to Trekie.
              <Text fw="bold">The gamified digital life companion.</Text>
            </Text>

            <Button variant="filled">Primary action</Button>
            <Button variant="default">Secondary action</Button>
          </Flex>

          <Flex direction="column" gap="xs">

            <Paper withBorder p="xs">
              <Flex justify="center" gap="xs">
                <IconRocket />
                <Text>80%</Text>
              </Flex>
            </Paper>

            <Paper withBorder p="xs">
              <Flex justify="center" gap="xs">
                <IconStarFilled />
                <Text>964</Text>
              </Flex>
            </Paper>

            <Paper withBorder p="xs">
              <Flex justify="center" gap="xs">
                <IconFlame />
                <Text>6 days</Text>
              </Flex>
            </Paper>

          </Flex>

        </SimpleGrid>

      </Flex>

      <Flex direction="column" gap="xs">

        <Title order={4}>Habits</Title>

        <Button.Group h={64}>
          <Button h="auto">
            <IconMinus />
          </Button>
          <Flex direction="column" justify="center" p="md" style={{ flex: 1 }}>
            <Title order={5}>Write 15 pages of code</Title>
            <Text>Gotta beat Linus Torvalds.</Text>
          </Flex>
          <Button h="auto">
            <IconPlus />
          </Button>
        </Button.Group>

      </Flex>

      <Flex direction="column" gap="xs">

        <Title order={4}>Memories</Title>

        <Text>Can't remember right now. Please try again later...</Text>

      </Flex>

    </Flex>
  )
}

export default Home