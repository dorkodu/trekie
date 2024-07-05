import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { httpBatchLink } from '@trpc/client'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from "react-error-boundary"
import { Outlet, ScrollRestoration } from 'react-router-dom'

import { theme } from '@/styles/theme'

import OverlayLoader from '@/shared/components/loaders/OverlayLoader'
import UpdateSWModal from '@/shared/components/modals/UpdateSWModal'

import { useRefreshStatsDaily } from '@/core/hooks'

import ApplicationError from '@/shared/components/misc/ApplicationError'
import { onError, onReset } from '@/shared/lib/errors'
import { trpc } from '@/shared/lib/trpc'
import { useAppStore } from '@/shared/stores/appStore'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {

  const loading = useAppStore(state => state.loading)

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
            }
          },
        }),
      ],
    }),
  )

  useEffect(() => {
    // TODO: Perform authorization logic by sending a request to the API
    if (!loading.auth) return
    // auth.login()
  }, [loading.auth])

  // app hooks

  // trekie hooks
  // useRefreshStatsDaily()

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
            <Notifications limit={3} position="top-center" zIndex={99999} />
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
