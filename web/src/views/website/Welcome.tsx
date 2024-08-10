import { Anchor, BackgroundImage, Box, Button, Card, Divider, Flex, Group, Image, List, Paper, SimpleGrid, Stack, Text, TextInput, ThemeIcon, Title, rem }
  from '@mantine/core'
import { IconAdOff, IconArrowRight, IconBuildingCommunity, IconBuildingStore, IconCheck, IconCircleCheckFilled, IconCoins, IconCopyCheck, IconInfinity, IconLockAccess, IconMail, IconMultiplier2x, IconPhoto, IconPin, IconRocket, IconSparkles, IconTargetArrow, IconUserCheck, IconUsersGroup, IconWorld, }
  from '@tabler/icons-react'

import GlassCard from '@/shared/components/cards/GlassCard'

import * as PremiumStyles from '@/styles/views/Premium.css'

export default function Welcome() {
  return (
    <Stack p={10} mt="4vw">
      <Hero />

      {Join}
      {Premium}
      {ItWorks}
      {Features}
      {Pricing}
      <FAQ />
    </Stack>
  )
}

const Hero = () => {
  const navigate = useNavigate()

  return (
    <Paper p={10}>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Stack gap="sm">
          <div>
            <Image src={'/images/Hero.svg'} mx="auto" maw={360} />
          </div>

          <Text size="lg" lh={1} fw={800} c="dimmed" ta="center">INTRODUCING TREKIE</Text>
          <Title style={{
            fontSize: 28,
            fontWeight: 750,
            lineHeight: 1.0,
            letterSpacing: -0.65,
            maxWidth: 400,
            margin: "0 auto",
            textAlign: "center"
          }}>
            Your social and gamified <br /> productivity companion.
          </Title>

          <Stack w="90%" maw={320} gap={12} mx="auto">
            <Button size="md" fw={700} onClick={() => { navigate("#join") }}>
              GET STARTED
            </Button>
            <Button size="md" fw={700} variant="light" onClick={() => { navigate("/login") }}>
              I ALREADY HAVE ACCOUNT
            </Button>
          </Stack>
        </Stack>

        <BackgroundImage
          src={useThemed({
            light: "https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            dark: "https://images.unsplash.com/photo-1672036634540-0ef7c2c71447?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          })}
          maw={540}
          mx="auto"
          my="lg"
          radius="lg"
          px={16}
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
                { icon: <IconTargetArrow size={28} />, title: 'Add Life Goals', description: 'Design your new life.' },
                { icon: <IconCopyCheck size={26} />, title: 'Track Habits', description: 'Never been more enjoyable.' },
                { icon: <IconSparkles size={26} />, title: 'Share Moments', description: 'Progress with close friends.' },
              ].map(x => (
                <GlassCard key={x.title}>
                  <Group wrap="nowrap">
                    {/* @ts-ignore */}
                    <ThemeIcon gradient={{ from: vanilla.colors.green.filledHover, to: vanilla.colors.teal.lightColor, deg: 180 }}
                      size={40} variant="gradient" radius={10}>
                      {x.icon}
                    </ThemeIcon>
                    <Stack gap={0} pr={8}>
                      <Text fw={700}>{x.title}</Text>
                      <Text>{x.description}</Text>
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
  <Paper component="section" p="lg" my="xl" id='it-works'>
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
  <Paper p="md" my={50} id='features'>
    <Group align="center" justify="center" gap={6}>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 128 128"><path fill="#424242" d="M87.4 124H40.6c-4.7 0-8.6-3.8-8.6-8.6V12.6C32 7.9 35.9 4 40.6 4h46.8c4.7 0 8.6 3.8 8.6 8.6v102.9c0 4.7-3.9 8.5-8.6 8.5z" /><path d="M86.77 120.11H39.93c-2.15 0-3.89-1.74-3.89-3.89V19.65c0-2.14 1.74-3.88 3.88-3.88h48.15c2.15 0 3.89 1.74 3.89 3.89v95.93c0 .93-1.4 4.52-5.19 4.52z" /><path fill="#212121" d="M73.65 11.59h-19.2c-.7 0-1.2-.6-1.2-1.2s.6-1.2 1.2-1.2h19.1c.7 0 1.2.6 1.2 1.2s-.5 1.2-1.1 1.2z" /><path fill="#757575" d="M87.4 6c3.64 0 6.6 2.96 6.6 6.6v102.9c0 3.58-2.96 6.5-6.6 6.5H40.6c-3.64 0-6.6-2.96-6.6-6.6V12.6C34 9.02 37.02 6 40.6 6h46.8m0-2H40.6C35.9 4 32 7.9 32 12.6v102.8c0 4.8 3.9 8.6 8.6 8.6h46.8c4.7 0 8.6-3.8 8.6-8.5V12.6C96 7.8 92.1 4 87.4 4z" /><path fill="#EAB56E" d="M48.35 29.96h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#FB8C00" d="M60.9 29.96h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#FF80AB" d="M73.45 29.96H67.1c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.33 1.32z" /><path fill="#0288D1" d="M86.01 29.96h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#00BFA5" d="M48.35 44.12h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#81D4FA" d="M60.9 44.12h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#FB8C00" d="M73.45 44.12H67.1c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.33 1.32z" /><path fill="#EAB56E" d="M86.01 44.12h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#FB8C00" d="M48.35 58.28h-6.36c-.73 0-1.32-.59-1.32-1.32V50.6c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#FF80AB" d="M60.9 58.28h-6.36c-.73 0-1.32-.59-1.32-1.32V50.6c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#00BFA5" d="M73.45 58.28H67.1c-.73 0-1.32-.59-1.32-1.32V50.6c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.33 1.32z" /><path fill="#0288D1" d="M86.01 58.28h-6.36c-.73 0-1.32-.59-1.32-1.32V50.6c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32zM48.35 72.44h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32z" /><path fill="#81D4FA" d="M60.9 72.44h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .73-.59 1.32-1.32 1.32zm-12.55 42.48h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .72-.59 1.32-1.32 1.32z" /><path fill="#0288D1" d="M60.9 114.92h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .72-.59 1.32-1.32 1.32z" /><path fill="#00BFA5" d="M73.45 114.92H67.1c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .72-.59 1.32-1.33 1.32z" /><path fill="#FF80AB" d="M86.01 114.92h-6.36c-.73 0-1.32-.59-1.32-1.32v-6.36c0-.73.59-1.32 1.32-1.32h6.36c.73 0 1.32.59 1.32 1.32v6.36c0 .72-.59 1.32-1.32 1.32z" /></svg>
      <Title ta="center" order={2} size={32} fw={800}>Features</Title>
    </Group>

    <Text mx="auto" maw={600} lh={1.25} my={20} size="lg">
      Working with Trekie is fun! You <b>track your habits</b> with bite-sized actions every day, earn <b>XP</b> and <b>coins</b> while getting better at real world.
    </Text>

    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt={40}>
      {[
        {
          icon: IconTargetArrow,
          title: 'Life Goals',
          description:
            'Tell the world about what you want.',
        },
        {
          icon: IconCopyCheck,
          title: 'Habits',
          description:
            'Keep track of your regular to-dos.',
        },
        {
          icon: IconRocket,
          title: 'Momentum',
          description:
            'See how well you are doing.',
        },
        {
          icon: IconSparkles,
          title: 'XP',
          description: "Life is about experience!",
        },
        {
          icon: IconCoins,
          title: 'Coins',
          description:
            'Earn rewards for your commitments.',
        },
        {
          icon: IconPhoto,
          title: 'Stories',
          description:
            'Share memories from your journey.',
        },
        {
          icon: IconUsersGroup,
          title: 'Community',
          description:
            'Connect with others.',
        },
        {
          icon: IconUserCheck,
          title: 'Profile & Follows',
          description:
            "Show your friends what's news.",
        },
        {
          icon: IconBuildingStore,
          title: 'Marketplace',
          description:
            'Buy boosts, features, and life packs.',
        },
      ].map(Feature => (
        <Card withBorder key={randomId()} p={8} radius="lg">
          <Group gap={10} wrap="nowrap" align="flex-start">
            <ThemeIcon variant="gradient" gradient={{ from: "green", to: "teal" }} size={40} radius={12}>
              <Feature.icon stroke={2.25} size={26} />
            </ThemeIcon>
            <Stack gap={0}>
              <Title order={3} fw={700} lh={1.35} fz={16}>
                {Feature.title}
              </Title>
              <Text size="sm" >{Feature.description}</Text>
            </Stack>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  </Paper>
)

const Premium = (
  <Paper shadow="sm" className={PremiumStyles.Banner.Root} my={50} id='premium'>
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
            {
              icon: <IconAdOff />,
              title: 'Ad-free',
              description: 'No interruptions, full productivity.'
            },
            {
              icon: <IconMultiplier2x />,
              title: 'Doubled Gains',
              description: 'More coins, XP and items available.'
            },
            {
              icon: <IconUsersGroup />,
              title: 'Groups',
              description: 'Share common goals & habits with friends. Say hello to social productivity boost!'
            }
          ].map(x => (
            <List.Item key={x.title} icon={<ThemeIcon variant="light" c="white" size={36}>{x.icon}</ThemeIcon>}>
              <Text fw={700} c="white" lh={1.1}>{x.title}</Text>
              <Text c="white">{x.description}</Text>
            </List.Item>
          ))}
        </List>
      </Box>
    </SimpleGrid>
  </Paper>
)

const Join = (
  <Stack style={{ alignSelf: "center", marginTop: rem(30), maxWidth: 600, gap: 0, alignItems: "center" }}>

    <Group gap={8}>
      <ThemeIcon size={36} variant="white">
        <IconLockAccess size={28} />
      </ThemeIcon>
      <Title order={2} fw={700} lts={-0.5} mr={20}>Early Access</Title>
    </Group>

    <Text size="lg">Enter your email to get the invite link.</Text>
    <Text fw={450} c="dimmed">It's free & you will earn gifts and credits.</Text>

    <Group gap={6} mt="sm" mx="md">
      <TextInput
        styles={{
          input: {
            border: `2px solid ${vanilla.colors.gray.light}`
          }
        }}
        style={{ flexGrow: 1, flexShrink: 1 }}
        leftSectionPointerEvents="none"
        leftSection={<IconMail style={{ width: rem(20), height: rem(20) }} />}
        placeholder="Email"
        variant="filled"
        size="md"
        radius="lg"
      />
      <Button size="md" fw={700} variant="gradient" gradient={{ from: "green", to: "teal" }} style={{ flexGrow: 1, flexShrink: 1 }}>JOIN WAITLIST</Button>
    </Group>

  </Stack>
)


import { randomId } from '@mantine/hooks'
import { vanilla } from '@/styles/theme'
import { useNavigate } from 'react-router-dom'
import Emoji from '@/shared/components/misc/Emoji'
import { useThemed } from '@/shared/hooks'

function FAQ() {
  const questions = [
    [
      'What is gamification?',
      `It's the application of game elements and game principles in non-game contexts, which can be used to improve engagement, productivity, learning, flow and more!`,
    ],
    [
      'How much it costs?',
      `Trekie is free to use with basic features. For premium features, you can subscribe for $6/month. We also offer a free trial for the first week.`,
    ],
    [
      'How to get support?',
      <>For premium members, you can send us a mail explaining support to <Anchor href='mailto:help@trekie.io' target="_blank">help@trekie.io</Anchor>. For free tier, unfortunately we can't provide customer support.</>,
    ],
  ]

  return (
    <Paper my={50} id='faq'>
      <Title order={2} fw={750} ta="center">FAQs</Title>
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
  <Paper id='pricing'>
    <Group wrap='nowrap' gap={8} justify='center' mr={8}>
      <Emoji emoji='💸' size={32} />
      <Title order={2} fw={800} size={32} lts={-0.5}>Pricing</Title>
    </Group>

    <Text size='lg' ta="center">One app to gamify your life and productivity.</Text>

    <SimpleGrid my={20} cols={{ base: 1, xs: 2, }} maw={800} mx="auto">

      <Box mt={-10}>
        <Image src="/images/free.svg" w={64} h="auto" style={{ position: "relative", top: 40, left: 12, zIndex: 1 }} />
        <Card withBorder pb={35}>
          <Card.Section p="md">
            <Box h={26}></Box>
            <Title order={5} fw={800} fz={32} ff="monospace">
              $0
            </Title>
            <Title order={3} fw={600}>Starter Pack</Title>
            <Text>All basics for a new beginning!</Text>
          </Card.Section>

          <Button radius="lg" size="md" fw={700}>
            GET STARTED
          </Button>

          <Card.Section p="md">
            <List icon={<ThemeIcon variant="light" color="green" size={26}><IconCheck size={20} stroke={2.5} /></ThemeIcon>} spacing={0}>
              <List.Item py={1}>3 Life Goals</List.Item>
              <List.Item py={1}>10 Habits</List.Item>
              <List.Item py={1}>One Story Per Day</List.Item>
              <List.Item py={1}>Social Feed</List.Item>
              <List.Item py={1}>1x Gains</List.Item>
            </List>
          </Card.Section>
        </Card>
      </Box>

      <Box>
        <Image src="/images/trekie_SUPER_Badge.svg" h={56} w="auto" style={{ position: "relative", top: 32, left: 12, zIndex: 1 }} />
        <Card shadow="sm" style={{ backgroundImage: PremiumStyles.BackgroundGradient }}>
          <Card.Section p="md">
            <Group gap={8} mt={20}>
              <Title fw={800} fz={36} ff="monospace" c="white">
                $6
                <Text span c="blue.2" fz={20}>/month</Text>
              </Title>
            </Group>
            <Text c="white">Say hello to your new <b>supercharged life</b>!</Text>

          </Card.Section>

          <Button className={PremiumStyles.Banner.Button} size="lg">
            TRY FOR FREE
          </Button>

          <Card.Section p="md">
            <List icon={<ThemeIcon variant="light" color="white" size={36}><IconCircleCheckFilled /></ThemeIcon>} center>
              {
                [
                  { feature: "Increased Limits", icon: <IconInfinity /> },
                  { feature: "No Ads", icon: <IconAdOff /> },
                  { feature: "Doubled Gains", icon: <IconMultiplier2x /> },
                  { feature: "Public Pages", icon: <IconWorld /> },
                  { feature: "Profile Highlights", icon: <IconPin /> },
                  { feature: "Communities", icon: <IconUsersGroup /> },
                ].map(x =>
                  <List.Item py={2} key={x.feature}
                    icon={<ThemeIcon variant="light" color="white" size={32}>{x.icon}</ThemeIcon>}>
                    <Text c="white" fw={500}>{x.feature}</Text>
                  </List.Item>
                )
              }
            </List>
          </Card.Section>
        </Card>
      </Box>
    </SimpleGrid>

    <Divider label="Do you want more?" styles={{ label: { fontSize: 16 } }} mt={40} maw={800} mx="auto" />

    <SimpleGrid my={20} cols={{ base: 1, xs: 2, }} maw={800} mx="auto">
      <Card withBorder>
        <Group wrap='nowrap' align="flex-start">
          <ThemeIcon size="xl" variant="gradient" gradient={{ to: "rgb(0, 191, 250)", from: "rgb(34, 12, 161)" }}>
            <IconUsersGroup size={28} />
          </ThemeIcon>

          <Stack gap={0}>
            <Title order={4}>Teams & Family</Title>
            <Text>
              A better place for small groups to gamify and get productive!
            </Text>
            <Text>
              <i><u>Coming soon!</u></i>
            </Text>
          </Stack>
        </Group>
      </Card>

      <Card withBorder>
        <Group wrap='nowrap' align="flex-start">
          <ThemeIcon size="xl" variant="gradient" gradient={{ to: "rgb(0, 191, 250)", from: "rgb(34, 12, 161)" }}>
            <IconBuildingCommunity size={28} />
          </ThemeIcon>

          <Stack gap={0}>
            <Title order={4}>For Business</Title>
            <Text>
              Advanced controls & support to gamify your organization. <b>Contact us, we can offer a solution that suit your needs.</b>
            </Text>

            <Anchor href='mailto:hey@dorkodu.com'>
              <Group gap={4}>
                <IconMail />
                <Text fw={500} span>hey@dorkodu.com</Text>
              </Group>
            </Anchor>
          </Stack>
        </Group>

      </Card>
    </SimpleGrid>

  </Paper>
)