import { pg } from "@/lib/pg"
import type { IGoogleAccount } from "@/types/account"
import { TRPCError } from "@trpc/server"
import { IUser } from "@web/core/account"
import { ulid } from "ulidx"

export async function createUserWithGoogle(
  username: string,
  oauthId: string,
  email: string
) {
  try {
    const result = await pg.begin(async (pg) => {
      const user: IUser = {
        id: ulid(),
        joinedAt: Date.now(),
        username,

      }

      const result0 = await pg`INSERT INTO users ${pg(user)}`
      if (!result0.count)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })

      const googleAccount: IGoogleAccount = {
        id: ulid(),
        userId: user.id,
        oauthId,
        email,
        connectedAt: Date.now().toString(),
      }

      const result1 = await pg`
        INSERT INTO oauth_google_accounts ${pg(googleAccount)}
      `
      if (!result1.count)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })

      return user
    })

    return result
  } catch (_error) {
    return undefined
  }
}

export * as userService from "./service"

