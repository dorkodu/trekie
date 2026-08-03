import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@web/components/ui/alert'
import { trekie } from '@web/lib/trekie'
import { goals } from '@web/namespaces/goal'
import { GoalForm } from '@web/namespaces/goal/GoalForm'

export const Route = createFileRoute('/_app/goal/$goalId/edit')({
  component: GoalEditPage,
})

function GoalEditPage() {
  const { goalId } = Route.useParams()
  const navigate = useNavigate()
  const user = trekie.use($ => $.user)
  const goalQuery = useQuery({ queryKey: ['goal', goalId], queryFn: () => goals.get(goalId) })

  if (goalQuery.isLoading) return <div className='p-4'>Loading...</div>
  if (!goalQuery.data) return <div className='p-4'>Goal not found.</div>

  const goal = goalQuery.data
  const isOwner = user?.id === goal.userId

  if (!isOwner) {
    return (
      <div className='w-[90%] max-w-lg mx-auto p-2'>
        <Alert>
          <AlertDescription>You can’t edit this goal because you don’t own it.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='w-[90%] max-w-lg mx-auto p-2'>
      <h2 className="text-2xl font-bold">Edit Goal</h2>
      <p className='text-muted-foreground'>Update details and commitments.</p>

      <div className='mt-4'>
        <GoalForm
          mode='edit'
          goal={goal}
          onDelete={() => navigate({ to: '/home' })}
          onSuccess={() => navigate({ to: '/goal/$goalId', params: { goalId } })}
        />
      </div>
    </div>
  )
}
