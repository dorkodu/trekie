import { IconTrash } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Box, Group, Stack } from "@web/components/ui/layout";
import { Textarea } from "@web/components/ui/textarea";
import type { ContextModalProps } from "@web/lib/modals/types";
import { IHabit, IHabitTemplate } from '@web/namespaces/habit';
import { tryCatch } from "@web/utils/tryCatch";
import { habits } from '.';

// Define the expected innerProps structure
type HabitEditorMode = 'CREATE' | 'EDIT'
interface HabitEditorModalProps {
  mode: HabitEditorMode
  habit?: IHabit // Habit object for editing, undefined for creating
}

const HabitEditorModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<HabitEditorModalProps>) => {
  const { habit, mode = 'CREATE' } = innerProps
  const isEditing = mode === 'EDIT'

  const form = useForm({
    defaultValues: {
      title: habit?.title ?? '',
      description: habit?.description ?? '',
      dailyTarget: habit?.dailyTarget ?? 1,
    } satisfies IHabitTemplate,
    onSubmit: async ({ value }) => {
      if (isEditing && habit) {
        await tryCatch(habits.update(habit.id, value));
      } else {
        await tryCatch(habits.create(value));
      }
      context.closeModal(id);
    },
  });

  const handleDelete = async () => {
    if (isEditing && habit) {
      await habits.delete(habit.id);
      context.closeModal(id);
    }
  };

  return (
    <Box>
      <form
        onSubmit={form.handleSubmit}
        className="w-full"
        autoComplete="off"
      >
        <Stack gap="sm">
          <form.Field name="title">
            {(field) => (
              <div>
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Drink 8 glasses of water"
                  type="text"
                  required
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Stay hydrated throughout the day"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="dailyTarget">
            {(field) => (
              <div>
                <Label htmlFor="dailyTarget">
                  Daily Target <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dailyTarget"
                  type="number"
                  placeholder="e.g., 8"
                  min={1}
                  required
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          {mode === 'CREATE' && (
            <Button type="submit" className="font-bold">
              CREATE
            </Button>
          )}
          {mode === 'EDIT' && (
            <Group justify="between" className="mt-4">
              <Button variant="destructive" onClick={handleDelete}>
                <IconTrash className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button type="submit" className="font-bold">
                UPDATE
              </Button>
            </Group>
          )}
        </Stack>
      </form>
    </Box>
  )
}

export default HabitEditorModal
