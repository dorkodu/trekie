import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@web/components/ui/button'
import { Box, Stack } from '@web/components/ui/layout'
import { Skeleton } from '@web/components/ui/skeleton'
import { db } from '@web/lib/db'
import { trekie } from '@web/lib/trekie'
import GoalCard from '@web/namespaces/goal/GoalCard'
import NoGoalsCard from '@web/namespaces/goal/NoGoalsCard'
import { useLiveQuery } from 'dexie-react-hooks'

export const Route = createFileRoute('/_app/goals/')({
  component: GoalsListPage,
})

function GoalsListPage() {
  const userId = trekie.use($ => $.user?.id)

  if (!userId) return <div className='p-4'>No session.</div>

  const goals = useLiveQuery(
    async () => db.goals.where('userId').equals(userId).toArray(),
    [userId]
  )

  return (
    <div className='w-[90%] max-w-lg mx-auto p-2'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-2xl font-bold'>My Goals</h2>
        <Button asChild size='sm'>
          <Link to='/goals/new'>New</Link>
        </Button>
      </div>

      {!goals ? (
        <Stack gap={2}>
          <Skeleton className='h-2 rounded-xl' />
          <Skeleton className='h-2 rounded-xl' />
          <Skeleton className='h-2 w-[70%] rounded-xl' />
        </Stack>
      ) : goals.length === 0 ? (
        <NoGoalsCard />
      ) : (
        <Box>
          <Stack gap='xs'>
            {goals.map(g => (
              <GoalCard key={g.id} id={g.id} />
            ))}
          </Stack>
        </Box>
      )}
    </div>
  )
}

