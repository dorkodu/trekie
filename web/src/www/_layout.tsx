import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/www/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/www/_layout"!</div>
}
