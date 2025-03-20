import { pg } from "@api/lib/pg"
import { IStatus } from "@sdk/core/sync"
import { TRPCError } from "@trpc/server"
import type { z } from "zod"
import type { syncSchema } from "./schema"

export async function saveStatus(status: IStatus) {

}


export async function saveBulkStatuses(status: IStatus) {

}

export async function getStatus(status: IStatus) {

}

export async function getStatusesByUser(status: IStatus) {

}


export * as userRepository from "./repository"

