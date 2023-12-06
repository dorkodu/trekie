import {
  Badge,
  Box,
  Card,
  DefaultMantineColor,
  Group,
  MantineColor,
  MantineThemeColors,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import Emoji from '../custom/Emoji'
import { vanilla } from '#/styles/theme'

export function DailyStats({}: {}) {
  return (
    <Stack>
      <SimpleGrid cols={2}>
        <StreakStatus days={8} />
        <XPStatus value={32649} />
        <CoinStatus value={600} />
      </SimpleGrid>
      <MomentumStatus value={60} />

      <DailyProgress value={60} />
    </Stack>
  )
}

export function DailyProgress({ value }: { value: number }) {
  let color: MantineColor
  let message: string

  value = 100

  if (value < 30) {
    message = 'Bad'
    color = 'red'
  } else if (value >= 30 && value < 45) {
    message = ''
    color = 'orange'
  } else if (value >= 45 && value < 60) {
    message = 'OK'
    color = 'yellow'
  } else if (value >= 60 && value < 80) {
    message = 'Good'
    color = 'lime'
  } else if (value >= 80 && value < 95) {
    message = 'Great.'
    color = 'lime'
  } else {
    message = 'Perfect :)'
    color = 'green'
  }

  return (
    <Progress.Root color={color} radius="lg" size={20}>
      <Tooltip label={`Daily Progress: ${value}%`}>
        <Progress.Section color={color} striped value={value}>
          <Progress.Label>{message}</Progress.Label>
        </Progress.Section>
      </Tooltip>
    </Progress.Root>
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
  return (
    <Paper p={10} bg={vanilla.colors[color]?.lightHover} variant="light">
      <Group wrap="nowrap" gap={10}>
        {icon}
        <Stack gap={0}>
          <Text
            tt="uppercase"
            c={vanilla.colors[color]?.filled}
            fw={700}
            size="sm"
            lh={1}
          >
            {kind}
          </Text>
          <Text>
            <Text span lh={1.25} fw={800}>
              {value}
            </Text>
            {text && (
              <Text span lh={1.25} size="sm" fw={500}>
                {text}
              </Text>
            )}
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

export function CoinStats({}: {}) {
  return <Stack></Stack>
}
