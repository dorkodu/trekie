import { Timestamp } from "@/shared/utils"
import { ulid } from "ulid"

export type ICommitReward = { xp: number, coins: number }

// this represents a single commit event message
export interface ICommitStatus<T = any> {
  id: string
  event: string
  commitment: string
  instanceId: string,
  timestamp: Timestamp
  data: T
}

// we return this to the client
export type ICommitResult<T> = ICommitStatus<T> & { reward: ICommitReward }
// we sync this to API as a verifiable record 
export type ICommitRecord<T> = ICommitResult<T> & { userId: string }
// the action that runs on commit & returns rewards
export type ICommitEvent<T> = (status: ICommitStatus<T>) => ICommitReward

export type ICommitmentKind = ReturnType<typeof Commitment>
export type ICommitmentKindTemplate = {
  name: string
  events: Record<any, ICommitEvent<any>>
  xpGoal: number
  xpDailyTarget: number
}

export const CommitEvent = <T>(commitEvent: ICommitEvent<T>): ICommitEvent<T> => commitEvent

export function Commitment
  <TEvents extends ICommitmentKindTemplate['events'], TKind extends keyof TEvents>
  (name: string, events: TEvents, xpGoal: number, xpDailyTarget: number) {
  return {
    name,
    events,
    xpGoal,
    xpDailyTarget,

    status: (kind: TKind, instanceId: string, data?: Parameters<TEvents[TKind]>[0]['data']): ICommitStatus<typeof data> =>
    ({
      id: ulid(),
      event: kind.toString(),
      commitment: name,
      instanceId,
      timestamp: Date.now(),
      data
    }),

    commit(event: TKind, data: Parameters<TEvents[TKind]>[0]['data']): ICommitResult<typeof data> {
      // create status object
      let status = this.status(event, data)
      // run the action with status object as parameter
      let reward = events[event]!(status)

      return { ...status, reward }
    },

    create(): ICommitmentInstance {
      return {
        id: ulid(),
        kind: name,
        createdAt: Date.now(),
        lastActivity: Date.now()
      }
    }
  }
}

export interface ICommitmentInstance {
  id: string
  kind: string
  createdAt: Timestamp
  lastActivity: Timestamp
}
