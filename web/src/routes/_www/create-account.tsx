import { createFileRoute } from '@tanstack/react-router'
import { CreateAccountForm } from '@web/components/forms/create-account-form'

export const Route = createFileRoute('/_www/create-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CreateAccountForm />
      </div>
    </main>
  )
}
