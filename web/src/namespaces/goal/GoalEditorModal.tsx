import { IconTrash } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import Emoji from "@web/components/misc/Emoji";
import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Box, Group, Stack } from "@web/components/ui/layout";
import { Textarea } from "@web/components/ui/textarea";
import { db } from "@web/lib/db";
import { trekie } from "@web/lib/trekie";
import { goals, IGoal, IGoalTemplate } from "@web/namespaces/goal";
import { tryCatch } from '@web/utils/tryCatch';
import { useEffect, useMemo, useState } from "react";
import { useHabits } from "../habit/habits-db";
import type { ContextModalProps } from "@web/lib/modals/types";
import { ChoiceCombobox, type ChoiceOption } from "./ChoiceCombobox";

type GoalEditorMode = "CREATE" | "EDIT";

const GoalEditorModal = ({
  context,
  id,
  innerProps = { mode: "CREATE" } as { mode: GoalEditorMode; goal?: IGoal },
}: ContextModalProps<{ mode: GoalEditorMode; goal?: IGoal }>) => {
  const userId = trekie.use($ => $.user?.id)
  const navigate = useNavigate()
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
  const [commitmentOptions] = useState<ChoiceOption[]>([]);

  // Create icon mapping for different types
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'habit':
        return <Emoji emoji="🌱" size={16} />
      case 'todo':
        return <Emoji emoji="📝" size={16} />
      case 'goal':
        return <Emoji emoji="🎯" size={16} />
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

  // TanStack React Form
  const form = useForm({
    defaultValues:
      innerProps.goal ??
      ({
        title: "",
        description: "",
        xpTarget: 0,
        commitments: [],
      } satisfies IGoalTemplate),
    onSubmit: async ({ value }) => {
      if (innerProps.mode === "CREATE") {
        await onCreate(value);
      } else {
        await onUpdate(value);
      }
    },
  });

  // Ensure commitments are set after options load in EDIT mode, but only if the IDs exist in the options
  useEffect(() => {
    if (
      innerProps.mode === "EDIT" &&
      innerProps.goal &&
      Array.isArray(innerProps.goal.commitments) &&
      finalCommitmentOptions.length > 0
    ) {
      // Only set if form's commitments is empty or different from goal's commitments
      const currentFormCommitments = form.state.values.commitments ?? [];
      // Only update if not already set (prevents overwriting user changes)
      if (
        !Array.isArray(currentFormCommitments) ||
        currentFormCommitments.length === 0
      ) {
        // Only keep IDs that exist in the loaded options
        const validCommitments = innerProps.goal.commitments.filter((cid) =>
          finalCommitmentOptions.some((opt) => opt.value === cid),
        );
        form.setFieldValue("commitments", validCommitments);
      }
    }
  }, [finalCommitmentOptions, innerProps.goal, innerProps.mode]);

  const onCreate = async (values: typeof form.state.values) => {
    await tryCatch(goals.create(values))
    context.closeModal(id)
  };

  const onUpdate = async (values: typeof form.state.values) => {
    if (!innerProps.goal?.id) return;
    const { error } = await tryCatch(goals.update(innerProps.goal!.id, values))
    if (!error) {
      context.closeModal(id)
      navigate({ to: '/goal/$goalId', params: { goalId: innerProps.goal.id } })
    }
  };

  const onDelete = async () => {
    if (!innerProps.goal?.id) return;
    const { error } = await tryCatch((async () => goals.delete(innerProps.goal!.id))())
    if (!error) context.closeModal(id)
  };

  return (
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
                placeholder="Enter goal title"
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
            <>
              <Label htmlFor="description">
                Description <span className="text-lg text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                required
                placeholder="Description"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
              )}
            </>
          )}
        </form.Field>

        <form.Field name="xpTarget">
          {(field) => (
            <div>
              <Label htmlFor="xpTarget">XP Target *</Label>
              <Input
                id="xpTarget"
                type="number"
                placeholder="0"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <Box>
          <Label className="text-sm font-medium mb-2 block">
            Link Commitments
          </Label>
          <p className="text-xs text-muted-foreground mb-3">Connect existing habits to track progress toward this goal</p>
          {(habitsQuery.isLoading || todosQuery.isLoading) ? (
            <div className="text-sm text-muted-foreground py-2">Loading your habits and todos...</div>
          ) : (
            <ChoiceCombobox
              options={finalCommitmentOptions}
              value={form.state.values.commitments}
              onChange={(selectedIds) => form.setFieldValue("commitments", selectedIds)}
              placeholder="Search and select commitments to include in your goal..."
            />
          )}
        </Box>

        {innerProps.mode === "CREATE" && (
          <Button size="default" type="submit">
            CREATE
          </Button>
        )}
        {innerProps.mode === "EDIT" && (
          <Group gap={6}>
            <Button
              size="default"
              variant="destructive"
              onClick={onDelete}
            >
              <IconTrash className="w-4 h-4" />
              Delete
            </Button>
            <Button size="default" className="flex-1" type="submit">
              UPDATE
            </Button>
          </Group>
        )}
      </Stack>
    </form>
  );
};

export default GoalEditorModal;
