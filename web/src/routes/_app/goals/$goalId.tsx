import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web/components/ui/card'
import { Progress } from '@web/components/ui/progress'
import { trekie } from '@web/lib/trekie'
import { goals } from '@web/namespaces/goal'
import { GoalForm } from '@web/namespaces/goal/GoalForm'

export const Route = createFileRoute('/_app/goals/$goalId')({
  component: GoalDetailRoute,
})

function GoalDetailRoute() {
  const { goalId } = Route.useParams()
  const user = trekie.use($ => $.user)
  const goalQuery = useQuery({ queryKey: ['goal', goalId], queryFn: () => goals.get(goalId) })
  const progressQuery = useQuery({ queryKey: ['goal-progress', goalId], queryFn: () => goals.calculateProgress(goalId), enabled: !!goalQuery.data })

  if (goalQuery.isLoading) return <div className='p-4'>Loading goal...</div>
  if (!goalQuery.data) return <div className='p-4'>Goal not found.</div>
  const goal = goalQuery.data
  const percent = progressQuery.data?.percent ?? 0
  const xp = progressQuery.data?.xp ?? 0

  return (
    <div className='max-w-2xl mx-auto p-4 space-y-6'>
      <Card>
        <CardHeader className='space-y-2'>
          <CardTitle>{goal.title}</CardTitle>
          <CardDescription>{goal.description}</CardDescription>
          <div className='flex items-center gap-3 pt-2'>
            <div className='flex-1'>
              <Progress value={percent} />
            </div>
            <span className='text-xs font-medium'>{percent}% ({xp}/{goal.xpTarget} xp)</span>
          </div>
        </CardHeader>
      </Card>
      {user?.id === goal.userId && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Goal</CardTitle>
            <CardDescription>Update goal properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <GoalForm mode='edit' goal={goal} onDelete={() => window.location.href = '/home'} onSuccess={() => { /* refetch handled by query invalidation */ }} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
