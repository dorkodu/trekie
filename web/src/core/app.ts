import { useEffect } from "react"
import { ICommitmentKind, ICommitRecord, ICommitReward } from "./commit"
import { TrekieBaseCommitment } from "./consts"
import { db } from "./db"
import { Game, GameState } from "./game"

export type CreateConfig<TCommitments extends Record<any, ICommitmentKind>> = {
  initialState: GameState,
  commitments: TCommitments,
}

export type CreateTrekie = ReturnType<typeof create>

export function create<TCommitments extends Record<any, ICommitmentKind>>
  ({ initialState, commitments }: CreateConfig<TCommitments>) {

  const { game, useGame, useReadonlyGame, readOnlyGame, mutations } = Game(initialState)

  function act<TCommitName extends keyof TCommitments, TEventName extends keyof TCommitments[TCommitName]['events']>(
    { kind, event, id, data }: {
      kind: TCommitName,
      event: TEventName,
      id: string,
      data: Parameters<TCommitments[TCommitName]['events'][TEventName]>[0]['data']
    }) {

    // 1) mutate game state with commit 2) save this commit record
    // calculate commit event
    const commitResult = commitments[kind]!.commit(event, id, data)
    const commitRecord: ICommitRecord<typeof data> = {
      ...commitResult,
      userId: game.getState().user.id,
    }
    // save commit record to db
    db.commitRecords.add(commitRecord, commitRecord.id)
    db.commitments.update(id, { lastActivity: Date.now() })
    // apply rewards to game state
    mutations.changeXp(commitRecord.reward.xp)
    mutations.changeCoinsBalance(commitRecord.reward.coins)
  }

  function createCommitment<TCommitments extends typeof commitments, TKind extends keyof TCommitments>(kind: TKind) {
    let instance = commitments[kind]!.create()
    db.commitments.add(instance, instance.id)
    return instance
  }

  function completeCommitment(id: string) {
    db.commitments.update(id, { completedAt: Date.now() })
  }

  function deleteCommitment(id: string) {
    db.commitments.update(id, { isDeleted: true })
  }

  function useDailyRefresh() {
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

  return {
    use: useReadonlyGame,
    game: readOnlyGame,
    commitments: {
      create: createCommitment,
      act,
      complete: completeCommitment,
      remove: deleteCommitment,
    },
    useDailyRefresh,
  }
}