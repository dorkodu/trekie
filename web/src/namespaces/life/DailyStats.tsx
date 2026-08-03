import Emoji from "@web/components/misc/Emoji";
import { SimpleGrid } from "@web/components/ui/layout";
import { trekie } from "@web/lib/trekie";

import { DailyProgress } from "./DailyProgress";
import { SumCard } from "./SumCard";

export function DailyStats() {
  // refresh every time daily stats is rendered
  trekie.game().refresh();

  return (
    <div className="flex flex-col gap-4">
      <SimpleGrid cols={{ base: 2 }} spacing={1}>
        <MomentumStatus />
        <StreakStatus />
        <XPStatus />
        <CoinStatus />
      </SimpleGrid>

      <DailyProgress />
    </div>
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
      subtext={
        <span
          className="font-medium text-xs text-green-600/20 dark:text-green-300/50"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.08)" }}
        >
          xp
        </span>
      }
      color="green"
    />
  );
}
