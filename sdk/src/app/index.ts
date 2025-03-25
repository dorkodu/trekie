import { createDb, startDb } from "@sdk/app/db"
import { CommitEvent, Commitments, Game, GameState, ICommitmentKind, ICommitRecord, ICommitReward } from "@sdk/core"
import { useEffect } from "react"
import { useDailyTask } from "./hooks"

export type CreateConfig<TCommitments extends Record<any, ICommitmentKind>> = {
  initialState: GameState,
  commitments: TCommitments,
}

export type CreateMiniApp = ReturnType<typeof createMiniApp>

export function createMiniApp<TCommitments extends Record<any, ICommitmentKind>>
  ({ initialState, commitments }: CreateConfig<TCommitments>) {

  const { game, useGame, useReadonlyGame, readOnlyGame, mutations } = Game(initialState)

  // create dexie db instance & do chores
  const db = createDb()
  startDb(db)

  return {
    use: useReadonlyGame,
    game: readOnlyGame,
    commitments: Commitments(readOnlyGame, mutations, commitments, db),
    useDailyRefresh: useDailyTask(() => { game.getState().dailyRefresh() })
  }
}