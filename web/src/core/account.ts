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
  FREE = "FREE",
  PREMIUM = "PREMIUM",
  DEVELOPER = "DEVELOPER",
  ADMIN = "ADMIN",
}

const username = z.string().trim().regex(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9_.]{1,16}(?<![_.])$/)
const email = z.string().trim().email().max(320)
const password = z.string().min(8)
const name = z.string().trim().min(1).max(64)

export const USERNAME_REGEX = /^(?![_.])(?!.*[_.]{2})([a-zA-Z0-9_.]{1,16})(?<![_.])$/
export const USERHANDLE_REGEX = /^@(?![_.])(?!.*[_.]{2})([a-zA-Z0-9_.]{1,16})(?<![_.])$/
export const usernameSchema = z.string().trim().regex(USERNAME_REGEX)
