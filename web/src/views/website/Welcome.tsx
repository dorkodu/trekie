import { BackgroundImage, Box, Button, Card, Divider, Flex, Group, Image, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title, useMantineColorScheme }
  from '@mantine/core'
import { IconAbacus, IconAdOff, IconArrowRight, IconBuildingStore, IconCheckbox, IconCopyCheck, IconMultiplier2x, IconPhoto, IconPhotoStar, IconPolaroid, IconPolaroidFilled, IconRocket, IconShare, IconTargetArrow, IconUsersGroup, }
  from '@tabler/icons-react'

import GlassCard from '#/components/cards/GlassCard'
import Emoji from '#/components/custom/Emoji'

import * as PremiumStyles from '#/styles/views/Premium.css'
import * as WebsiteStyles from '#/styles/website/Website.css'

export default function Welcome() {
  return (
    <Stack p={10} mt="4vw">
      <Hero />

      {ItWorks}
      {Features}
      {Join}
      {Premium}
      {Pricing}
      <FAQ />
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
            <Image src={'/images/Hero.svg'} w="80%" mx="auto" />
          </div>

          <Title className={WebsiteStyles.Hero.Title}>
            Your Social & Gamified <br /> Productivity Companion
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
          src="/images/hero-Gamify.png"
          maw={540}
          mx="auto"
          my="lg"
          radius="lg"
          style={{ padding: "40px 0" }}
        >
          <div>
            <Stack
              gap="sm"
              maw={380}
              style={{ alignSelf: 'center', justifySelf: 'center' }}
              mx="auto"
            >
              {[
                ['🎯', 'Add Life Goals', 'Design your new life.'],
                ['✅', 'Track Habits & To-Dos', 'Never been more enjoyable.'],
                ['🫂', 'Share Stories', 'Connect with close friends.'],
              ].map(x => (
                <GlassCard key={x[0]}>
                  <Group wrap="nowrap">
                    {/* @ts-ignore */}
                    <Emoji emoji={x[0]} size={30} />
                    <Stack gap={0} pr={8}>
                      <Text fw={700}>{x[1]}</Text>
                      <Text>{x[2]}</Text>
                    </Stack>
                  </Group>
                </GlassCard>
              ))}
            </Stack>
          </div>
        </BackgroundImage>
      </SimpleGrid>
    </Paper>
  )
}

const ItWorks = (
  <Paper component="section" p="lg" my="xl">
    <SimpleGrid cols={{ base: 1, sm: 2 }} my={50}>
      <Stack gap={0} style={{ alignSelf: 'center' }}>
        <Emoji emoji="🎮" size={40} />
        <Title order={2} fw={800}>
          Gamify your life.
        </Title>
        <Title order={3} fw={600} c="dimmed">
          It works, backed by science.
        </Title>

        <Text my="xs" maw={500} size="lg">
          Trekie is a <b>gamified productivity app</b> that treats your real
          life like a game. With rewards to motivate you and social features to
          share your journey with close friends.
        </Text>
      </Stack>

      <Flex justify="center" style={{ alignSelf: 'center' }}>
        <Image src="/images/Gamify.webp" w="80%" h="auto" mx="auto" radius="lg" />
      </Flex>
    </SimpleGrid>
  </Paper>
)

const Features = (
  <Paper p="md" my={50}>
    <Title ta="center" order={2} size={32} fw={800}>
      Features
    </Title>
    <Text mx="auto" size="xl" ta="center" maw={400} lh={1.25} my={20}>
      Trekie helps you achieve your goals to become happier, healthier and
      wiser.
    </Text>

    <Text mx="auto" ta="center" maw={600} lh={1.25} my={20}>
      Working with Trekie is fun, and it works! With quick, bite-sized actions you can track your habits, earn XP and coins while getting better at real-world.
    </Text>

    <Text mx="auto" ta="center" maw={600} lh={1.25} my={20}>
      We use a combination of science-backed methods and delightful game mechanics to create this effective productivity experience!
    </Text>

    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {[
        {
          icon: IconTargetArrow,
          title: 'Life Goals',
          description:
            '',
        },
        {
          icon: IconCopyCheck,
          title: 'Habits',
          description:
            '',
        },
        {
          icon: IconRocket,
          title: 'Momentum, XP, Coins',
          description:
            '',
        },
        {
          icon: IconPhoto,
          title: 'Stories',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
        {
          icon: IconUsersGroup,
          title: 'Community & Social',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aspernatur dolore doloremque itaque enim. Delectus, possimus.',
        },
        {
          icon: IconBuildingStore,
          title: 'Marketplace',
          description:
            'Buy items, features.',
        },
      ].map(Feature => (
        <Card withBorder key={randomId()}>
          <Group gap={10} wrap="nowrap" mb={10}>
            <ThemeIcon variant="gradient" gradient={{ from: "green", to: "teal" }} size={40}>
              <Feature.icon stroke={2.25} size={26} />
            </ThemeIcon>
            <Text fw={700} lh={1.15}>
              {Feature.title}
            </Text>
          </Group>

          <Text size="sm">{Feature.description}</Text>
        </Card>
      ))}
    </SimpleGrid>
  </Paper>
)

const Premium = (
  <>
    <Divider
      label={<Image src="/images/trekie_SUPER_Badge.svg" h={48} w="auto" />}
    />
    <Paper shadow="sm" className={PremiumStyles.Banner.Root}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Stack gap="xs">
          <Title className={PremiumStyles.Banner.Title} c="white">
            Supercharge Your <br /> Gamified Productivity.
          </Title>
          <Text className={PremiumStyles.Banner.Text}>
            Reaching your life goals never been more fun. <br />
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
  <Paper className={WebsiteStyles.DorkoduBanner.Root}>
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
      <Stack gap="xs">
        <Title className={WebsiteStyles.DorkoduBanner.Title} c="white">
          We are bringing meaning <br /> back to technology again.
        </Title>
        <Text className={WebsiteStyles.DorkoduBanner.Text}>
          Reaching your life goals never been more fun. <br />
          Your first super-week is on us.
        </Text>
        <Button
          size="lg"
          className={WebsiteStyles.DorkoduBanner.Button}
          rightSection={<IconArrowRight stroke={2.5} />}
        >
          Join
        </Button>
      </Stack>
      <Box style={{ alignSelf: 'center', maxWidth: 380 }}>
        <Image src="https://dorkodu.com/images/dorkodu-ecosystem.svg" />
      </Box>
    </SimpleGrid>
  </Paper>
)

import { randomId } from '@mantine/hooks'

function FAQ() {
  const questions = [
    [
      'Apples',
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
    ],
    [
      'Apples',
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
    ],
    [
      'Apples',
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
    ],
    [
      'Apples',
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
    ],
    [
      'Apples',
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
    ],
    [
      'Apples',
      'Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads.',
    ],
  ]

  return (
    <Paper my={50}>
      <Title ta="center">FAQs</Title>
      <Text ta="center">Frequently Asked Questions</Text>

      <SimpleGrid my="lg" cols={{ base: 1, sm: 2, md: 3 }}>
        {questions.map(faq => (
          <Card key={randomId()} withBorder shadow="sm" radius="lg">
            <Text fw={600} lh={1.15}>
              {faq[0]}
            </Text>
            <Text mt={10} size="sm">
              {faq[1]}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Paper>
  )
}

const Pricing = (
  <Paper>
    <Title>Pricing</Title>
    <Text>
      We need to create the next generation human. <br />
      This is a civilizational moment in human history. <br />
      We will go extinct, or will adapt to our new digital-native reality.
    </Text>

    <SimpleGrid my={20} cols={{ base: 1, xs: 2, }}>
      <Card withBorder shadow="sm">

        <Card.Section p="md">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none"><path fill="#00A6ED" d="M2 6a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6Z" /><path fill="#fff" d="M10.281 12.752a.75.75 0 0 1 .75-.75h2.363a2.407 2.407 0 0 1 .562 4.747c-.103.025-.145.158-.068.23l1.786 1.677a.75.75 0 1 1-1.027 1.094l-2.655-2.494a.125.125 0 0 0-.21.091v1.965a.75.75 0 1 1-1.5 0v-6.56Zm1.5 2.438c0 .07.056.125.125.125h1.488a.907.907 0 1 0 0-1.813h-1.488a.125.125 0 0 0-.125.125v1.563Zm-6.913-3.103a.75.75 0 0 0-.75.75v6.43a.75.75 0 0 0 1.5 0v-2.228c0-.069.056-.125.125-.125h2.709a.75.75 0 0 0 0-1.5H5.743a.125.125 0 0 1-.125-.125v-1.577c0-.07.056-.125.125-.125h2.758a.75.75 0 0 0 0-1.5H4.868Zm12.7 0a.75.75 0 0 0-.75.75v6.43c0 .414.335.75.75.75H21.2a.75.75 0 0 0 0-1.5h-2.757a.125.125 0 0 1-.125-.126V17.04c0-.069.056-.125.125-.125h2.708a.75.75 0 0 0 0-1.5h-2.708a.125.125 0 0 1-.125-.125v-1.577c0-.07.056-.125.125-.125H21.2a.75.75 0 0 0 0-1.5h-3.632Zm5.429.75a.75.75 0 0 1 .75-.75h3.633a.75.75 0 0 1 0 1.5h-2.758a.125.125 0 0 0-.125.125v1.577c0 .07.056.125.125.125h2.709a.75.75 0 0 1 0 1.5h-2.709a.125.125 0 0 0-.125.125v1.352c0 .07.056.125.125.125h2.758a.75.75 0 1 1 0 1.5h-3.633a.75.75 0 0 1-.75-.75v-6.43Z" /></g></svg>
          <Group gap={8}>
            <Text span fw={800} fz={32} ff="monospace" >$0</Text>
            <Text fw={600} fz={26} span> FREE</Text>
          </Group>
          <Text>Starter Pack</Text>
        </Card.Section>

        <Card.Section p="md">
          <List icon={<IconCheckbox />}>
            <List.Item></List.Item>
            <List.Item></List.Item>
            <List.Item></List.Item>
          </List>
        </Card.Section>

        <Button size="md" fw={700}>
          GET STARTED
        </Button>
      </Card>

      <Card withBorder shadow="sm">

        <Card.Section p="md">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none"><path fill="#00A6ED" d="M2 6a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6Z" /><path fill="#fff" d="M10.281 12.752a.75.75 0 0 1 .75-.75h2.363a2.407 2.407 0 0 1 .562 4.747c-.103.025-.145.158-.068.23l1.786 1.677a.75.75 0 1 1-1.027 1.094l-2.655-2.494a.125.125 0 0 0-.21.091v1.965a.75.75 0 1 1-1.5 0v-6.56Zm1.5 2.438c0 .07.056.125.125.125h1.488a.907.907 0 1 0 0-1.813h-1.488a.125.125 0 0 0-.125.125v1.563Zm-6.913-3.103a.75.75 0 0 0-.75.75v6.43a.75.75 0 0 0 1.5 0v-2.228c0-.069.056-.125.125-.125h2.709a.75.75 0 0 0 0-1.5H5.743a.125.125 0 0 1-.125-.125v-1.577c0-.07.056-.125.125-.125h2.758a.75.75 0 0 0 0-1.5H4.868Zm12.7 0a.75.75 0 0 0-.75.75v6.43c0 .414.335.75.75.75H21.2a.75.75 0 0 0 0-1.5h-2.757a.125.125 0 0 1-.125-.126V17.04c0-.069.056-.125.125-.125h2.708a.75.75 0 0 0 0-1.5h-2.708a.125.125 0 0 1-.125-.125v-1.577c0-.07.056-.125.125-.125H21.2a.75.75 0 0 0 0-1.5h-3.632Zm5.429.75a.75.75 0 0 1 .75-.75h3.633a.75.75 0 0 1 0 1.5h-2.758a.125.125 0 0 0-.125.125v1.577c0 .07.056.125.125.125h2.709a.75.75 0 0 1 0 1.5h-2.709a.125.125 0 0 0-.125.125v1.352c0 .07.056.125.125.125h2.758a.75.75 0 1 1 0 1.5h-3.633a.75.75 0 0 1-.75-.75v-6.43Z" /></g></svg>
          <Group gap={8}>
            <Text span fw={800} fz={32} ff="monospace" >$0</Text>
            <Text fw={600} fz={26} span> FREE</Text>
          </Group>
          <Text>Starter Pack</Text>
        </Card.Section>

        <Card.Section p="md">
          <List icon={<IconCheckbox />}>
            <List.Item></List.Item>
            <List.Item></List.Item>
            <List.Item></List.Item>
          </List>
        </Card.Section>

        <Button size="md" fw={700}>
          GET STARTED
        </Button>
      </Card>

    </SimpleGrid>

    <Card withBorder shadow="sm">
      <Text>Business</Text>
      <Text>
        Do you need more? Contact us, we can offer a solution that suit your
        needs.
      </Text>
      <Text></Text>
    </Card>
  </Paper>
)