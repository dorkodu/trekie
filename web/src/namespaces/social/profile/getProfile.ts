import { IUser } from "@/core"
import { db } from "@/shared/lib/db"
import { Maybe } from "@/shared/utils"

export async function getAccount(username: string): Promise<Maybe<IUser>> {
  // 1) ask db 2) if not found, ask server 3) if not found, return null
  /**
   * 1) ask local db
   * - if exists, return it & trigger a server fetch for updates
   * 2) ask server
   * 3) error (not found)
   */

  return await db.users.where('username').equals(username).first()
}


export async function getProfile(username: string): Promise<Maybe<IUser>> {
  // 1) ask db 2) if not found, ask server 3) if not found, return null
  /**
   * 1) ask local db
   * - if exists, return it & trigger a server fetch for updates
   * 2) ask server
   * 3) error (not found)
   */

  return await db.users.where('username').equals(username).first()
}
