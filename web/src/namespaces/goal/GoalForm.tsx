import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@web/components/ui/button'
import { Input } from '@web/components/ui/input'
import { Label } from '@web/components/ui/label'
import { Group, Stack } from '@web/components/ui/layout'
import { Textarea } from '@web/components/ui/textarea'
import { IGoal, goals } from '@web/namespaces/goal'
import { tryCatch } from '@web/utils/tryCatch'
import { useEffect } from 'react'
import { z } from 'zod'
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
    if (mode === 'edit' && goal && commitmentOptions.length > 0) {
      form.setFieldValue('commitments', goal.commitments.filter(id => commitmentOptions.some(o => o.value === id)))
    }
  }, [mode, goal, commitmentOptions])

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
              <Input id='goal-xp' type='number' value={field.state.value as any} onChange={e => field.handleChange(Number(e.target.value))} required />
              {field.state.meta.errors?.[0] && <p className='text-xs text-red-500 mt-1'>{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>
        <form.Field name='commitments'>
          {field => (
            <div>
              <Label>Commitments</Label>
              <ChoiceCombobox options={commitmentOptions} value={field.state.value || []} onChange={(ids) => field.handleChange(ids)} placeholder='Select commitments' />
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
            }}>Delete</Button>
          )}
          <Button type='submit' className='flex-1'>{mode === 'create' ? 'Create Goal' : 'Save Changes'}</Button>
        </Group>
      </Stack>
    </form>
  )
}

export default GoalForm
