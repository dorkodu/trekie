import Emoji from "@/components/Emoji"
import { ActionIcon, Avatar, Button, Card, Flex, Image, Paper, SimpleGrid, Text, Title } from "@mantine/core"
import { IconChevronRight, IconDots, IconFlame, IconMinus, IconPlus, IconRocket, IconStar, IconStarFilled } from "@tabler/icons-react"

function Home() {
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

        <Flex align="center">
          <Title order={4}>Habits</Title>
          <IconChevronRight />
        </Flex>

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

        <Flex align="center">
          <Title order={4}>Memories</Title>
          <IconChevronRight />
        </Flex>

        <Flex direction="row">

          <Card withBorder w={200}>

            <Card.Section>
              <Image
                src="https://i.pinimg.com/564x/80/12/d1/8012d171d4d5bcfea05ef04af626b3a3.jpg"
                alt="Image of a memory"
                w={200}
                h={150}
              />
            </Card.Section>

            <Flex direction="column" gap="xs" mt="md">

              <Text lineClamp={3}>
                Me and my friends rewriting Minecraft in C++ because Java is trash.
              </Text>

              <Flex gap="xs">
                <Avatar src="/favicon.svg" size={32} />
                <Flex direction="column">
                  <Text>John Doe</Text>
                  <Text size="sm">3 days ago</Text>
                </Flex>
              </Flex>

              <Flex justify="space-between" gap="xs">
                <Flex align="center" gap="xs">
                  <ActionIcon variant="subtle"><IconStar /></ActionIcon>
                  <Text>123</Text>
                </Flex>
                <ActionIcon variant="subtle"><IconDots /></ActionIcon>
              </Flex>

            </Flex>

          </Card>

        </Flex>

      </Flex>

    </Flex>
  )
}

export default Home