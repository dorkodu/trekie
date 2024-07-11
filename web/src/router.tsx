import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  useParams,
} from 'react-router-dom'
import CenterLoader from '@/shared/components/loaders/CenterLoader'
import { utils } from '@/shared/utils'
import App from './App'
import { USERHANDLE_REGEX, USERNAME_REGEX } from './core'

function view(path: string) {
  const [folder, file] = path.split(':')

  return suspenseLoader(
    React.lazy(utils.wait(() => import(`./views/${folder}/${file}.tsx`)))
  )
}

function layout(path: string) {
  return suspenseLoader(
    React.lazy(utils.wait(() => import(`./layouts/${path}.tsx`)))
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

let isLoggedIn: boolean = true

function PathMiddleware() {
  let params = useParams()
  let path = params.path ?? ""

  let isProfile = false
  let username = null

  const match = path.match(USERHANDLE_REGEX)

  if (match) {
    isProfile = true
    username = match[1]
  } else {
    isProfile = false
    username = null
  }

  if (!isProfile) return <Navigate to="/404" />
  return view('app:Profile')
}

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

        {/* trekie.io/@doruk */}
        <Route path="/:path" element={<PathMiddleware />} />

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