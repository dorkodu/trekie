import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@web/components/ui/button'
import { Group } from '@web/components/ui/layout'
import { trekie } from '@web/lib/trekie'
import GoalForm from '@web/namespaces/goal/GoalForm'

export const Route = createFileRoute('/_app/goal/new')({
  component: NewGoalPage,
})

function NewGoalPage() {
  const navigate = useNavigate()
  const userId = trekie.use($ => $.user?.id)

  if (!userId) {
    return <div className='p-4'>No session.</div>
  }

  return (
    <div className='w-[90%] max-w-lg mx-auto p-4'>
      <div>
        <div>
          <h2>Create New Goal</h2>
          <p>Time to set your sights high!</p>
        </div>
        <div>
          <GoalForm
            mode="create"
            onSuccess={(goal) => {
              navigate({ to: '/goal/$goalId', params: { goalId: goal.id } })
            }}
            commitmentOptions={[]} // TODO: Add commitment options from existing habits
          />
          <Group className='pt-4'>
            <Button
              variant='outline'
              onClick={() => navigate({ to: '/home' })}
              className='flex-1'
            >
              Cancel
            </Button>
          </Group>
        </div>
      </div>
    </div>
  )
}
