import GlassCard from '#/components/cards/GlassCard'
import Emoji from '#/components/custom/Emoji'
import Footer from '#/components/custom/Footer'
import ColorToggle from '#/components/util/ColorToggle'
import { vanilla } from '#/styles/theme'

import * as PremiumStyles from '#/styles/views/Premium.css'
import * as WebsiteStyles from '#/styles/website/Website.css'

import {
  BackgroundImage,
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
import {
  IconAdFilled,
  IconAdOff,
  IconArrowRight,
  IconAsterisk,
  IconCheck,
  IconCheckbox,
  IconEqualDouble,
  IconMultiplier2x,
  IconUserCircle,
  IconUsersGroup,
} from '@tabler/icons-react'
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

const Hero = () => {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper p={10}>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Stack gap="sm">
          <div>
            <Image src={'/images/trekie_Icon.svg'} w={100} mx="auto" />
          </div>

          <Title className={WebsiteStyles.Hero.Title}>
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
        </Stack>

        <BackgroundImage
          src="/images/liam.jpg"
          maw={500}
          mx="auto"
          my="lg"
          p="lg"
          radius="lg"
        >
          <Stack
            gap="sm"
            maw={380}
            style={{ alignSelf: 'center', justifySelf: 'center' }}
          >
            {[
              ['🎯', 'Add Life Goals', 'Design your new life.'],
              ['✅', 'Track Habits & To-Dos', 'Never been more enjoyable.'],
              ['🫂', 'Share Memories', 'Connect with close friends.'],
            ].map(x => (
              <GlassCard key={x[0]}>
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
              </GlassCard>
            ))}
          </Stack>
        </BackgroundImage>
      </SimpleGrid>
    </Paper>
  )
}

const ItWorks = (
  <Paper component="section" p="lg" my="xl">
    <Group>
      <Stack gap={0}>
        <Emoji emoji="🎮" size={40} />
        <Title order={2} fw={800}>
          Gamify your life.
        </Title>
        <Title order={3} fw={600} c="dimmed">
          It works, backed by science.
        </Title>

        <Text my="xs" maw={500} mx="auto" size="lg">
          Trekie is a gamified productivity app that treats your real life like
          a game. With rewards to motivate you and a social features to share
          your journey with close friends.
        </Text>
      </Stack>
      <Image />
    </Group>

    <Text size="lg" fw={600} ta="center" maw={400}>
      Trekie helps you achieve your goals to become happier, healthier and
      wiser.
    </Text>

    <Text>
      Working with Trekie is fun, and it works! With quick, bite-sized , you’ll
      earn points and unlock new levels while gaining real-world communication
      skills.
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
    <Title ta="center">Features</Title>
    <Text maw={600} mx="auto" my="md">
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
  <>
    <Divider
      label={<Image src="/images/trekie_SUPER_Badge.svg" h={40} w="auto" />}
    />
    <Paper shadow="sm" className={PremiumStyles.Banner.Root}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Stack gap="xs">
          <Title className={PremiumStyles.Banner.Title} c="white">
            Supercharge Your <br /> Gamified Productivity.
          </Title>
          <Text className={PremiumStyles.Banner.Text}>
            Reach your life goals never been more fun. <br />
            Your first super-week is on us.
          </Text>
          <Button
            size="lg"
            className={PremiumStyles.Banner.Button}
            rightSection={<IconArrowRight stroke={2.5} />}
          >
            Try For Free
          </Button>
        </Stack>
        <Box style={{ alignSelf: 'center', maxWidth: 380 }}>
          <List spacing="sm">
            {[
              [
                <IconAdOff />,
                'Ad-free',
                'No interruptions, full productivity.',
              ],
              [
                <IconMultiplier2x />,
                'Doubled Gains',
                'More coins, XP and items available.',
              ],
              [
                <IconUsersGroup />,
                'Groups',
                'Share common goals & habits with friends. Say hello to social productivity boost!',
              ],
            ].map(x => (
              <List.Item
                key={x[1]}
                icon={
                  <ThemeIcon variant="light" c="white" size={36}>
                    {x[0]}
                  </ThemeIcon>
                }
              >
                <Text fw={700} c="white" lh={1.1}>
                  {x[1]}
                </Text>
                <Text c="white">{x[2]}</Text>
              </List.Item>
            ))}
          </List>
        </Box>
      </SimpleGrid>
    </Paper>
  </>
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
      We need to create the next generation human. <br />
      This is a civilizational moment in human history. <br />
      We will go extinct, or will adapt to our new digital-native reality.
    </Text>
    <Text>
      Your life fulfillment companion. Know who you are and where you want to
      go. We will assist in that way.
    </Text>
    <Text>
      {[
        'original',
        'authentic',
        'self-aware',
        'idealist',
        'high-grit',
        'optimist',
        'emphatetic',
        'belonged',
        'humane',
      ]}
    </Text>
    <Text>
      Connect with your real close friends, people you love, work on yourself
      while seeing yourself get better every day.
    </Text>
    <Text>
      Relax and be your true authentic self. Get to know yourself better, find
      your purpose and passion for life. Set goals, add habits and todos.
    </Text>
    <Text>
      Be motivated, commit to your goals, track your actions and see yourself
      making progress.
    </Text>
    <Text>Be optimist, happy and enjoy a peace of mind.</Text>
  </Paper>
)

const CallToAction = (
  <Paper>
    <Title ta="center">Call to Action</Title>
    <Text>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto,
      aliquam?
    </Text>
  </Paper>
)

const DorkoduShilling = (
  <Paper maw={1000} radius="lg" withBorder p="md">
    <Title ta="center">Dorkodu Shilling</Title>
    <Text ta="center">Lorem ipsum dolor sit amet.</Text>
  </Paper>
)
