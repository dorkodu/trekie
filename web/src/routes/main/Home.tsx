import Emoji from "@/components/Emoji"
import ChevronTitle from "@/components/custom/ChevronTitle"
import Goal from "@/components/custom/Goal"
import Habit from "@/components/custom/Habit"
import Memory from "@/components/custom/Memory"
import { useApiStore } from "@/stores/apiStore"
import { Button, Flex, Paper, SimpleGrid, Text, Title } from "@mantine/core"
import { IconFlame, IconRocket, IconStarFilled } from "@tabler/icons-react"

function Home() {
  const userId = useApiStore(state => state.userId);
  const users = useApiStore(state => state.users);
  const user = userId ? users[userId] : undefined;

  const habits = useApiStore(state => state.habits);

  return (
    <Flex direction="column" m="md" gap="xl">

      <Flex direction="column" gap="xs">

        <Title order={4}>Welcome John! <Emoji emoji="👋" /></Title>

        <SimpleGrid cols={2} spacing="md">

          <Flex direction="column" align="start" gap="xs">
            <Text>
              Hello, world! Welcome to Trekie. <b>The gamified digital life companion.</b>
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

        <ChevronTitle order={4} href={`/habits/${user?.username}`}>
          Habits
        </ChevronTitle>

        {Object.values(habits).length > 0 ?
          <Habit habit={Object.values(habits)[0]!} />
          :
          <>No habits.</>
        }

      </Flex>

      <Flex direction="column" gap="xs">

        <ChevronTitle order={4} href={`/memories/${user?.username}`}>
          Memories
        </ChevronTitle>

        <Flex direction="row">

          <Memory />

        </Flex>

      </Flex>

      <Flex direction="column" gap="xs">

        <ChevronTitle order={4} href={`/goals/${user?.username}`}>
          Goals
        </ChevronTitle>

        <Goal />

      </Flex>

      <Flex direction="column" gap="xs">

        <ChevronTitle order={4} href="/fun">
          Fun
        </ChevronTitle>

        <Paper withBorder p="md">
          <Flex gap="md">

            <Emoji emoji="🫙" size={32} />

            <Flex direction="column">
              <Title order={5}>The life jar</Title>
              <Text>See a random memory of yours.</Text>
              <Flex mt="xs">
                <Button>Let's see</Button>
              </Flex>
            </Flex>

          </Flex>
        </Paper>

      </Flex>

    </Flex>
  )
}

export default Home