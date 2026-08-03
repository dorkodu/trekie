import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@web/components/ui/alert'
import { Button } from '@web/components/ui/button'
import { trekie } from '@web/lib/trekie'
import { goals } from '@web/namespaces/goal'
import GoalCard from '@web/namespaces/goal/GoalCard'

export const Route = createFileRoute('/_app/goal/$goalId/')({
  component: GoalPublicPage,
})

function GoalPublicPage() {
  const { goalId } = Route.useParams()
  const user = trekie.use($ => $.user)
  const goalQuery = useQuery({ queryKey: ['goal', goalId], queryFn: () => goals.get(goalId) })

  if (goalQuery.isLoading) return <div className='p-4'>Loading...</div>
  if (!goalQuery.data) return <div className='p-4'>Goal not found.</div>
  const goal = goalQuery.data

  const isOwner = user?.id === goal.userId

  return (
    <div className='w-[90%] max-w-lg mx-auto p-2'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-2xl font-bold'>Goal</h2>
        {isOwner && (
          <Button asChild size='sm'>
            <Link to='/goal/$goalId/edit' params={{ goalId }}>Edit</Link>
          </Button>
        )}
      </div>
      <GoalCard id={goal.id} />
      {!isOwner && (
        <div className='mt-4'>
          <Alert>
            <AlertDescription>You’re viewing a friend’s goal.</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

