import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/premium')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/_app/premium&quot;!</div>
}
