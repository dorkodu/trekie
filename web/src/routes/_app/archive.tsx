import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/archive')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/archive"!</div>
}
