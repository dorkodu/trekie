import { Commitments, Game, GameState, ICommitmentKind } from "../core"
import { createDb, startDb } from "./db"
import { dailyTask } from "./hooks"

export type CreateConfig<TCommitments extends Record<any, ICommitmentKind>> = {
  initialState: GameState,
  commitments: TCommitments,
}

export type CreateMiniApp = ReturnType<typeof createMiniApp>

export function createMiniApp<TCommitments extends Record<any, ICommitmentKind>>
  ({ initialState, commitments }: CreateConfig<TCommitments>) {

  const { game, useReadonlyGame, readOnlyGame, mutations } = Game(initialState)

  // create dexie db instance & do chores
  // TODO: catch errors if any, with tryCatch 
  const db = createDb()
  startDb(db)

  return {
    use: useReadonlyGame,
    useGame: useReadonlyGame,
    game: readOnlyGame,

    commitments: Commitments(readOnlyGame, mutations, commitments, db),

    dailyRefresh: dailyTask(() => game.getState().refresh()),
  }
}