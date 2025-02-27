import { pg } from "@api/lib/pg" // paul graham tweet generator lol lmao xd
import type { ISession } from "@api/types/session"
import { createHash } from "crypto"
import type { Response } from "express"
import { ulid } from "ulidx"
import { tokenUtil } from "./token-util"

export async function createSession(userId: string) {
  const token = tokenUtil.create()

  const session: ISession = {
    id: ulid(),
    userId,
    createdAt: Date.now().toString(),
    expiresAt: (Date.now() + 1000 * 60 * 60 * 24 * 30).toString(),
    selector: token.selector,
    validator: createHash("sha256").update(token.validator).digest(),
  }

  const result = await pg`INSERT INTO sessions ${pg(session)}`
  if (!result.count) return undefined

  return { token: token.full, expiresAt: session.expiresAt }
}

export async function expireSession(
  userId: string,
  sessionId: string,
  res: Response | undefined
) {
  const result = await pg`
    UPDATE sessions
    SET expires_at=${Date.now()}
    WHERE id=${sessionId} AND user_id=${userId}
  `
  if (!result.count) return false

  if (res) tokenUtil.clearSession(res)

  return true
}

export * as authService from "./service"
