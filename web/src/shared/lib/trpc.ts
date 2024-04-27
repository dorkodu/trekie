import { createTRPCReact } from '@trpc/react-query'

/**
 * We only import the `AppRouter` type from the server - this is not available at runtime
 */
import type { AppRouter } from '@api/router'

// Initialize the tRPC client
export const trpc = createTRPCReact<AppRouter>();