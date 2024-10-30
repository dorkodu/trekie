import { Timestamp } from "@/shared/utils"
import { ulid } from "ulid"
import { z } from "zod"

export type IAccount = z.infer<typeof IAccount>
export type IProfile = z.infer<typeof IProfile>
export type IUser = IAccount & IProfile

const IProfile = z.object({
  bio: z.string().trim().max(500),
  birthDate: z.number(),
  category: z
  location: string
  url?: string
  
  description: z.string().trim().min(1).max(500),
})

const IAccount = z.object({
  id: z.string().ulid(),
  username: z.string().trim().regex(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9_.]{1,16}(?<![_.])$/),
  name: z.string().trim().min(1).max(64),
  email: z.string().trim().email().max(320),

  pictureUrl: z.string().trim().url(),

  joinedAt: z.number(),

  tier: z.enum({
    FREE: 0,
    PREMIUM: 1,
    BUSINESS: 2,
    SUPERFAN: 3,
  }),
})

export const IUser = IAccount.merge(IProfile)

export enum AccountTier {
  FREE = 0,
  PREMIUM = 1,
  BUSINESS = 2,
  SUPERFAN = 3,
}

export function createUser(input: {
  username: string
  name: string
  email: string
  pictureUrl: string
  tier: AccountTier
  category: string
  location: string
  url: string
  birthday: number
}): IUser {
  return {
    id: ulid(),
    username: 'dorukeray',
    name: 'Doruk Eray',
    bio: `✦ Founder & Chief @dorkodu
    ✦ Polymath • Software Craftsman • Designer
    ✦ Boğaziçi Uni. • Vefa Lisesi
    ✦ ENFJ • ♓ • 3w2 • E/Acc • Techno-optimist`,
    email: 'doruk@dorkodu.com',
    pictureUrl: '/images/doruk--green.png',
    tier: 'PREMIUM',
    category: "Entrepreneur",
    location: "Istanbul, TR",
    url: "https://doruk.dorkodu.com",
    joinedAt: new Date("19/02/2024 10:50").getTime(),
    birthday: new Date("03/08/2004 09:45 AM").getTime(),
  }
}


export const USERNAME_REGEX = /^(?![_.])(?!.*[_.]{2})([a-zA-Z0-9_.]{1,16})(?<![_.])$/
export const USERHANDLE_REGEX = /^@(?![_.])(?!.*[_.]{2})([a-zA-Z0-9_.]{1,16})(?<![_.])$/

export const schema = {
  Account: IAccount,
  Profile: IProfile,
  User: IUser,

  password: z.string().min(8),

  username: z.string().trim().regex(USERNAME_REGEX),

  birthDate: z.string() // Birth date must be a valid string in "YYYY-MM-DD" format.
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "Date must be in YYYY-MM-DD format.",
    })
    .transform((date) => new Date(`${date}T00:00:00Z`)); // Convert to UTC date
}