import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@web/components/ui/alert'
import { trekie } from '@web/lib/trekie'
import { todos } from '@web/namespaces/todo'
import TodoForm from '@web/namespaces/todo/TodoForm'

export const Route = createFileRoute('/_app/todo/$todoId/edit')({
  component: TodoEditPage,
})

function TodoEditPage() {
  const { todoId } = Route.useParams()
  const navigate = useNavigate()
  const user = trekie.use($ => $.user)
  const todoQuery = useQuery({ queryKey: ['todo', todoId], queryFn: () => todos.get(todoId) })

  if (todoQuery.isLoading) return <div className='p-4'>Loading...</div>
  if (!todoQuery.data) return <div className='p-4'>Todo not found.</div>

  const todo = todoQuery.data
  const isOwner = user?.id === todo.userId

  if (!isOwner) {
    return (
      <div className='w-[90%] max-w-lg mx-auto p-2'>
        <Alert>
          <AlertDescription>You can’t edit this todo because you don’t own it.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='w-[90%] max-w-lg mx-auto p-2'>
      <h2 className="text-2xl font-bold">Edit Todo</h2>
      <p className='text-muted-foreground'>Update your todo details.</p>

      <div className='mt-4'>
        <TodoForm
          mode='edit'
          todo={todo}
          onDelete={() => navigate({ to: '/home' })}
          onSuccess={() => navigate({ to: '/todo/$todoId', params: { todoId } })}
        />
      </div>
    </div>
  )
}
