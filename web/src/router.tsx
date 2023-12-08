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
    <Route path="/" element={<App />} errorElement={view('flow:Error')}>
      {/* Navigate to "/home" on path "/" */}
      <Route index element={<Navigate to="/home" />} />

      {/* <Route element={<Auth.Require />}> */}
      <Route element={layout('AppLayout')}>
        <Route path="/home" element={view('app:Home')} />
        <Route path="/explore" element={view('app:Explore')} />
        <Route path="/life" element={view('app:Life')} />
        <Route path="/market" element={view('app:Market')} />
        <Route path="/me" element={view('app:Me')} />
        <Route path="/social" element={view('app:Social')} />
        <Route path="/commmunity/:name" element={view('app:CommunityPage')} />

        {/* trekie.io/@doruk */}
        <Route path="/@:username" element={view('app:Profile')} />

        <Route path="/super" element={view('app:Premium')} />
        <Route path="/premium" element={view('app:Premium')} />
        <Route path="/archive" element={view('app:Archive')} />
        <Route path="/settings/*" element={view('app:Settings')} />
      </Route>

      {/* User Flow */}
      <Route path="/join" element={view('flow:CreateAccount')} />
      <Route path="/connect" element={view('flow:Connect')} />
      <Route path="/login" element={view('flow:Login')} />
      <Route path="/error" element={view('flow:Error')} />

      <Route element={layout('WebsiteLayout')}>
        {/* Website & Custom Pages */}
        <Route path="/welcome" element={view('website:Welcome')} />
        <Route path="/about" element={view('website:About')} />

        <Route path="/legal/:document" element={view('website:Legal')} />

        <Route path="/404" element={view('website:NotFound')} />
      </Route>

      {/* Error routes & catch all */}
      <Route path="*" element={view('website:NotFound')} />
    </Route>
  )
)

const RT = createBrowserRouter([{}])
