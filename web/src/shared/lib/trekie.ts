import { CommitEvent, ICommitEvent, ICommitment, ICommitReward } from '@/core'
import * as Trekie from '@/core'

import { db } from '@/shared/lib/db'

import { mock } from './mock'

const blankState: Trekie.GameState = {
  // points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  // dailies
  xpTargetDaily: 0,

  // timestamps
  lastXp: undefined,
  lastStreak: undefined,
  lastActive: undefined,

  user: undefined,

  lastDailyCheck: undefined,

  xpHistory: {},
}

const initialState: Trekie.GameState = mock.game

/**
 * TODO: add importing existing state NOT BLANK/MOCK EVERY TIME 
 * 1) local for restoring session 
 * 2) remote after new login
 * 
 * now we use a clean state & mock data
 */

type TrekieCreateConfig<TCommitments extends Record<any, Trekie.ICommitment>> = {
  initialState?: Trekie.GameState,
  commitments: TCommitments,
  use?: Record<string, Trekie.GameComponent>
}

function createTrekie<TCommitments extends Record<any, Trekie.ICommitment>>
  ({ initialState, commitments, use }: TrekieCreateConfig<TCommitments> = { initialState: blankState, commitments: {} as TCommitments }) {
  // initialize game
  const { game, useGame } = Trekie.Game(initialState)

  function applyGameRewards(reward: ICommitReward) {
    game.getState().changeXp(reward.xp)
    game.getState().changeCoinsBalance(reward.coins)
  }

  // initialize commitments as Map and Record for utility
  return {
    game: useGame,
    commit<TCommitName extends keyof TCommitments, TEventName extends keyof TCommitments[TCommitName]['events']>(
      commit: TCommitName,
      event: TEventName,
      data: Parameters<TCommitments[TCommitName]['events'][TEventName]>[0]['data']) {

      // 1) mutate game state with commit 2) save this commit record
      if (commitments[commit]) {
        const commitRecord = commitments[commit]?.commit(event, data)
        applyGameRewards(commitRecord.reward)
        // TODO: db.commits.add(commitRecord, commitRecord.id)
      }

    },

    use,
    db: db
  }
}

const Todo = Trekie.Commitment("Todo", {
  'CREATE': CommitEvent<null>((status) => ({ xp: +1, coins: +1 })),
  'DAILYCHECK': CommitEvent<null>(() => ({ xp: +5, coins: 0 })),
  'DONE': CommitEvent<null>(() => ({ xp: +25, coins: +2 })),
})

const Habit = Trekie.Commitment("Habit", {
  'CREATE': CommitEvent<{}>(() => ({ xp: +1, coins: +1 })),
  'UPDATE': CommitEvent<{}>(() => ({ xp: +1, coins: +1 })),
  'DAILY_TARGET_REACHED': CommitEvent<{}>(() => ({ xp: +5, coins: 0 })),
  'COUNT_UP': CommitEvent<{}>(() => ({ xp: +25, coins: +2 })),
  'COUNT_DOWN': CommitEvent<{}>(() => ({ xp: +25, coins: +2 })),
})

const CheckIn = {
  'DAILYCHECK': { xp: +1, coins: +1 },
  'CREATE': { xp: +1, coins: +1 },
  'DONE': { xp: +25, coins: +2 },
}

let commitments = { Todo, Habit }

export const trekie = createTrekie<typeof commitments>({ initialState, commitments })
export default trekie

trekie.commit('Todo', 'DAILYCHECK', null)

