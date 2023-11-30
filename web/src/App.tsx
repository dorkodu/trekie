import { MantineProvider } from '@mantine/core'
import { theme } from './styles/theme'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useAppStore } from './stores/appStore'
import OverlayLoader from './components/loaders/OverlayLoader'
import { useEffect } from 'react'
import UpdateSWModal from './components/modals/UpdateSWModal'
import { useTrekieStore } from './stores/trekieStore'
import { useRefreshStatsDaily, useRouteUpdater } from './components/hooks'

function App() {
  const loading = useAppStore(state => state.loading)

  useEffect(() => {
    // TODO: Perform authorization logic by sending a request to the API
    if (!loading.auth) return
    useTrekieStore.getState().auth(undefined)
  }, [loading.auth])

  // app hooks
  useRouteUpdater()

  // trekie hooks
  useRefreshStatsDaily()

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {loading.auth && <OverlayLoader full={true} />}
        {!loading.auth && <Outlet />}

        {/* Modals */}
        <UpdateSWModal />
      </MantineProvider>

      <ScrollRestoration />
    </>
  )
}

export default App
