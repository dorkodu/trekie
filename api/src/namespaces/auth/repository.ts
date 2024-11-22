import { pg } from "@/lib/pg"
import { tokenUtil } from "./token-util"

export async function getSessionByToken(
  token: string
): Promise<{ id: string; userId: string } | undefined> {
  const parsed = tokenUtil.parse(token)
  if (!parsed) return undefined

  const [result]: [{ id: Buffer; userId: Buffer; validator: Buffer }?] =
    await pg`
      SELECT id, user_id, validator FROM sessions s
      WHERE s.selector=${parsed.selector} AND s.expires_at > ${Date.now()}
    `
  if (!result) return undefined
  if (!tokenUtil.check(parsed.validator, result.validator)) return undefined

  return {
    id: result.id.toString("utf8"),
    userId: result.userId.toString("utf8"),
  }
}

export * as authRepository from "./repository"

