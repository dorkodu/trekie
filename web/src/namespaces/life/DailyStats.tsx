import {
  Center,
  Divider,
  MantineColor,
  Overlay,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import Emoji from '@/shared/components/misc/Emoji'
import { trekie } from "@/shared/lib/trekie"
import { format } from "@/shared/utils/format"
import { SumCard } from './SumCard'
import { vanilla } from '@/styles/theme'

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
  let haveProgressToday = value > 0

  if (value > 0 && value < 30) {
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
    message = 'Nothing.'
    color = 'gray'
  }

  const noProgressToday =
    <Progress.Root
      color="gray"
      radius="lg"
      size={20}>
      <Progress.Section color="gray" striped value={100}>
        <Overlay color="#fff" backgroundOpacity={0} blur={2} zIndex={10}>
          <Center>
            <Text size="sm" c="white" style={{ textShadow: `1px 1px 5px ${vanilla.colors.dark}` }} fw={500}>Nothing so far.</Text>
          </Center>
        </Overlay>
      </Progress.Section>
    </Progress.Root>

  const progressBar =
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
          <Overlay color="#fff" backgroundOpacity={0} zIndex={10}>
            <Center>
              <Text size="sm" c="white" style={{ textShadow: `1px 1px 5px ${vanilla.colors.dimmed}` }} fw={500}>{message}</Text>
            </Center>
          </Overlay>
        </Progress.Section>
      </Tooltip>
    </Progress.Root>

  return (
    <Stack gap={2}>
      <Divider label="Your Daily Progress" labelPosition="left" />
      {haveProgressToday ? progressBar : noProgressToday}
    </Stack >
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
