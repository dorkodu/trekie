import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/market/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/_app/market/&quot;!</div>
}
