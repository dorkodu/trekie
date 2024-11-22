import { authRequiredProcedure, Router } from "@/lib/trpc"
import { gameService } from "./service"

export const router = Router({
  // here comes all procedures
})

export * as gameEndpoints from "./endpoints"
