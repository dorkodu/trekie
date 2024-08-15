import React, { Suspense } from 'react'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, useParams } from 'react-router-dom'

import App from '@/App'
import { USERHANDLE_REGEX, USERNAME_REGEX } from '@/core'
import CenterLoader from '@/shared/components/loaders/CenterLoader'
import { utils } from '@/shared/utils'

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
) {
  return (
    <Suspense fallback={<CenterLoader />}>
      <Component />
    </Suspense>
  )
}

export function PathMiddleware() {
  let params = useParams()
  let path = useParams().path ?? ""

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
