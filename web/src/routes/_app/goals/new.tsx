import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web/components/ui/card'
import { trekie } from '@web/lib/trekie'
import { GoalForm } from '@web/namespaces/goal/GoalForm'

export const Route = createFileRoute('/_app/goals/new')({
  component: NewGoalRoute,
})

function NewGoalRoute() {
  const navigate = useNavigate()
  const user = trekie.use($ => $.user)
  if (!user) return <div className='p-4'>No session.</div>

  return (
    <div className='max-w-xl mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Create Goal</CardTitle>
          <CardDescription>Define a new goal and link commitments.</CardDescription>
        </CardHeader>
        <CardContent>
          <GoalForm mode='create' onSuccess={(g) => navigate({ to: '/goals/$goalId', params: { goalId: g.id } })} />
        </CardContent>
      </Card>
    </div>
  )
}
