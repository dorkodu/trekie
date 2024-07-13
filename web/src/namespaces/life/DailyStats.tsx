import {
  Paper,
  SimpleGrid,
  Stack,
} from '@mantine/core'
import Emoji from '@/shared/components/misc/Emoji'
import { trekie } from "@/shared/lib/trekie"

import { SumCard } from './SumCard'
import { DailyProgress } from './DailyProgress'

export function DailyStats() {
  const progress = trekie.game($ => $.dailyProgress())

  return (
    <Paper>
      <Stack>
        <SimpleGrid cols={{ base: 2 }} spacing="xs">
          <MomentumStatus />
          <StreakStatus />
          <XPStatus />
          <CoinStatus />
        </SimpleGrid>

        <DailyProgress value={progress} />
      </Stack>
    </Paper>
  )
}

export function StreakStatus() {
  const streak = trekie.game($ => $.streak)

  return (
    <SumCard
      icon={<Emoji emoji="🔥" size={24} />}
      kind="STREAK"
      value={streak}
      color="orange"
    />
  )
}

export function XPStatus() {
  const xp = trekie.game($ => $.xp)

  return (
    <SumCard
      icon={<Emoji emoji="💠" size={24} />}
      kind="XP"
      value={xp}
      color="blue"
    />
  )
}

export function CoinStatus() {
  const coins = trekie.game($ => $.coins)

  return (
    <SumCard
      icon={<Emoji emoji="🪙" size={24} />}
      kind="Coins"
      value={coins}
      color="yellow"
    />
  )
}

export function MomentumStatus() {
  const momentum = trekie.game($ => $.momentum)

  return (
    <SumCard
      icon={<Emoji emoji="🚀" size={24} />}
      kind="MOMENTUM"
      value={momentum}
      color="green"
    />
  )
}
