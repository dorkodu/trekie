import { Maybe, Timestamp } from "@/shared/utils"
import { ulid } from "ulid"

export type ICommitReward = { xp: number, coins: number }

// this represents a single commit event message
export interface ICommitMessage<T = any> {
  id: string
  event: string
  kind: string
  instanceId: string
  timestamp: Timestamp
  data: T
}

// we return this to the client
export type ICommitResult<T> = ICommitMessage<T> & { reward: ICommitReward }
// we sync this to API as a verifiable record 
export type ICommitStatus<T> = ICommitResult<T> & { userId: string }
// the action that runs on commit & returns rewards
export type ICommitAction<T> = (status: ICommitMessage<T>) => ICommitReward

export type ICommitmentKind = ReturnType<typeof Commitment>
export type ICommitmentTemplate = {
  name: string
  events: Record<any, ICommitAction<any>>
}

export interface ICommitmentInstanceInput {
  xpDailyTarget: number
  xpGoal: number
}

export const CommitEvent = <T>(action: ICommitAction<T>): ICommitAction<T> => action
export function Commitment
  <TEvents extends ICommitmentTemplate['events'], TKind extends keyof TEvents>
  (name: string, events: TEvents) {
  return {
    name,
    events,

    status: (kind: TKind, instanceId: string, data?: Parameters<TEvents[TKind]>[0]['data']): ICommitMessage<typeof data> =>
    ({
      id: ulid(),
      event: kind.toString(),
      kind: name,
      instanceId,
      timestamp: Date.now(),
      data
    }),

    commit(event: TKind, instanceId: string, data: Parameters<TEvents[TKind]>[0]['data']): ICommitResult<typeof data> {
      // create status object
      let status = this.status(event, instanceId, data)
      // run the action with status object as parameter
      let reward = events[event]!(status)

      return { ...status, reward }
    },

    create({ xpDailyTarget, xpGoal }: ICommitmentInstanceInput): ICommitmentInstance {
      return {
        id: ulid(),
        kind: name,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        completedAt: undefined,
        xpGoal
      }
    }
  }
}

export interface ICommitmentInstance {
  id: string
  kind: string
  xpGoal: number
  completedAt: Maybe<Timestamp>
  createdAt: Timestamp
  lastActivity: Timestamp
}

// For testing purposes
let Habit = Commitment('Todo', {
  'CREATE': CommitEvent(() => ({ xp: 5, coins: 0 })),
  'CHECKED_IN': CommitEvent(() => ({ xp: 5, coins: 0 })),
  'DAILY_GOAL_REACHED': CommitEvent(() => ({ xp: 5, coins: 0 })),
  'COMPLETE': CommitEvent(() => ({ xp: 100, coins: 0 })),
},)


export interface ICommitmentSchema {
  name: string
  events: Record<string, ICommitReward>
}

