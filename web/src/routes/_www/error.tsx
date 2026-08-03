import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_www/error')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/_www/error&quot;!</div>
}
