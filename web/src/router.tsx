import App from '@web/App'
import React, { Suspense } from 'react'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, useParams } from 'react-router-dom'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={view('flow:Error')}>
      <Route index element={<Navigate to="/home" />} />

      {/* Requires login, navigate to website for read-only public pages */}
      <Route element={layout('App')}>
        <Route path="/home" element={view('app:Home')} />
        <Route path="/explore" element={view('app:Explore')} />
        <Route path="/life" element={view('app:Life')} />
        <Route path="/market" element={view('app:Market')} />
        <Route path="/me" element={view('app:Me')} />
        <Route path="/social" element={view('app:Social')} />
        <Route path="/super" element={view('app:Premium')} />
        <Route path="/premium" element={view('app:Premium')} />
        <Route path="/archive" element={view('app:Archive')} />
        <Route path="/settings/*" element={view('app:Settings')} />
        <Route path="/help/*" element={view('app:Help')} />

        {/* trekie.io/@doruk */}
        <Route path="/:path" element={<PathMiddleware />} />
      </Route>

      {/* User Flow */}
      <Route path="/join" element={view('flow:CreateAccount')} />
      <Route path="/connect" element={view('flow:Connect')} />
      <Route path="/login" element={view('flow:Login')} />
      <Route path="/error" element={view('flow:Error')} />

      {/* Website & Landing Page */}
      <Route element={layout('Website')}>
        <Route path="/" element={view('website:Welcome')} />
        <Route path="/welcome" element={view('website:Welcome')} />
        <Route path="/about" element={view('website:About')} />
        <Route path="/legal/:document" element={view('website:Legal')} />
        <Route path="/legal" element={view('website:Legal')} />
        <Route path="/404" element={view('website:NotFound')} />
      </Route>

      {/* Error routes & catch all */}
      <Route path="*" element={view('website:NotFound')} />
    </Route>
  )
)

//? ROUTING UTILS

export function PathMiddleware() {
  let path = useParams().path ?? ""

  let isProfile = path.startsWith('@') // intended to be a user handle

  if (!isProfile) return <Navigate to="/404" />
  return view('app:Profile')
}

// ----------------------------------------------

import CenterLoader from '@web/shared/components/loaders/CenterLoader'
import { utils } from '@web/shared/utils'

export function view(path: string) {
  const [folder, file] = path.split(':')
  return suspenseLoader(
    React.lazy(utils.wait(() => import(`./views/${folder}/${file}.tsx`)))
  )
}

export function layout(path: string) {
  return suspenseLoader(
    React.lazy(utils.wait(() => import(`./layouts/${path}.tsx`)))
  )
}

export function suspenseLoader(
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) { return <Suspense fallback={<CenterLoader />}><Component /></Suspense> }
