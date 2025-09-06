import { IconTrash } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Box, Group, Stack } from "@web/components/ui/layout";
import { Textarea } from "@web/components/ui/textarea";
import { goals, IGoal, IGoalTemplate } from "@web/namespaces/goal";
import { tryCatch } from '@web/utils/tryCatch';
import { useEffect, useState } from "react";
import { ChoiceCombobox, type ChoiceOption } from "./ChoiceCombobox";

type GoalEditorMode = "CREATE" | "EDIT";

type GoalEditorModalProps = {
  context: any;
  id: string;
  innerProps: { mode: GoalEditorMode; goal?: IGoal };
};

const GoalEditorModal = ({
  context,
  id,
  innerProps = { mode: "CREATE" },
}: GoalEditorModalProps) => {
  const [commitmentOptions] = useState<ChoiceOption[]>([]);

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
      commitmentOptions.length > 0
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
          commitmentOptions.some((opt) => opt.value === cid),
        );
        form.setFieldValue("commitments", validCommitments);
      }
    }
  }, [commitmentOptions, innerProps.goal, innerProps.mode]);

  const onCreate = async (values: typeof form.state.values) => {
    await tryCatch(goals.create(values))
    context.closeModal(id)
  };

  const onUpdate = async (values: typeof form.state.values) => {
    if (!innerProps.goal?.id) return;
    const { error } = await tryCatch(goals.update(innerProps.goal!.id, values))
    if (!error) context.closeModal(id)
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
            Commitments
          </Label>
          <ChoiceCombobox
            options={commitmentOptions}
            value={form.state.values.commitments}
            onChange={(selectedIds) => form.setFieldValue("commitments", selectedIds)}
            placeholder="Select commitments to include in this goal"
          />
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
