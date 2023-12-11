import Emoji from '#/components/custom/Emoji'
import Footer from '#/components/custom/Footer'
import ColorToggle from '#/components/util/ColorToggle'
import { vanilla } from '#/styles/theme'
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Image,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { IconAbacus } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Welcome() {
  return (
    <Stack p={10} mt="4vw">
      <Hero />

      {ItWorks}
      {Features}
      {Join}
      {Premium}
      {WhyMeWhyNot}
      {DorkoduShilling}
      {CallToAction}
    </Stack>
  )
}

const Header = () => {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper p={10}>
      <Stack align="center">
        <div>
          <Image src={'/images/trekie_Icon.svg'} w={100} mx="auto" />
        </div>

        <Title
          size={32}
          fw={800}
          lh={1.15}
          style={{ letterSpacing: -0.5 }}
          c={
            colorScheme == 'dark' ? vanilla.colors.white : vanilla.colors.black
          }
          w="90%"
          mx="auto"
          ta="center"
          my={10}
        >
          Your Social & Gamified <br /> Life Growth Companion
        </Title>

        <Stack w="90%" maw={320} gap={12} mx="auto">
          <Button size="md" fw={700}>
            GET STARTED
          </Button>
          <Button size="md" fw={700} variant="light">
            I ALREADY HAVE ACCOUNT
          </Button>
        </Stack>

        <SimpleGrid>
          {[
            ['🎯', 'Add Your Goals', 'Design your new life.'],
            ['✅', 'Track Your Habits & To-Dos', 'Never been more enjoyable.'],
            [
              '🫂',
              'Share Memories From Your Journey',
              'Connect with close friends.',
            ],
          ].map(x => (
            <Card withBorder shadow="xs" py="xs" px="md" radius="lg">
              <Group wrap="nowrap">
                {/* @ts-ignore */}
                <Emoji emoji={x[0]} size={30} />
                <Stack gap={0} pr={8}>
                  <Text fw={700}>{x[1]}</Text>
                  <Text fw={500} c="dimmed">
                    {x[2]}
                  </Text>
                </Stack>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Paper>
  )
}

const ItWorks = (
  <Paper component="section" p="lg" my="xl">
    <Title order={2} fw={800} ta="center">
      Gamify your life.
    </Title>
    <Title order={3} fw={600} ta="center" c="dimmed">
      It works, backed by science.
    </Title>

    <Text my="md" maw={500} mx="auto" size="lg">
      Trekie is a gamified productivity app that treats your real life like a
      game. With rewards to motivate you and a social features to share your
      journey with close friends.
    </Text>

    <Text size="lg" fw={600} ta="center" maw={400}>
      Trekie helps you achieve your goals to become happier, healthier and
      wiser.
    </Text>

    <Text>
      Learning with Duolingo is fun, and research shows that it works! With
      quick, bite-sized lessons, you’ll earn points and unlock new levels while
      gaining real-world communication skills.
    </Text>

    <Text>
      <b>backed by science </b>
      We use a combination of research-backed teaching methods and delightful
      content to create courses that effectively teach reading, writing,
      listening, and speaking skills!
    </Text>

    <Text>
      stay motivated We make it easy to form a habit of language learning with
      game-like features, fun challenges, and reminders from our friendly
      mascot, Duo the owl.
    </Text>

    <Text>
      personalized learning Combining the best of AI and language science,
      lessons are tailored to help you learn at just the right level and pace.
    </Text>

    <Text>learn anytime, anywhere</Text>

    <SimpleGrid cols={{ base: 1, sm: 2 }} maw={800}>
      {[
        {
          icon: <IconAbacus />,
          title: 'Effective and efficient',
          description:
            'Stay accountable by tracking and managing your Habits, Daily goals, and To Do list with Habitica’s easy-to-use mobile apps and web interface.',
        },
        {
          icon: <IconAbacus />,
          title: 'Lorem ipsum dolor sit amet consectetur.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
      ].map($ => (
        <Card withBorder>
          <Group gap={10} wrap="nowrap" mb={10}>
            <ThemeIcon variant="light" size={36}>
              {$.icon}
            </ThemeIcon>
            <Text fw={700} lh={1.25}>
              {$.title}
            </Text>
          </Group>

          <Text size="sm">{$.description}</Text>
        </Card>
      ))}
    </SimpleGrid>
  </Paper>
)

const Features = (
  <Paper withBorder p="md">
    <Title>Features</Title>
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio nulla ullam
      voluptas nemo voluptatibus tempora facere nobis architecto, id harum,
      adipisci eaque provident corrupti molestias?
    </Text>

    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {[
        {
          icon: <IconAbacus />,
          title: 'Lorem ipsum dolor sit amet consectetur.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
        {
          icon: <IconAbacus />,
          title: 'Lorem ipsum dolor sit amet consectetur.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
        {
          icon: <IconAbacus />,
          title: 'Lorem ipsum dolor sit amet consectetur.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
        {
          icon: <IconAbacus />,
          title: 'Lorem ipsum dolor sit amet consectetur.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
        {
          icon: <IconAbacus />,
          title: 'Lorem ipsum dolor sit amet consectetur.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
        {
          icon: <IconAbacus />,
          title: 'Lorem ipsum dolor sit amet consectetur.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
      ].map($ => (
        <Card withBorder>
          <Group gap={10} wrap="nowrap" mb={10}>
            <ThemeIcon variant="light" size={36}>
              {$.icon}
            </ThemeIcon>
            <Text fw={700} lh={1.25}>
              {$.title}
            </Text>
          </Group>

          <Text size="sm">{$.description}</Text>
        </Card>
      ))}
    </SimpleGrid>
  </Paper>
)

const Premium = (
  <Paper>
    <Title>Super Trekie</Title>
    <Button size="lg" variant="gradient">
      Try 1 Week For Free
    </Button>
  </Paper>
)

const Join = (
  <Paper>
    <Title></Title>
  </Paper>
)

const WhyMeWhyNot = (
  <Paper>
    <Title>Why?</Title>
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, at magni!
      Voluptatem veniam molestiae hic praesentium, et maxime sit, unde
      inventore, dolorem ad eveniet ut!
    </Text>
  </Paper>
)

const CallToAction = (
  <Paper>
    <Title>Call to Action</Title>
    <Text>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto,
      aliquam?
    </Text>
  </Paper>
)

const DorkoduShilling = (
  <Paper>
    <Title>Dorkodu Shilling</Title>
    <Text>Lorem ipsum dolor sit amet.</Text>
  </Paper>
)
