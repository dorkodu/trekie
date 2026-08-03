import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@web/components/ui/button'
import { Input } from '@web/components/ui/input'
import { Label } from '@web/components/ui/label'
import { Stack } from '@web/components/ui/layout'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@web/components/ui/select'
import { Textarea } from '@web/components/ui/textarea'
import { notifications } from '@web/lib/notifications'
import { ITodo, todos } from '@web/namespaces/todo'
import { tryCatch } from '@web/utils/tryCatch'
import React from 'react'
import { z } from 'zod'

// Validation schema (client-side)
const TodoTemplateSchema = z.object({
  title: z.string().min(1, 'Title required').max(100),
  description: z.string().optional(),
  dueDate: z.number().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  tags: z.array(z.string()).optional(),
})

export interface TodoFormProps {
  mode: 'create' | 'edit'
  todo?: ITodo
  onSuccess?: (todo: ITodo) => void
  onDelete?: (todo: ITodo) => void
}

export function TodoForm({ mode, todo, onSuccess, onDelete }: TodoFormProps) {
  const qc = useQueryClient()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const form = useForm({
    defaultValues: todo ?? {
      title: '',
      description: '',
      dueDate: undefined,
      priority: 'medium' as const,
      tags: []
    },

    async onSubmit({ value }) {
      setIsSubmitting(true)
      const parsed = TodoTemplateSchema.safeParse({
        title: value.title,
        description: value.description || undefined,
        dueDate: value.dueDate ? new Date(value.dueDate).getTime() : undefined,
        priority: value.priority,
        tags: value.tags || [],
      })

      if (!parsed.success) {
        notifications.error("Validation Error", "Please check your input and try again.");
        setIsSubmitting(false)
        return;
      }

      try {
        if (mode === 'create') {
          const { data, error } = await tryCatch(todos.create(parsed.data))
          if (error) {
            notifications.error("Failed to Create Todo", error.message || "An unexpected error occurred.");
            setIsSubmitting(false)
            return;
          }
          if (data) {
            qc.invalidateQueries({ queryKey: ['todos'] })
            notifications.success("Todo created successfully!");
            onSuccess?.(data)
          }
        } else if (mode === 'edit' && todo) {
          const { error } = await tryCatch(todos.update(todo.id, parsed.data))
          if (error) {
            notifications.error("Failed to Update Todo", error.message || "An unexpected error occurred.");
            setIsSubmitting(false)
            return;
          }
          qc.invalidateQueries({ queryKey: ['todo', todo.id] })
          notifications.success("Todo updated successfully!");
          onSuccess?.({ ...todo, ...parsed.data })
        }
      } catch (err) {
        notifications.error("Unexpected Error", "Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <form onSubmit={form.handleSubmit} className='space-y-4'>
      <Stack gap={3}>
        <form.Field name='title'>
          {field => (
            <div>
              <Label htmlFor='todo-title'>Title *</Label>
              <Input
                id='todo-title'
                value={field.state.value || ''}
                onChange={e => field.handleChange(e.target.value)}
                required
                placeholder="What needs to be done?"
              />
              {field.state.meta.errors?.[0] && <p className='text-xs text-red-500 mt-1'>{field.state.meta.errors[0]}</p>}
            </div>
          )}
        </form.Field>

        <form.Field name='description'>
          {field => (
            <div>
              <Label htmlFor='todo-description'>Description</Label>
              <Textarea
                id='todo-description'
                value={field.state.value || ''}
                onChange={e => field.handleChange(e.target.value)}
                placeholder="Additional details..."
                rows={3}
              />
            </div>
          )}
        </form.Field>

        <form.Field name='priority'>
          {field => (
            <div>
              <Label htmlFor='todo-priority'>Priority</Label>
              <Select value={field.state.value} onValueChange={(value) => field.handleChange(value as "low" | "medium" | "high")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field name='dueDate'>
          {field => (
            <div>
              <Label htmlFor='todo-due-date'>Due Date</Label>
              <Input
                id='todo-due-date'
                type='datetime-local'
                value={field.state.value ? new Date(field.state.value).toISOString().slice(0, 16) : ''}
                onChange={e => field.handleChange(e.target.value ? new Date(e.target.value).getTime() : undefined)}
              />
            </div>
          )}
        </form.Field>

        <div className='flex gap-3 pt-2'>
          {mode === 'edit' && todo && (
            <Button
              type='button'
              variant='destructive'
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true)
                try {
                  const { error } = await tryCatch(todos.delete(todo.id))
                  if (error) {
                    notifications.error("Failed to Delete Todo", error.message || "An unexpected error occurred.");
                    setIsDeleting(false)
                    return;
                  }
                  qc.invalidateQueries({ queryKey: ['todos'] })
                  notifications.success("Todo deleted successfully!");
                  onDelete?.(todo)
                } catch (err) {
                  notifications.error("Unexpected Error", "Something went wrong. Please try again.");
                } finally {
                  setIsDeleting(false)
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          <Button type='submit' className='flex-1' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Todo' : 'Save Changes')}
          </Button>
        </div>
      </Stack>
    </form>
  )
}

export default TodoForm
