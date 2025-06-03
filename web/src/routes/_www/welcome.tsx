import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_www/welcome')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_www/welcome"!</div>
}
