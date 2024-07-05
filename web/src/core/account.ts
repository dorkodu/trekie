import { Timestamp } from "@/shared/utils"
import { z } from "zod"

export type IUser = IAccount & IProfile

export interface IProfile {
  bio?: string
  birthday?: Timestamp
  category?: string
  location?: string
  url?: string
}

export interface IAccount {
  id: string

  username: string
  name: string
  email?: string

  pictureUrl?: string

  joinedAt: Timestamp

  tier: AccountTier
}

export enum AccountTier {
  FREE = "free",
  PREMIUM = "premium",
}

export const USERNAME_REGEX = /^@(?![_.])(?!.*[_.]{2})([a-zA-Z0-9_.]{1,16})(?<![_.])$/
export const USERHANDLE_REGEX = /^@(?![_.])(?!.*[_.]{2})([a-zA-Z0-9_.]{1,16})(?<![_.])$/
export const usernameSchema = z.string().trim().regex(USERNAME_REGEX)
