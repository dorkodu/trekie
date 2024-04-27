import { createTRPCClient, httpBatchLink } from '@trpc/client'

/**
 * We only import the `AppRouter` type from the server - this is not available at runtime
 */
import type { AppRouter } from '@api/router'

// Initialize the tRPC client
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3131',
    }),
  ],
})