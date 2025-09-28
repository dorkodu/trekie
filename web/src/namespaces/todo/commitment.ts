import { CommitEvent, Commitment } from "@sdk/core/index"

export const todoCommitment = Commitment(
  'Todo',
  {
    'START': CommitEvent(() => ({ xp: +5, coins: 0 })),
    'DONE': CommitEvent(() => ({ xp: +5, coins: 0 })),
    'GIVEUP': CommitEvent(() => ({ xp: 0, coins: -1 })),
  }
)