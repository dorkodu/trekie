/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */

import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom'
import CenterLoader from '#/components/loaders/CenterLoader'
import { util } from '#/lib/util'
import App from './App'

import Auth from '#/components/util/AuthRoute'

function view(path: string) {
  const [folder, file] = path.split(':')

  return suspenseLoader(
    React.lazy(util.wait(() => import(`./views/${folder}/${file}.tsx`)))
  )
}

function layout(path: string) {
  return suspenseLoader(
    React.lazy(util.wait(() => import(`./layouts/${path}.tsx`)))
  )
}

function suspenseLoader(
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) {
  return (
    <Suspense fallback={<CenterLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Navigate to "/home" on path "/" */}
      <Route index element={<Navigate to="/home" />} />

      {/* <Route element={<Auth.Require />}> */}
      <Route element={layout('AppLayout')}>
        <Route path="/home" element={view('app:Home')} />
        <Route path="/explore" element={view('app:Explore')} />

        <Route path="/profile/:username" element={view('app:Profile')} />
        <Route path="/premium" element={view('app:Premium')} />
        <Route path="/archive" element={view('app:Archive')} />
        <Route path="/settings/*" element={view('app:Settings')} />
      </Route>

      <Route path="/about" element={view('website:About')} />

      <Route element={<Auth.Prevent />}>
        <Route path="/welcome" element={view('website:Welcome')} />
      </Route>

      {/* User Flow */}
      <Route path="/join" element={view('flow:CreateAccount')} />
      <Route path="/connect" element={view('flow:Connect')} />
      <Route path="/login" element={view('flow:Login')} />

      {/* Website & Custom Pages */}
      <Route path="/about" element={view('website:About')} />
      <Route path="/legal/:document" element={view('website:Legal')} />

      {/* Error routes & catch all */}
      <Route path="/404" element={view('website:NotFound')} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Route>
  )
)
