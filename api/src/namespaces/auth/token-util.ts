import { config } from "@api/config"
import { createHash, randomBytes } from "crypto"
import type { Request, Response } from "express"

const sessionCookie = "sess"

export function create() {
  const selector = randomBytes(16)
  const validator = randomBytes(16)

  // prettier-ignore
  const full = `${selector.toString("base64url")}:${validator.toString("base64url")}`

  return { selector, validator, full }
}

export function parse(token: string) {
  const split = token.split(":")
  if (!split[0] || !split[1]) return undefined

  const selector = Buffer.from(split[0], "base64url")
  const validator = Buffer.from(split[1], "base64url")

  return { selector, validator }
}

export function check(rawValidator: Buffer, hashedValidator: Buffer) {
  return (
    createHash("sha256")
      .update(rawValidator)
      .digest()
      .compare(hashedValidator) === 0
  )
}

export function getSession(req: Request): string | undefined {
  return req.cookies[sessionCookie]
}

export function setSession(res: Response, token: string, expiresAt: string) {
  res.cookie(sessionCookie, token, {
    secure: config.dev ? false : true,
    httpOnly: true,
    sameSite: true,
    expires: new Date(Number(expiresAt)),
  })
}

export function clearSession(res: Response) {
  res.clearCookie(sessionCookie)
}

export * as tokenUtil from "./token-util"
