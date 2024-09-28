import { ulid } from "ulid"

export type ICommitReward = { xp: number, coins: number }

// This is what the commitment returns
interface ICommitStatus<T> {
  id: string
  event: string
  commitment: string
  timestamp: string
  data: T
}

// this is what we save to local DB and API Service
interface ICommitRecord<T = undefined> extends ICommitStatus<T> {
  reward: ICommitReward
}

export type ICommitEvent<T> = (status: ICommitStatus<T>) => ICommitReward
export const CommitEvent = <T>(commitEvent: ICommitEvent<T>): ICommitEvent<T> => commitEvent

export type ICommitment = ReturnType<typeof Commitment>
export type ICommitTemplate = {
  name: string
  events: Record<string, ICommitEvent<any>>
}

export function Commitment
  <TEvents extends Record<any, ICommitEvent<any>>>
  (name: string, events: TEvents) {
  return {
    name,
    events,
    status: <TKind extends keyof TEvents>
      (kind: TKind, data?: Parameters<TEvents[TKind]>[0]['data']): ICommitStatus<typeof data> =>
    ({
      id: ulid(),
      event: kind.toString(),
      commitment: name,
      timestamp: new Date().toISOString(),
      data
    }),

    share(status: ICommitStatus<any>) {
      this.events[status.event]!(status)
    },

    commit<TEventName extends keyof TEvents>(event: TEventName, data: Parameters<TEvents[TEventName]>[0]['data']) {
      // create status object
      let status = this.status(event, data)
      // run the action with status object as parameter
      const reward = this.events[status.event]!(status)
      return { ...status, reward } satisfies ICommitRecord<typeof data>
    }
  }
}

