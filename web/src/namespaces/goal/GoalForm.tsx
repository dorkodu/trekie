import { IconCheckbox, IconPlusMinus, IconTarget, IconTrash } from '@tabler/icons-react'
import { useForm } from '@tanstack/react-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Emoji from '@web/components/misc/Emoji'
import { Button } from '@web/components/ui/button'
import { Input } from '@web/components/ui/input'
import { Label } from '@web/components/ui/label'
import { Group, Stack } from '@web/components/ui/layout'
import { Textarea } from '@web/components/ui/textarea'
import { db } from '@web/lib/db'
import { trekie } from '@web/lib/trekie'
import { IGoal, goals } from '@web/namespaces/goal'
import { tryCatch } from '@web/utils/tryCatch'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useHabits } from '../habit/habits-db'
import { ChoiceCombobox, type ChoiceOption } from './ChoiceCombobox'

// Validation schema (client-side)
const GoalTemplateSchema = z.object({
  title: z.string().min(1, 'Title required').max(100),
  description: z.string().min(1, 'Description required').max(500),
  xpTarget: z.number().min(1, 'XP Target must be > 0'),
  commitments: z.array(z.string()).default([])
})

export interface GoalFormProps {
  mode: 'create' | 'edit'
  goal?: IGoal
  onSuccess?: (goal: IGoal) => void
  onDelete?: (goal: IGoal) => void
  commitmentOptions?: ChoiceOption[]
}

export function GoalForm({ mode, goal, onSuccess, onDelete, commitmentOptions = [] }: GoalFormProps) {
  const qc = useQueryClient()
  const userId = trekie.use($ => $.user?.id)

  // Fetch habits for commitment options
  const habitsQuery = useHabits(userId)

  // Fetch todos for commitment options
  const todosQuery = useQuery({
    queryKey: ['todos', userId],
    queryFn: async () => {
      if (userId) {
        return db.todos.where('userId').equals(userId).toArray()
      }
      return []
    },
    enabled: !!userId,
  })

  // Create icon mapping for different types
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'habit':
        return <IconPlusMinus className="w-4 h-4" />
      case 'todo':
        return <IconCheckbox className="w-4 h-4" />
      case 'goal':
        return <IconTarget className="w-4 h-4" />
      default:
        return <Emoji emoji="📌" size={16} />
    }
  }

  const defaultCommitmentOptions = useMemo(() => {
    const options: ChoiceOption[] = []

    // Add habits
    if (habitsQuery.data) {
      habitsQuery.data.forEach(habit => {
        options.push({
          value: `habit-${habit.id}`,
          label: habit.title,
          content: (
            <div className="flex items-center gap-2 w-full">
              {getItemIcon('habit')}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate">
                  {habit.title}
                </span>
                {habit.description && (
                  <span className="text-xs text-muted-foreground truncate">
                    {habit.description}
                  </span>
                )}
              </div>
            </div>
          )
        })
      })
    }

    // Add todos
    if (todosQuery.data) {
      todosQuery.data
        .filter(todo => !todo.completed) // Only show incomplete todos
        .forEach(todo => {
          options.push({
            value: `todo-${todo.id}`,
            label: todo.title,
            content: (
              <div className="flex items-center gap-2 w-full">
                {getItemIcon('todo')}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium truncate">
                    {todo.title}
                  </span>
                  {todo.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      {todo.description}
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className="text-xs text-orange-600">
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        })
    }

    // Sort by creation date (most recent first) - for now just return as is
    return options
  }, [habitsQuery.data, todosQuery.data])

  const finalCommitmentOptions = commitmentOptions.length > 0 ? commitmentOptions : defaultCommitmentOptions

  const form = useForm({
    defaultValues: goal ?? { title: '', description: '', xpTarget: 0, commitments: [] },

    async onSubmit({ value }) {

      const parsed = GoalTemplateSchema.safeParse({
        title: value.title,
        description: value.description,
        xpTarget: Number(value.xpTarget),
        commitments: Array.isArray(value.commitments) ? value.commitments : []
      })

      if (!parsed.success) return

      if (mode === 'create') {
        const { data, error } = await tryCatch(goals.create(parsed.data))
        if (!error && data) {
          qc.invalidateQueries({ queryKey: ['goals'] })
          onSuccess?.(data)
        }
      } else if (mode === 'edit' && goal) {
        const { error } = await tryCatch(goals.update(goal.id, parsed.data))
        if (!error) {
          qc.invalidateQueries({ queryKey: ['goal', goal.id] })
          qc.invalidateQueries({ queryKey: ['goal-progress', goal.id] })
          onSuccess?.({ ...goal, ...parsed.data })
        }
      }
    },
  })

  useEffect(() => {
    if (mode === 'edit' && goal && finalCommitmentOptions.length > 0) {
      form.setFieldValue('commitments', goal.commitments.filter(id => finalCommitmentOptions.some(o => o.value === id)))
    }
  }, [mode, goal, finalCommitmentOptions])

  return (
    <form onSubmit={form.handleSubmit} className='space-y-4'>
      <Stack gap={3}>
        <form.Field name='title'>
          {field => (
            <div>
              <Label htmlFor='goal-title'>Title *</Label>
              <Input id='goal-title' value={field.state.value || ''} onChange={e => field.handleChange(e.target.value)} required />
              {field.state.meta.errors?.[0] && <p className='text-xs text-red-500 mt-1'>{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>
        <form.Field name='description'>
          {field => (
            <div>
              <Label htmlFor='goal-description'>Description *</Label>
              <Textarea id='goal-description' value={field.state.value || ''} onChange={e => field.handleChange(e.target.value)} required />
              {field.state.meta.errors?.[0] && <p className='text-xs text-red-500 mt-1'>{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>
        <form.Field name='xpTarget'>
          {field => (
            <div>
              <Label htmlFor='goal-xp'>XP Target *</Label>
              <Input id='goal-xp' type='number' value={field.state.value as number} onChange={e => field.handleChange(Number(e.target.value))} required />
              {field.state.meta.errors?.[0] && <p className='text-xs text-red-500 mt-1'>{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>
        <form.Field name='commitments'>
          {field => (
            <div>
              <Label>Link Commitments</Label>
              <p className="text-xs text-muted-foreground mb-2">Connect existing habits to track progress toward this goal</p>
              {(habitsQuery.isLoading || todosQuery.isLoading) ? (
                <div className="text-sm text-muted-foreground py-2">Loading your habits and todos...</div>
              ) : (
                <ChoiceCombobox options={finalCommitmentOptions} value={field.state.value || []} onChange={(ids) => field.handleChange(ids)} placeholder='Search and select commitments to include in your goal...' />
              )}
            </div>
          )}
        </form.Field>
        <Group gap={3} className='pt-2'>
          {mode === 'edit' && goal && (
            <Button type='button' variant='destructive' onClick={async () => {
              const { error } = await tryCatch(goals.delete(goal.id))
              if (!error) {
                qc.invalidateQueries({ queryKey: ['goals'] })
                onDelete?.(goal)
              }
            }}>
              <IconTrash className="w-4 h-4" />
            </Button>
          )}
          <Button type='submit' className='flex-1'>{mode === 'create' ? 'Create Goal' : 'Save Changes'}</Button>
        </Group>
      </Stack>
    </form>
  )
}

export default GoalForm
