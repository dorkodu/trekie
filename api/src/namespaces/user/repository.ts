import { pg } from "@/lib/pg"
import type { IUser } from "@trekie/web/src/core/user"
import { TRPCError } from "@trpc/server"
import type { z } from "zod"
import type { userSchemas } from "./schema"

export async function getUser(
  id: string | undefined,
  props: z.infer<typeof userSchemas.getUser>
): Promise<IUser | undefined> {
  if (!id && !props.username) throw new TRPCError({ code: "BAD_REQUEST" })

  const result = await pg<
    Array<{
      id: Buffer
      joinedAt: string
      username: string
      streaks: number
      lastStreakAt: string
      premium: boolean
    }>
  >`
    SELECT u.id, u.joined_at, u.username, u.streaks, u.last_streak_at, u.premium
    FROM users u
    WHERE
      ${props.username ? pg`LOWER(u.username) = LOWER(${props.username})` : pg``
    }
      ${id && !props.username ? pg`u.id = ${id}` : pg``}
  `

  return result.map((r) => ({ ...r, id: r.id.toString("utf8") }))[0]
}

export async function updateUser(id: string, username: string) {
  // TODO: Improve "username already in use"
  try {
    const result = await pg`
      UPDATE users SET username=${username} WHERE id=${id}
    `
    return !!result.count
  } catch (error) {
    if (error instanceof pg.PostgresError) {
      if (error.code === "23505")
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Username is already in use.",
        })
    }

    return false
  }
}

export async function getUserIdWithGoogle(oauthId: string) {
  const [result]: [{ userId: Buffer }?] = await pg`
    SELECT user_id FROM oauth_google_accounts
    WHERE oauth_id=${oauthId}
  `
  if (!result) return undefined

  return result.userId.toString("utf8")
}

export * as userRepository from "./repository"

