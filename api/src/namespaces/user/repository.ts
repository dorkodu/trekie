import { pg } from "@api/lib/pg"
import type { IUser } from "@sdk/core/account"
import { TRPCError } from "@trpc/server"
import type { z } from "zod"
import type { userSchemas } from "./schema"

export async function getUser(
) {
  // username
  // email
  // userId
}

export async function updateUser(id: string, username: string) {

}

export async function getUserIdWithGoogle(oauthId: string) {

}

export * as userRepository from "./repository"

