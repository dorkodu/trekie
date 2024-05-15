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

export * as Story from "./story"