import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@web/components/ui/button'
import { Group } from '@web/components/ui/layout'
import { trekie } from '@web/lib/trekie'
import TodoForm from '@web/namespaces/todo/TodoForm'

export const Route = createFileRoute('/_app/todo/new')({
  component: NewTodoPage,
})

function NewTodoPage() {
  const navigate = useNavigate()
  const userId = trekie.use($ => $.user?.id)

  if (!userId) {
    return <div className='p-4'>No session.</div>
  }

  return (
    <div className='w-[90%] max-w-lg mx-auto p-4'>
      <div>
        <div>
          <h2>Create New Todo</h2>
          <p>Let's add something to your list!</p>
        </div>
        <div>
          <TodoForm
            mode="create"
            onSuccess={(todo) => {
              navigate({ to: '/todo/$todoId', params: { todoId: todo.id } })
            }}
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
