import { CommitEvent, Commitment, GameState } from "@/core"

export const actionXpGains = {
  Habit: {
    Add: +5,
    Complete: +50,
    Positive: +2,
    Negative: -2,
  },
  Goal: {
    Add: +2,
    Complete: +500,
    Memory: +10,
    Sale: +30,
    Link: +5,
    Share: +5,
  },
  Memory: {
    Post: +2,
    Like: +1,
  },
  Life: {
    DailySession: +1
  },
  Social: {
    NewFriend: +5,
    ProfileEdit: +5,
  },
  App: {}
}

export const TrekieBaseCommitment = Commitment('Trekie', {
  'COMMITMENT:START': CommitEvent(() => ({ xp: +1, coins: 0 })),
  'COMMITMENT:COMPLETE': CommitEvent(() => ({ xp: +100, coins: +10 })),
  'COMMITMENT:CHECKIN': CommitEvent(() => ({ xp: +2, coins: +1 })),
  'COMMITMENT:GIVEUP': CommitEvent(() => ({ xp: -10, coins: 0 })),
})




