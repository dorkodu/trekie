import { useEffect } from "react"
import { ICommitmentKind, ICommitReward, ICommitStatus } from "./commit"
import { db as gameDb } from "./db"
import { Game, GameState } from "./game"

export type CreateConfig<TCommitments extends Record<any, ICommitmentKind>> = {
  initialState: GameState,
  commitments: TCommitments,
}

export type CreateTrekie = ReturnType<typeof create>

export function create<TCommitments extends Record<any, ICommitmentKind>>
  ({ initialState, commitments }: CreateConfig<TCommitments>) {

  const { game, useGame, useReadonlyGame, readOnlyGame, mutations } = Game(initialState)

  return {
    use: useReadonlyGame,
    game: readOnlyGame,

    commit<TCommitName extends keyof TCommitments, TEventName extends keyof TCommitments[TCommitName]['events']>(
      commit: TCommitName,
      event: TEventName,
      id: string,
      data: Parameters<TCommitments[TCommitName]['events'][TEventName]>[0]['data']) {

      // 1) mutate game state with commit 2) save this commit record
      if (commitments[commit]) {
        // calculate commit event
        const commitResult = commitments[commit].commit(event, id, data)
        const commitRecord: ICommitStatus<typeof data> = {
          ...commitResult,
          userId: game.getState().user.id,
        }
        // save commit record to db
        gameDb.statuses.add(commitRecord, commitRecord.id)
        // apply rewards to game state
        mutations.changeXp(commitRecord.reward.xp)
        mutations.changeCoinsBalance(commitRecord.reward.coins)
      }
    },

    useDailyRefresh() {
      useEffect(() => {
        const task = () => { game.getState().refresh() }

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
  }
}