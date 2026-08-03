import { Commitments, Game, type GameState, type ICommitmentKind } from "../core"
import { createDb, startDb } from "./db"
import { dailyTask } from "./hooks"
import { createMomentumHelpers } from "./momentum"

export type CreateConfig<TCommitments extends Record<any, ICommitmentKind>> = {
  initialState: GameState,
  commitments: TCommitments,
}

export type CreateApp = ReturnType<typeof createApp>

export function createApp<TCommitments extends Record<any, ICommitmentKind>>
  ({ initialState, commitments }: CreateConfig<TCommitments>) {

  const { game, useReadonlyGame, readOnlyGame, mutations } = Game(initialState)

  // create dexie db instance & do chores (only on client side)
  let db: ReturnType<typeof createDb>
  if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
    try {
      db = createDb()
      startDb({
        db,
        onPopulate: () => {

        },
        onReady: () => {
          console.info("[sdk] game db is ready.")
        },
        onError(e) {
          console.error("[sdk] db open failed!")
          console.error(e)
        },
      })
    } catch (error) {
      console.error("[sdk] failed to initialize database:", error)
      // Provide a mock db that throws errors
      db = {
        commitRecords: {
          add: () => { throw new Error('Database not available') },
          where: () => ({ equals: () => ({ reverse: () => ({ sortBy: () => Promise.resolve([]) }) }) }),
          get: () => Promise.resolve(null),
        },
        commitments: {
          update: () => Promise.resolve(),
          table: { update: () => Promise.resolve() },
        },
        users: {
          add: () => Promise.resolve(),
        },
      } as any
    }
  } else {
    // Server-side: provide a mock db that throws errors for any operations
    db = {
      commitRecords: {
        add: () => { throw new Error('Database not available on server') },
        where: () => ({ equals: () => ({ reverse: () => ({ sortBy: () => Promise.resolve([]) }) }) }),
        get: () => Promise.resolve(null),
      },
      commitments: {
        update: () => Promise.resolve(),
        table: { update: () => Promise.resolve() },
      },
      users: {
        add: () => Promise.resolve(),
      },
    } as any
  }

  return {
    use: useReadonlyGame,
    useGame: useReadonlyGame,
    game: readOnlyGame,
    db,

    commitments: Commitments(readOnlyGame, mutations, commitments, db),

    momentum: createMomentumHelpers(useReadonlyGame),

    dailyRefresh: dailyTask(() => game.getState().refresh()),
  }
}