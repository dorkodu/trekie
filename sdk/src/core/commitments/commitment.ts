import { ulid } from "ulidx"
import type { ICommitmentInstance, ICommitmentTemplate, ICommitMessage, ICommitResult } from "./schema"

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

    commit(
      event: TKind,
      instanceId: string,
      data: Parameters<TEvents[TKind]>[0]['data']
    ): ICommitResult<typeof data> {
      // create status object
      let status = this.status(event, instanceId, data)
      // run the action with status object as parameter
      let reward = events[event]!(status)

      return { ...status, reward }
    },

    create({ userId }: { userId: string }): ICommitmentInstance {
      return {
        id: ulid(),
        kind: name,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        userId,
        completedAt: null,
        isDeleted: false
      }
    }
  }
}
