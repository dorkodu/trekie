import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/life')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/life"!</div>
}
