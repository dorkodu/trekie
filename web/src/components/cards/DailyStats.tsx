import {
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
import { vanilla } from '#/styles/theme'
import { trekie } from '#/lib/trekie'

export function DailyStats() {

  const momentum = trekie.game($ => $.momentum)
  const xp = trekie.game($ => $.xp)
  const coins = trekie.game($ => $.coins)
  const streak = trekie.game($ => $.streak)
  const progress = trekie.game($ => $.dailyProgress)

  return (
    <Paper p={10}>
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
          label={`${value}%`}
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
  kind,
  value,
  color,
  text,
}: {
  icon: React.ReactNode
  kind: string
  value: number
  color: string
  text?: string
}) {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper p={8} bg={vanilla.colors[color]?.lightHover}>
      <Group wrap="nowrap" gap={10}>
        {icon}
        <Stack gap={0}>
          <Text>
            <Text
              span
              lh={0.75}
              fw={800}
              c={
                colorScheme == 'dark'
                  ? vanilla.colors.white
                  : vanilla.colors.black
              }
            >
              {value}
            </Text>
            {text && (
              <Text span lh={1.25} size="14" fw={400}>
                {text}
              </Text>
            )}
          </Text>
          <Text
            tt="uppercase"
            c={vanilla.colors[color]?.filled}
            fw={700}
            size="12.5"
            lh={1}
          >
            {kind}
          </Text>
        </Stack>
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
      icon={<Emoji emoji="💎" size={24} />}
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
      text=" xp/day"
    />
  )
}

export function CoinStats({ }: {}) {
  return <Stack></Stack>
}
