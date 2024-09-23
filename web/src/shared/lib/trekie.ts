import { CommitEvent, ICommitEvent, ICommitment } from '@/core';
import * as Trekie from '@/core/Trekie'

import { db } from '@/shared/lib/db'

import * as Goal from "@/core/commons/goal"
import * as Habit from "@/core/commons/habit"
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

type CommitmentsShortcut = Record<any, Record<any, ICommitEvent<any>>>

type TrekieCreateConfig<TCommitments extends CommitmentsShortcut> = {
  initialState?: Trekie.GameState,
  commitments: TCommitments,
  use?: Record<string, Trekie.GameComponent>
}

function createTrekie<T extends CommitmentsShortcut>
  ({ initialState, commitments, use }: TrekieCreateConfig<T> = { initialState: blankState, commitments: {} as T }) {
  // initialize game
  const { game, useGame } = Trekie.Game(initialState)

  const cmts = new Map<string, ICommitment>()
  // initialize commitments
  Object.entries(commitments).map(([name, events]) => {
    return Trekie.Commitment<typeof events>(name, events)
  })

  return {
    game: useGame,
    commitments: cmts,
    commit(name: string, event: string, data: ) {

    },
    use,
    db: db,
  }
}

const Todo = Trekie.Commitment("Todo", {
  'CREATE': CommitEvent<string>((status) => { }),
  'CHECK': CommitEvent<string>((status) => { }),
  'DONE': CommitEvent<string>((status) => { }),
})

let commitments = {
  "Todo": Trekie.Commitment("Todo", {
    'CREATE': CommitEvent<string>((status) => { }),
    'CHECK': CommitEvent<string>((status) => { }),
    'DONE': CommitEvent<string>((status) => { }),
  }),
}


export const trekie = createTrekie<typeof commitments>({ initialState, commitments })
export default trekie

