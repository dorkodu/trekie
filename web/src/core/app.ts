import { CommitEvent } from '@/core';
import { useEffect } from "react";
import { Commitments, ICommitmentKind, ICommitRecord, ICommitReward } from "./commit";
import { Game, GameState } from "./game";

export type CreateConfig<TCommitments extends Record<any, ICommitmentKind>> = {
  initialState: GameState,
  commitments: TCommitments,
}

export type CreateTrekie = ReturnType<typeof create>

export function create<TCommitments extends Record<any, ICommitmentKind>>
  ({ initialState, commitments }: CreateConfig<TCommitments>) {

  const { game, useGame, useReadonlyGame, readOnlyGame, mutations } = Game(initialState)

  function useDailyRefresh() {
    useEffect(() => {
      const task = () => { game.getState().dailyRefresh() }

      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setUTCHours(0, 0, 0, 0)

      let interval: ReturnType<typeof setInterval>
      let timeout = setTimeout(() => {
        task()
        interval = setInterval(task, 24 * 60 * 60 * 1000)
      }, tomorrow.getTime() - today.getTime())

      return () => {
        clearTimeout(interval)
        clearTimeout(timeout)
      }
    }, [])
  }

  return {
    use: useReadonlyGame,
    game: readOnlyGame,
    commitments: Commitments(readOnlyGame, mutations, commitments),
    useDailyRefresh,
  }
}