import { ActionIcon, Box, Button, Flex, Group, NumberInput, Stack, Text, Textarea, TextInput, ThemeIcon } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { IUser } from '@sdk/core'
import { IconPlusMinus, IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { goals, schema as GoalSchema, IGoal, IGoalTemplate } from '@web/namespaces/goal'
import { IHabit } from '@web/namespaces/habit'
import { db } from '@web/shared/lib/db'
import { trekie } from '@web/shared/lib/trekie'
import { tryCatch } from '@web/shared/utils/tryCatch'
import { ReactNode, useState } from 'react'
import { ChoiceCombobox, ChoiceOption } from './ChoiceCombobox'

type GoalEditorMode = 'CREATE' | 'EDIT'

const GoalEditorModal = ({
  context,
  id,
  innerProps = { mode: 'CREATE' },
}: ContextModalProps<{ mode: GoalEditorMode, goal?: IGoal }>) => {
  const [commitmentOptions, setCommitmentOptions] = useState<ChoiceOption[]>([])
  const user = trekie.use($ => $.user)

  const choicesQuery = useQuery({
    queryKey: ['userCommitments'],
    queryFn: async () => {
      try {
        // Get user's commitments from trekie
        const userCommitments = await trekie.commitments.getOwnCommitments()
        // normally we would use commitment id's to fetch from their respective kinds / tables 

        // Fetch all commitment entities
        const commitmentEntities: {
          habits: IHabit[],
        } = { habits: [] }

        commitmentEntities.habits = await db.habits
          .where('userId')
          .equals(user.id)
          .toArray()

        // Updated formatByKind to directly return the expected option format
        const formatByKind = <T extends { id: string; title?: string }>(
          items: T[],
          kind: string
        ): ChoiceOption[] => {
          return items.map(item => ({
            value: item.id,
            label: item.title || `Untitled ${kind}`,
            content: (
              <Group key={item.id} wrap="nowrap" gap="xs">
                <ThemeIcon color="dark" size="sm" variant="light"><IconPlusMinus /></ThemeIcon>
                <Text size="sm">
                  {item.title || `Untitled ${kind}`}
                </Text>
              </Group>
            ),
          }))
        }

        // Format all commitment types
        const formattedOptions: ChoiceOption[] = [
          ...formatByKind(commitmentEntities.habits, "Habit"),
          // Add other commitment types here as they become available
        ]

        setCommitmentOptions(formattedOptions)
        return formattedOptions
      } catch (error) {
        console.error("[app] Error fetching user commitments:", error)
        setCommitmentOptions([]) // Fallback to empty array
        return []
      }
    }
  })

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: innerProps.goal ?? {
      title: '',
      description: '',
      xpTarget: 0,
      commitments: [],
    } satisfies IGoalTemplate,

    validate: zodResolver(GoalSchema.GoalTemplate),
  })

  const onCreate = async (values: typeof form.values) => {

    const { data, error } = await tryCatch((async () => {
      console.log('Creating goal:', values)
      const r = await goals.create(values)
      console.log('Goal created successfully:', r)
      // After successful creation, close the modal
    })())

    context.closeModal(id)
  }

  const onUpdate = (values: typeof form.values) => {
    // In a real app, you would call an API to update the goal
    console.log('Updating goal:', values)
    // After successful update, close the modal
    context.closeModal(id)
  }

  const onDelete = () => {
    if (!innerProps.goal?.id) return

    // In a real app, you would call an API to delete the goal
    console.log('Deleting goal with ID:', innerProps.goal.id)
    // After successful deletion, close the modal
    context.closeModal(id)
  }

  return (
    <>
      <form onSubmit={form.onSubmit(innerProps.mode === 'CREATE' ? onCreate : onUpdate)}>
        <Stack gap="sm">
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Title"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />

          <Textarea
            withAsterisk
            label="Description"
            placeholder="Description"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />

          <NumberInput
            withAsterisk
            label="XP Target"
            placeholder="0"
            key={form.key('xpTarget')}
            {...form.getInputProps('xpTarget')}
          />

          <Box>
            <Text fw={500} mb={5}>Commitments</Text>
            <ChoiceCombobox
              options={commitmentOptions}
              value={form.values.commitments}
              onChange={(selectedIds) => form.setFieldValue('commitments', selectedIds)}
              placeholder="Select commitments to include in this goal"
            />
          </Box>

          {innerProps.mode === 'CREATE' && (
            <Button size="md" type="submit">
              CREATE
            </Button>
          )}
          {innerProps.mode === 'EDIT' && (
            <Flex gap={6}>
              <ActionIcon size="xl" color="red" variant="light" radius="lg"
                onClick={onDelete}>
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
  )
}

export default GoalEditorModal
