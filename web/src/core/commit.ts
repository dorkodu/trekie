import { Timestamp } from "@/shared/utils"
import { ulid } from "ulid"

export type ICommitReward = { xp: number, coins: number }

// this represents a single commit event message
export interface ICommitStatus<T = undefined> {
  id: string
  event: string
  commitment: string
  timestamp: Timestamp
  data: T
}

// we return this to the client
export type ICommitResult<T> = ICommitStatus<T> & { reward: ICommitReward }
// we sync this to API as a verifiable record 
export type ICommitRecord<T> = ICommitResult<T> & { userId: string }
// the action that runs on commit & returns rewards
export type ICommitEvent<T> = (status: ICommitStatus<T>) => ICommitReward

export type ICommitment = ReturnType<typeof Commitment>
export type ICommitmentTemplate = {
  name: string
  events: Record<any, ICommitEvent<any>>
}

export const CommitEvent = <T>(commitEvent: ICommitEvent<T>): ICommitEvent<T> => commitEvent

export function Commitment
  <TEvents extends ICommitmentTemplate['events'], TKind extends keyof TEvents>
  (name: string, events: TEvents) {
  return {
    name,
    events,
    status: (kind: TKind, data?: Parameters<TEvents[TKind]>[0]['data']): ICommitStatus<typeof data> =>
    ({
      id: ulid(),
      event: kind.toString(),
      commitment: name,
      timestamp: Date.now(),
      data
    }),

    commit
      (event: TKind, data: Parameters<TEvents[TKind]>[0]['data'])
      : ICommitResult<typeof data> {

      // create status object
      let status = this.status(event, data)

      // run the action with status object as parameter
      let reward = events[event]!(status)

      return { ...status, reward }
    }
  }
}
