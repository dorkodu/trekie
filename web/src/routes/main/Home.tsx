import Emoji from "@/components/Emoji"
import ChevronTitle from "@/components/custom/ChevronTitle"
import Goal from "@/components/custom/Goal"
import Habit from "@/components/custom/Habit"
import Memory from "@/components/custom/Memory"
import { UserStats } from "@/components/custom/UserStats"
import TextParser from "@/components/util/TextParser"
import { useApiStore } from "@/stores/apiStore"
import { wrapContent } from "@/styles/shared.css"
import { Button, Divider, Flex, Paper, SimpleGrid, Text, Title } from "@mantine/core"

function Home() {
  const userId = useApiStore(state => state.userId);
  const users = useApiStore(state => state.users);
  const user = userId ? users[userId] : undefined;

  const previewHabits = useApiStore(state => state.getHabits(userId));
  const previewMemories = useApiStore(state => state.getMemories(userId));
  const previewGoals = useApiStore(state => state.getGoals(userId));

  return (
    <Flex direction="column" m="md" gap="xl">

      <Flex direction="column" gap="xs">

        <Title order={4} className={wrapContent}>
          <Emoji emoji="👋" /> Welcome,&nbsp;
          <TextParser ids={["emoji"]} text={user?.name ?? ""} />
        </Title>

        <SimpleGrid cols={2} spacing="md">

          <Flex direction="column" align="start" gap="xs">
            <Text>
              Hello, world! Welcome to Trekie. <b>The gamified digital life companion.</b>
            </Text>

            <Button variant="filled">Primary action</Button>
            <Button variant="default">Secondary action</Button>
          </Flex>

          {user &&
            <Paper withBorder p="md">
              <Flex direction="column" justify="space-evenly" gap="xs">
                <UserStats.Momentum user={user} />
                <Divider />
                <UserStats.Experience user={user} />
                <Divider />
                <UserStats.Streaks user={user} />
              </Flex>
            </Paper>
          }

        </SimpleGrid>

      </Flex>

      <Flex direction="column" gap="xs">

        <ChevronTitle order={4} href={`/habits/${user?.username}`}>
          Habits
        </ChevronTitle>

        {previewHabits.length > 0 ?
          <Habit habit={previewHabits[0]!} />
          :
          <>No habits.</>
        }

      </Flex>

      <Flex direction="column" gap="xs">

        <ChevronTitle order={4} href={`/memories/${user?.username}`}>
          Memories
        </ChevronTitle>

        <Flex direction="row">

          {previewMemories.length > 0 ?
            <Memory memory={previewMemories[0]!} />
            :
            <>No memories.</>
          }

        </Flex>

      </Flex>

      <Flex direction="column" gap="xs">

        <ChevronTitle order={4} href={`/goals/${user?.username}`}>
          Goals
        </ChevronTitle>

        {previewGoals.length > 0 ?
          <Goal goal={previewGoals[0]!} />
          :
          <>No goals.</>
        }

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