import { pg } from "@api/lib/pg"
import { TRPCError } from "@trpc/server"
import { IGoal } from '@web/namespaces/goal'
import type { z } from "zod"
import type { goalSchemas } from "./schema"

export async function getGoal(
  id: string | undefined,
): Promise<IGoal | undefined> {
  if (!id) throw new TRPCError({ code: "BAD_REQUEST" })

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
    SELECT g.id,
    FROM goals g
    WHERE 
    ${id ? pg`u.id = ${id}` : pg``}
  `

  return result.map((r) => ({ ...r, id: r.id.toString("utf8") }))[0]
}

export async function createGoal(
  goal: IGoal
) {
  const result = await pg`
    INSERT INTO goals ()
    VALUES (${goal.title}, )
  `
}

export async function updateGoal(id: string, username: string) {
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

