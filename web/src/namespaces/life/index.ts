import { IUser } from "@sdk/core/index"

export interface ILife {
  id: string
  ownerId: string
  user?: IUser
  stories: IStory[]
}

export interface IStory {
  id: string
  kind: IStoryKind
  userId: string
  date: Date

  text: string
  mediaURL: string

  likes: number
  likedByMe?: boolean
}

export enum IStoryKind {
  Photo,
  Text,
  Mixed,
}
