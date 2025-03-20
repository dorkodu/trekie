import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { AccountTier } from '@sdk'
import { QueryClientProvider } from '@tanstack/react-query'
import OverlayLoader from '@web/shared/components/loaders/OverlayLoader'
import ApplicationError from '@web/shared/components/misc/ApplicationError'
import { modals } from '@web/shared/components/modals'
import { onError, onReset } from '@web/shared/lib/errors'
import { queryClient } from "@web/shared/lib/react-query"
import { trekie } from '@web/shared/lib/trekie'
import { useAppStore } from '@web/shared/stores/appStore'
import { cssVariablesResolver, theme } from '@web/styles/theme'
import { FlagsProvider } from 'flagged'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, ScrollRestoration } from 'react-router-dom'

function App() {
  const loading = useAppStore($ => $.loading)
  const premium = trekie.use($ => $.user.tier !== AccountTier.FREE)

  useEffect(() => {
    // TODO: Perform authorization logic by sending a request to the API
    if (!loading.auth) return
    // auth.login()
  }, [loading.auth])

  // trekie hooks
  trekie.useDailyRefresh()

  return (
    <ErrorBoundary FallbackComponent={ApplicationError} onError={onError} onReset={onReset}>
      <FlagsProvider features={{ beta: true, premium }}>
        <QueryClientProvider client={queryClient}>
          <ColorSchemeScript defaultColorScheme="light" />
          <MantineProvider theme={theme} defaultColorScheme="light" cssVariablesResolver={cssVariablesResolver}>
            <ModalsProvider modals={modals} modalProps={{ centered: true, radius: 'lg' }}>
              <Notifications limit={3} position="top-center" zIndex={99999} />
              {loading.auth && <OverlayLoader full={true} />}
              {!loading.auth && <Outlet />}
            </ModalsProvider>
          </MantineProvider>
          <ScrollRestoration />
        </QueryClientProvider>
      </FlagsProvider>
    </ErrorBoundary>
  )
}

export default App
