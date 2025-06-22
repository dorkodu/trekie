import { IconTrash } from "@tabler/icons-react";
import { FieldApi, useForm } from "@tanstack/react-form";

import { Input } from "@web/components/ui/input";
import { Stack } from "@web/components/ui/layout";
import { trekie } from "@web/lib/trekie";
import {
  goals,
  schema as GoalSchema,
  IGoal,
  IGoalTemplate,
} from "@web/namespaces/goal";
import { tryCatch } from "@web/utils/tryCatch";
import { useEffect, useState } from "react";
import { ChoiceCombobox, type ChoiceOption } from "./ChoiceCombobox";

// Zod schema for validation
const GoalTemplateSchema = GoalSchema.GoalTemplate;

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
  const [commitmentOptions, setCommitmentOptions] = useState<ChoiceOption[]>([]);
  const user = trekie.use(($) => $.user);


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
    validate: async (values) => {
      try {
        GoalTemplateSchema.parse(values);
        return {};
      } catch (err: any) {
        return err.formErrors?.fieldErrors || {};
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
    await tryCatch(async () => {
      await goals.create(values);
    });
    context.closeModal(id);
  };

  const onUpdate = async (values: typeof form.state.values) => {
    if (!innerProps.goal?.id) return;
    const { error } = await tryCatch(async () => {
      await goals.update(innerProps.goal!.id, values);
    });
    if (error) return;
    context.closeModal(id);
  };

  const onDelete = async () => {
    if (!innerProps.goal?.id) return;
    const { error } = await tryCatch(async () => {
      await goals.delete(innerProps.goal!.id);
    });
    if (error) return;
    context.closeModal(id);
  };

  return (
    <form
      onSubmit={form.handleSubmit}
      className="w-full"
      autoComplete="off"
    >
      <Stack gap="sm">
        <form.Field name="title">
          {(field: FieldApi<any, string>) => (
            <Input
              withAsterisk
              label="Title"
              placeholder="Title"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="description">
          {(field: FieldApi<any, string>) => (
            <Textarea
              withAsterisk
              label="Description"
              placeholder="Description"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <form.Field name="xpTarget">
          {(field: FieldApi<any, number>) => (
            <NumberInput
              withAsterisk
              label="XP Target"
              placeholder="0"
              value={field.state.value}
              onChange={(v) => field.handleChange(Number(v))}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <Box>
          <Text fw={500} mb={5}>
            Commitments
          </Text>
          <ChoiceCombobox
            options={commitmentOptions}
            value={form.state.values.commitments}
            onChange={(selectedIds) => form.setFieldValue("commitments", selectedIds)}
            placeholder="Select commitments to include in this goal"
          />
        </Box>

        {innerProps.mode === "CREATE" && (
          <Button size="md" type="submit">
            CREATE
          </Button>
        )}
        {innerProps.mode === "EDIT" && (
          <Flex gap={6}>
            <ActionIcon
              size="xl"
              color="red"
              variant="light"
              radius="lg"
              onClick={onDelete}
            >
              <IconTrash />
            </ActionIcon>
            <Button size="md" style={{ flexGrow: 1 }} type="submit">
              UPDATE
            </Button>
          </Flex>
        )}
      </Stack>
    </form>
  );
};

export default GoalEditorModal;
