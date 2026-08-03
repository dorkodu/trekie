import { IconPlus } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Textarea } from "@web/components/ui/textarea";
import { IHabit, IHabitTemplate } from "@web/namespaces/habit";
import { habits } from "@web/namespaces/habit/library";

interface HabitFormProps {
  habit?: IHabit;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function HabitForm({ habit, onSuccess, onCancel }: HabitFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!habit;

  const createMutation = useMutation({
    mutationFn: (data: IHabitTemplate) => habits.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      onSuccess?.();
      if (!isEditing) {
        navigate({ to: "/home" });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IHabitTemplate }) =>
      habits.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', habit?.id] });
      onSuccess?.();
      if (isEditing) {
        navigate({ to: "/home" });
      }
    },
  });

  const form = useForm({
    defaultValues: {
      title: habit?.title ?? '',
      description: habit?.description ?? '',
      dailyTarget: habit?.dailyTarget ?? 1,
    } satisfies IHabitTemplate,
    onSubmit: async ({ value }) => {
      try {
        if (isEditing && habit) {
          await updateMutation.mutateAsync({ id: habit.id, data: value });
        } else {
          await createMutation.mutateAsync(value);
        }
      } catch (error) {
        console.error('Failed to save habit:', error);
      }
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Habit Title <span className="text-destructive">*</span>
          </Label>
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                value.length < 1 ? 'Title is required' : undefined,
            }}>
            {(field) => (
              <div>
                <Input
                  id="title"
                  placeholder="e.g., Drink 8 glasses of water"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <form.Field
            name="description">
            {(field) => (
              <Textarea
                id="description"
                placeholder="e.g., Stay hydrated throughout the day"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full min-h-[80px] resize-none"
                disabled={isSubmitting}
              />
            )}
          </form.Field>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dailyTarget" className="text-sm font-medium">
            Daily Target <span className="text-destructive">*</span>
          </Label>
          <form.Field
            name="dailyTarget"
            validators={{
              onChange: ({ value }) =>
                value < 1 ? 'Daily target must be at least 1' : undefined,
            }}>
            {(field) => (
              <div>
                <Input
                  id="dailyTarget"
                  type="number"
                  placeholder="e.g., 8"
                  min={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !form.state.canSubmit}
            className="flex-1"
          >
            {isSubmitting ? (
              "Saving..."
            ) : isEditing ? (
              "Update Habit"
            ) : (
              <>
                <IconPlus className="w-4 h-4 mr-2" />
                Create Habit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default HabitForm;