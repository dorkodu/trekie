import {
  Box,
  Center,
  Divider,
  Group,
  MantineColor,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core'
import Emoji from '../custom/Emoji'
import { useThemed, vanilla } from '#/styles/theme'
import { trekie } from "#/lib/trekie"
import { format } from "#/lib/format";

export function DailyStats() {

  const momentum = trekie.game($ => $.momentum)
  const xp = trekie.game($ => $.xp)
  const coins = trekie.game($ => $.coins)
  const streak = trekie.game($ => $.streak)
  const progress = trekie.game($ => $.dailyProgress())

  return (
    <Paper>
      <Stack>
        <SimpleGrid cols={{ base: 2 }} spacing="xs">
          <MomentumStatus value={momentum} />
          <StreakStatus days={streak} />
          <XPStatus value={xp} />
          <CoinStatus value={coins} />
        </SimpleGrid>

        <DailyProgress value={progress} />
      </Stack>
    </Paper>
  )
}

export function DailyProgress({ value }: { value: number }) {
  let color: MantineColor
  let message: string

  value = value * 100

  if (value < 30) {
    message = 'Bad'
    color = 'red'
  } else if (value >= 30 && value < 45) {
    message = 'Meh'
    color = 'orange'
  } else if (value >= 45 && value < 60) {
    message = 'OK'
    color = 'yellow'
  } else if (value >= 60 && value < 80) {
    message = 'Good'
    color = 'lime'
  } else if (value >= 80 && value < 95) {
    message = 'Great'
    color = 'green'
  } else if (value >= 95) {
    message = 'Awesome!'
    color = 'green'
  } else {
    message = ''
    color = 'red'
  }

  return (
    <Stack gap={2}>
      <Divider label="Your Daily Progress" labelPosition="left" />
      <Progress.Root
        color={color}
        radius="lg"
        size={20}
        styles={{ section: { transition: 'width 100ms linear 0s' } }}
      >
        <Tooltip
          label={format.percentage(value)}
          arrowOffset={5}
          arrowSize={6}
          arrowRadius={2}
          withArrow
        >
          <Progress.Section color={color} striped value={value} animated>
            <Progress.Label>{message}</Progress.Label>
          </Progress.Section>
        </Tooltip>
      </Progress.Root>
    </Stack>
  )
}

export function SumCard({
  icon,
  value,
  color,
  kind
}: {
  icon: React.ReactNode
  value: number
  color: string
  kind?: string
}) {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper style={{
      padding: 0,
      background: vanilla.colors[color]?.light,
      border: `2px solid ${vanilla.colors[color]?.lightHover}`,
      boxShadow: `0px 3px 0px 0px ${vanilla.colors[color]?.light}`,
    }}>
      <Group wrap="nowrap" gap={0} justify="space-between">

        <Stack gap={4} px={6} py={6} pt={8}>
          <Text span lh={0.75} fw={800}

            c={
              colorScheme == 'dark'
                ? vanilla.colors.white
                : vanilla.colors.black
            }
            style={{ textShadow: `1px 1px 2px ${useThemed({ dark: "#111", light: "#fff" })}` }}
          >
            {value}
          </Text>
          <Text
            tt="uppercase"
            c={vanilla.colors[color]?.filled}
            fw={700}
            size="11"
            lh={1}
          >
            {kind}
          </Text>
        </Stack>
        <Box pr={6}>
          <Center>{icon}</Center>
        </Box>
      </Group>
    </Paper>
  )
}

export function StreakStatus({ days }: { days: number }) {
  return (
    <SumCard
      icon={<Emoji emoji="🔥" size={24} />}
      kind="STREAK"
      value={days}
      color="orange"
    />
  )
}

export function XPStatus({ value }: { value: number }) {
  return (
    <SumCard
      icon={<Emoji emoji="💠" size={24} />}
      kind="XP"
      value={value}
      color="blue"
    />
  )
}

export function CoinStatus({ value }: { value: number }) {
  return (
    <SumCard
      icon={<Emoji emoji="🪙" size={24} />}
      kind="Coins"
      value={value}
      color="yellow"
    />
  )
}

export function MomentumStatus({ value }: { value: number }) {
  return (
    <SumCard
      icon={<Emoji emoji="🚀" size={24} />}
      kind="MOMENTUM"
      value={value}
      color="green"
    />
  )
}

export function CoinStats({ }: {}) {
  return <Stack></Stack>
}
