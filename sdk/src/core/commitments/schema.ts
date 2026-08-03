import { z } from "zod"
import { Commitment } from "./commitment"

export const CommitReward = z.strictObject({
  xp: z.number(),
  coins: z.number(),
})
export type ICommitReward = z.infer<typeof CommitReward>

export const WithData =
  <T extends z.ZodTypeAny>
    (schema: T) => z.strictObject({
      data: schema
    })

export type WithData<T> = { data: T }

export const CommitMessage = z.strictObject({
  id: z.string().ulid(),
  event: z.string(),
  kind: z.string(),
  instanceId: z.string().ulid(),
  timestamp: z.number().int(),
})

export const CommitSchema = <T extends z.ZodTypeAny>(schema: T) => CommitMessage.merge(WithData(schema))

// extending CommitSchema with reward
// we return this to the client
export const CommitResult =
  <T extends z.ZodTypeAny>(schema: T) =>
    CommitSchema(schema).merge(
      z.strictObject({
        reward: CommitReward
      }))

// extending CommitResult with userId
// we sync this to API as a verifiable record
export const CommitRecord =
  <T extends z.ZodTypeAny>(schema: T) =>
    CommitResult(schema).merge(
      z.strictObject({
        userId: z.string().ulid()
      }))

// typescript helper types for in module use only
export type ICommitMessage<T> = z.infer<typeof CommitMessage> & WithData<T>
export type ICommitResult<T> = ICommitMessage<T> & { reward: ICommitReward }
export type ICommitRecord<T> = ICommitResult<T> & { userId: string }

// the action that runs on commit & returns rewards
export type ICommitAction<T> = (message: ICommitMessage<T>) => ICommitReward

//? Commit Event

export const CommitEvent = <T>(action: ICommitAction<T>): ICommitAction<T> => action

//? Commitments Module

export type ICommitmentKind = ReturnType<typeof Commitment>
export type ICommitmentTemplate = {
  name: string
  events: Record<any, ICommitAction<any>>
}

export const CommitmentInstance = z.strictObject({
  id: z.string().ulid(),
  kind: z.string(),
  completedAt: z.number().nullable(),
  userId: z.string().ulid(),
  createdAt: z.number(),
  lastActivity: z.number(),
  isDeleted: z.boolean(),
})
export type ICommitmentInstance = z.infer<typeof CommitmentInstance>