import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_www/get-started')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<main>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Get Started</h1>
      <p className="text-lg text-gray-700">This is the get started page.</p>
    </div>
  </main>)
}