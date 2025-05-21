import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Group,
	NumberInput,
	Stack,
	Text,
	Textarea,
	TextInput,
	ThemeIcon,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { IUser } from "@sdk/core";
import { IconPlusMinus, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@web/lib/db";
import { trekie } from "@web/lib/trekie";
import {
	goals,
	schema as GoalSchema,
	IGoal,
	IGoalTemplate,
} from "@web/namespaces/goal";
import { IHabit } from "@web/namespaces/habit";
import { tryCatch } from "@web/utils/tryCatch";
import { ReactNode, useEffect, useState } from "react";
import { ChoiceCombobox, ChoiceOption } from "./ChoiceCombobox";

type GoalEditorMode = "CREATE" | "EDIT";

const GoalEditorModal = ({
	context,
	id,
	innerProps = { mode: "CREATE" },
}: ContextModalProps<{ mode: GoalEditorMode; goal?: IGoal }>) => {
	const [commitmentOptions, setCommitmentOptions] = useState<ChoiceOption[]>(
		[],
	);
	const user = trekie.use(($) => $.user);

	const choicesQuery = useQuery({
		queryKey: ["userCommitments"],
		queryFn: async () => {
			try {
				// Get user's commitments from trekie
				const userCommitments = await trekie.commitments.getOwnCommitments();
				// normally we would use commitment id's to fetch from their respective kinds / tables

				// Fetch all commitment entities
				const commitmentEntities: {
					habits: IHabit[];
				} = { habits: [] };

				commitmentEntities.habits = await db.habits
					.where("userId")
					.equals(user.id)
					.toArray();

				// Updated formatByKind to directly return the expected option format
				const formatByKind = <T extends { id: string; title?: string }>(
					items: T[],
					kind: string,
				): ChoiceOption[] => {
					return items.map((item) => ({
						value: item.id,
						label: item.title || `Untitled ${kind}`,
						content: (
							<Group key={item.id} wrap="nowrap" gap="xs">
								<ThemeIcon color="dark" size="sm" variant="light">
									<IconPlusMinus />
								</ThemeIcon>
								<Text size="sm">{item.title || `Untitled ${kind}`}</Text>
							</Group>
						),
					}));
				};

				// Format all commitment types
				const formattedOptions: ChoiceOption[] = [
					...formatByKind(commitmentEntities.habits, "Habit"),
					// Add other commitment types here as they become available
				];

				setCommitmentOptions(formattedOptions);
				return formattedOptions;
			} catch (error) {
				console.error("[app] Error fetching user commitments:", error);
				setCommitmentOptions([]); // Fallback to empty array
				return [];
			}
		},
	});

	const form = useForm({
		mode: "uncontrolled",
		initialValues:
			innerProps.goal ??
			({
				title: "",
				description: "",
				xpTarget: 0,
				commitments: [],
			} satisfies IGoalTemplate),

		validate: zodResolver(GoalSchema.GoalTemplate),
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
			const currentFormCommitments = form.getValues().commitments ?? [];
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

	const onCreate = async (values: typeof form.values) => {
		const { data, error } = await tryCatch(
			(async () => {
				console.log("Creating goal:", values);
				const r = await goals.create(values);
				console.log("Goal created successfully:", r);
				// After successful creation, close the modal
			})(),
		);

		context.closeModal(id);
	};

	const onUpdate = async (values: typeof form.values) => {
		if (!innerProps.goal?.id) return;

		const { data, error } = await tryCatch(
			(async () => {
				goals.update(innerProps.goal!.id, values);
			})(),
		);

		if (error) {
			console.error("Error updating goal:", error);
			// Optionally show user feedback here
			return;
		}
		context.closeModal(id);
	};

	const onDelete = async () => {
		if (!innerProps.goal?.id) return;

		const { error } = await tryCatch(
			(async () => {
				goals.delete(innerProps.goal!.id);
			})(),
		);

		if (error) {
			console.error("Error deleting goal:", error);
			// Optionally show user feedback here
			return;
		}
		context.closeModal(id);
	};

	return (
		<>
			<form
				onSubmit={form.onSubmit(
					innerProps.mode === "CREATE" ? onCreate : onUpdate,
				)}
			>
				<Stack gap="sm">
					<TextInput
						withAsterisk
						label="Title"
						placeholder="Title"
						key={form.key("title")}
						{...form.getInputProps("title")}
					/>

					<Textarea
						withAsterisk
						label="Description"
						placeholder="Description"
						key={form.key("description")}
						{...form.getInputProps("description")}
					/>

					<NumberInput
						withAsterisk
						label="XP Target"
						placeholder="0"
						key={form.key("xpTarget")}
						{...form.getInputProps("xpTarget")}
					/>

					<Box>
						<Text fw={500} mb={5}>
							Commitments
						</Text>
						<ChoiceCombobox
							options={commitmentOptions}
							value={form.values.commitments}
							onChange={(selectedIds) =>
								form.setFieldValue("commitments", selectedIds)
							}
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
		</>
	);
};

export default GoalEditorModal;
