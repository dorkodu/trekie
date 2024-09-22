
interface ICommitStatus<T = {}> {
  id: string
  event: string
  commitment: string
  timestamp: string
  data: T
}

export type ICommitEvent<T> = (status: ICommitStatus<T>) => void
export const CommitEvent = <T>(kind: ICommitEvent<T>): ICommitEvent<T> => kind

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
      (kind: TKind, data: Parameters<TEvents[TKind]>[0]['data']):
      ICommitStatus<typeof data> =>
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
      this.events[status.event]!(status)
      return status
    }
  }
}

