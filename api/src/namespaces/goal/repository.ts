import { pg } from "@api/lib/pg"
import { TRPCError } from "@trpc/server"
import { IGoal } from '@web/namespaces/goal'
import type { z } from "zod"
import type { goalSchemas } from "./schema"

export async function getGoal(
  id: string,
) {

}

export async function createGoal(
  goal: IGoal
) { }

export async function updateGoal(id: string, username: string) {

}

export async function getUserIdWithGoogle(oauthId: string) {

}

export * as userRepository from "./repository"

