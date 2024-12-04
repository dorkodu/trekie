import type { AppRouter } from "@api/router"
import { httpBatchLink } from "@trpc/client"
import { createTRPCClient, createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api/trpc" })],
})
