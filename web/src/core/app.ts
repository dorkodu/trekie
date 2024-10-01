import { GameComponent, ICommitment, ICommitRecord, ICommitReward } from "."
import { db as gameDb } from "./db"
import { Game, GameState } from "./game"

export type CreateConfig<TCommitments extends Record<any, ICommitment>, TUse extends Record<any, any>> = {
  initialState: GameState,
  commitments: TCommitments,
  use?: TUse
}

export type MiniApp = ReturnType<typeof createApp>

export function createApp<TCommitments extends Record<any, ICommitment>>
  ({ initialState, commitments, use }: CreateConfig<TCommitments>) {
  // initialize game
  const { game, useGame } = Game(initialState)

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
        const commitResult = commitments[commit]?.commit(event, data)
        const commitRecord: ICommitRecord<typeof data> = {
          ...commitResult,
          userId: game.getState().user.id,
        }

        gameDb.commits.add(commitRecord, commitRecord.id)
        applyGameRewards(commitResult.reward)
      }
    },
    use,
  }
}
