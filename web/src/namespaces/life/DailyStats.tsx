import Emoji from "@web/components/misc/Emoji";
import { Card } from "@web/components/ui/card";
import { SimpleGrid, Stack } from "@web/components/ui/layout";
import { trekie } from "@web/lib/trekie";

import { DailyProgress } from "./DailyProgress";
import { SumCard } from "./SumCard";

export function DailyStats() {
  // refresh every time daily stats is rendered
  trekie.game().refresh();

  return (
    <Card>
      <Stack>
        <SimpleGrid cols={{ base: 2 }} spacing="xs">
          <MomentumStatus />
          <StreakStatus />
          <XPStatus />
          <CoinStatus />
        </SimpleGrid>

        <DailyProgress />
      </Stack>
    </Card>
  );
}

export function StreakStatus() {
  const streak = trekie.use(($) => $.streak);

  return (
    <SumCard
      icon={<Emoji emoji="🔥" size={24} />}
      kind="STREAK"
      value={streak}
      color="orange"
    />
  );
}

export function XPStatus() {
  const xp = trekie.use(($) => $.xp);

  return (
    <SumCard
      icon={<Emoji emoji="💠" size={24} />}
      kind="XP"
      value={xp}
      color="blue"
    />
  );
}

export function CoinStatus() {
  const coins = trekie.use(($) => $.coins);

  return (
    <SumCard
      icon={<Emoji emoji="🪙" size={24} />}
      kind="Coins"
      value={coins}
      color="yellow"
    />
  );
}

export function MomentumStatus() {
  const momentum = trekie.use(($) => $.momentum);

  return (
    <SumCard
      icon={<Emoji emoji="🚀" size={24} />}
      kind="MOMENTUM"
      value={momentum}
      subtext="xp/day"
      color="green"
    />
  );
}
