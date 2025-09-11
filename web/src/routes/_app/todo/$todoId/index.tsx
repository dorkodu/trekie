import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@web/components/ui/alert'
import { Button } from '@web/components/ui/button'
import { trekie } from '@web/lib/trekie'
import { todos } from '@web/namespaces/todo'
import TodoCard from '@web/namespaces/todo/TodoCard'

export const Route = createFileRoute('/_app/todo/$todoId/')({
  component: TodoDetailPage,
})

function TodoDetailPage() {
  const { todoId } = Route.useParams()
  const user = trekie.use($ => $.user)
  const todoQuery = useQuery({ queryKey: ['todo', todoId], queryFn: () => todos.get(todoId) })

  if (todoQuery.isLoading) return <div className='p-4'>Loading...</div>
  if (!todoQuery.data) return <div className='p-4'>Todo not found.</div>
  const todo = todoQuery.data

  const isOwner = user?.id === todo.userId

  return (
    <div className='w-[90%] max-w-lg mx-auto p-2'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-2xl font-bold'>Todo</h2>
        {isOwner && (
          <Button asChild size='sm'>
            <Link to='/todo/$todoId/edit' params={{ todoId }}>Edit</Link>
          </Button>
        )}
      </div>
      <TodoCard id={todo.id} />
      {!isOwner && (
        <div className='mt-4'>
          <Alert>
            <AlertDescription>You’re viewing a friend’s todo.</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
