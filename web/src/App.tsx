import { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { ErrorBoundary } from "react-error-boundary"
import { httpBatchLink } from '@trpc/client'

import { theme } from '@/styles/theme'

import OverlayLoader from '@/shared/components/loaders/OverlayLoader'
import UpdateSWModal from '@/shared/components/modals/UpdateSWModal'
import { useRefreshStatsDaily } from '@/shared/hooks'

import { useAppStore } from '@/shared/stores/appStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Notifications } from '@mantine/notifications'
import { onError, onReset } from './shared/lib/errors'
import { trpc } from './shared/lib/trpc'
import ApplicationError from './shared/components/misc/ApplicationError'
import { db } from './shared/lib/db'

function App() {

  const loading = useAppStore($ => $.loading)

  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: "aaaa-bbbb-cccc-dddd"
            };
          },
        }),
      ],
    }),
  );

  useEffect(() => {
    // TODO: Perform authorization logic by sending a request to the API
    if (!loading.auth) return
    // useAppStore.getState().auth.login()
  }, [loading.auth])

  // app hooks

  // trekie hooks
  useRefreshStatsDaily()

  return (
    <ErrorBoundary
      FallbackComponent={ApplicationError}
      onError={onError}
      onReset={onReset}
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ColorSchemeScript defaultColorScheme="light" />
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications />
            {loading.auth && <OverlayLoader full={true} />}
            {!loading.auth && <Outlet />}

            {/* Modals */}
            <UpdateSWModal />
          </MantineProvider>

          <ScrollRestoration />
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  )
}

export default App
