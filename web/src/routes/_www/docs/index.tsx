import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_www/docs/')({
  component: Page,
})

function Page() {
  return <div>Hello &quot;/_www/docs/&quot;!</div>
}
