import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@web/components/ui/button'
import { Box, Stack } from '@web/components/ui/layout'
import { Skeleton } from '@web/components/ui/skeleton'
import { db } from '@web/lib/db'
import { trekie } from '@web/lib/trekie'
import NoTodosCard from '@web/namespaces/todo/NoTodosCard'
import TodoCard from '@web/namespaces/todo/TodoCard'
import { useLiveQuery } from 'dexie-react-hooks'

export const Route = createFileRoute('/_app/todos/')({
  component: TodosListPage,
})

function TodosListPage() {
  const userId = trekie.use($ => $.user?.id)

  if (!userId) return <div className='p-4'>No session.</div>

  const todos = useLiveQuery(
    async () => db.todos.where('userId').equals(userId).toArray(),
    [userId]
  )

  // Sort todos: incomplete first, then by priority and due date
  const sortedTodos = todos?.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Incomplete first
    }
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    if (a.dueDate && b.dueDate) {
      return a.dueDate - b.dueDate;
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return a.createdAt - b.createdAt;
  });

  return (
    <div className='w-[90%] max-w-lg mx-auto p-2'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-2xl font-bold'>My Todos</h2>
        <Button asChild size='sm'>
          <Link to='/todo/new'>New</Link>
        </Button>
      </div>

      {!sortedTodos ? (
        <Stack gap={2}>
          <Skeleton className='h-2 rounded-xl' />
          <Skeleton className='h-2 rounded-xl' />
          <Skeleton className='h-2 w-[70%] rounded-xl' />
        </Stack>
      ) : sortedTodos.length === 0 ? (
        <NoTodosCard />
      ) : (
        <Box>
          <Stack gap='xs'>
            {sortedTodos.map(todo => (
              <TodoCard key={todo.id} id={todo.id} />
            ))}
          </Stack>
        </Box>
      )}
    </div>
  )
}
