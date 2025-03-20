import { CommitEvent, Commitment } from "@sdk/core/index"

export const habitCommitment = Commitment(
  'Habit',
  {
    'START': CommitEvent(() => ({ xp: +5, coins: 0 })),
    'COUNT_UP': CommitEvent(() => ({ xp: 0, coins: 0 })),
    'COUNT_DOWN': CommitEvent(() => ({ xp: 0, coins: 0 })),
    'DAILYCHECK': CommitEvent(() => ({ xp: +3, coins: 0 })),
    'GIVEUP': CommitEvent(() => ({ xp: 0, coins: -1 })),
  }
)