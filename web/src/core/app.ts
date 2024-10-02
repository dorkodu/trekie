import { ICommitment, ICommitRecord, ICommitReward } from "./commit"
import { db as gameDb } from "./db"
import { Game, GameState } from "./game"

export type CreateConfig<TCommitments extends Record<any, ICommitment>> = {
  initialState: GameState,
  commitments: TCommitments,
}

export type CreateTrekie = ReturnType<typeof create>

export function create<TCommitments extends Record<any, ICommitment>>
  ({ initialState, commitments }: CreateConfig<TCommitments>) {

  const { game, useGame, useReadonlyGame, readOnlyGame, mutations } = Game(initialState)

  return {
    use: useReadonlyGame,
    game: readOnlyGame,

    commit<TCommitName extends keyof TCommitments, TEventName extends keyof TCommitments[TCommitName]['events']>(
      commit: TCommitName,
      event: TEventName,
      data: Parameters<TCommitments[TCommitName]['events'][TEventName]>[0]['data']) {

      // 1) mutate game state with commit 2) save this commit record
      if (commitments[commit]) {
        // calculate commit event
        const commitResult = commitments[commit]?.commit(event, data)
        const commitRecord: ICommitRecord<typeof data> = {
          ...commitResult,
          userId: game.getState().user.id,
        }
        // save commit record to db
        gameDb.commits.add(commitRecord, commitRecord.id)
        // apply rewards to game state
        mutations.changeXp(commitRecord.reward.xp)
        mutations.changeCoinsBalance(commitRecord.reward.coins)
      }
    },

  }
}
