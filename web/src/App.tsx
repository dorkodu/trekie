import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { httpBatchLink } from '@trpc/client'
import { FlagsProvider } from 'flagged'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import { cssVariablesResolver, theme } from '@/styles/theme'

import OverlayLoader from '@/shared/components/loaders/OverlayLoader'

import ApplicationError from '@/shared/components/misc/ApplicationError'
import { onError, onReset } from '@/shared/lib/errors'
import { trpc } from '@/shared/lib/trpc'
import { useAppStore } from '@/shared/stores/appStore'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { modals } from './shared/components/modals'

function App() {
  const loading = useAppStore($ => $.loading)
  const premium = true // useAppStore($ => $.accountTier === 'PREMIUM')

  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: 'wishyouwerehere',
            }
          },
        }),
      ],
    })
  )

  useEffect(() => {
    // TODO: Perform authorization logic by sending a request to the API
    if (!loading.auth) return
    // auth.login()
  }, [loading.auth])

  // trekie hooks
  //  trekie.useRefreshStatsDaily()

  return (
    <ErrorBoundary FallbackComponent={ApplicationError} onError={onError} onReset={onReset}>
      <FlagsProvider features={{ beta: true, premium }}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ColorSchemeScript defaultColorScheme="light" />
            <MantineProvider theme={theme} defaultColorScheme="light" cssVariablesResolver={cssVariablesResolver}>
              <ModalsProvider
                modals={modals}
                modalProps={{ centered: true, radius: 'lg' }}
              >
                <Notifications limit={3} position="top-center" zIndex={99999} />
                {loading.auth && <OverlayLoader full={true} />}
                {!loading.auth && <Outlet />}
              </ModalsProvider>
            </MantineProvider>
            <ScrollRestoration />
          </QueryClientProvider>
        </trpc.Provider>
      </FlagsProvider>
    </ErrorBoundary>
  )
}

export default App
