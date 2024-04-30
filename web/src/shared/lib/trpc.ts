import { createTRPCReact } from '@trpc/react-query'

import type { AppRouter } from '@api/router'

// Initialize the tRPC client
export const trpc = createTRPCReact<AppRouter>();