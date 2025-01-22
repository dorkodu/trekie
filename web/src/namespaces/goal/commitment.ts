import { CommitEvent, Commitment } from "@/core"

export const goalCommitment = Commitment(
  'Goal',
  {
    'START': CommitEvent(() => ({ xp: +25, coins: 0 })),
    'PROGRESS_BEGIN': CommitEvent(() => ({ xp: +100, coins: 0 })),
    'PROGRESS_HALFWAY': CommitEvent(() => ({ xp: +100, coins: 0 })),
    'PROGRESS_ALMOST': CommitEvent(() => ({ xp: +100, coins: 0 })),
    'PROGRESS_DONE': CommitEvent(() => ({ xp: +100, coins: 0 })),
    'COMMITMENT_ADD': CommitEvent(() => ({ xp: +1, coins: 0 })),
    'COMMITMENT_DROP': CommitEvent(() => ({ xp: -1, coins: 0 })),
    'REACH': CommitEvent(() => ({ xp: +1000, coins: +25 })),
    'GIVEUP': CommitEvent((status) => ({ xp: -100, coins: -1 })),
  }
)