import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'

import { theme } from '#/styles/theme'

import OverlayLoader from '#/components/loaders/OverlayLoader'
import UpdateSWModal from '#/components/modals/UpdateSWModal'
import { useRefreshStatsDaily } from '#/components/hooks'

import { useAppStore } from '#/stores/appStore'
import { useDorkoduStore } from './stores/dorkoduStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query'
import { Notifications } from '@mantine/notifications'

function App() {

  const loading = useAppStore(state => state.loading)

  useEffect(() => {
    // TODO: Perform authorization logic by sending a request to the API
    if (!loading.auth) return
    useDorkoduStore.getState().auth(undefined)
  }, [loading.auth])

  // app hooks

  // trekie hooks
  useRefreshStatsDaily()

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications />
        {loading.auth && <OverlayLoader full={true} />}
        {!loading.auth && <Outlet />}

        {/* Modals */}
        <UpdateSWModal />
      </MantineProvider>

      <ScrollRestoration />
    </QueryClientProvider>
  )
}

export default App
