import { ActionIcon, Box, Button, Checkbox, Flex, Group, Paper, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { createDb } from '@sdk/app/db'
import { IconTrash } from '@tabler/icons-react'
import { schema as GoalSchema, IGoal, IGoalTemplate } from '@web/namespaces/goal'
import { IHabit } from '@web/namespaces/habit'
import { trekie } from '@web/shared/lib/trekie'
import { useEffect, useState } from 'react'

type GoalEditorMode = 'CREATE' | 'EDIT'

interface Commitment {
  id: string
  title: string
  kind: 'Todo' | 'Habit' | 'Other' | string
}

const GoalEditorModal = ({
  context,
  id,
  innerProps = { mode: 'CREATE' },
}: ContextModalProps<{ mode: GoalEditorMode, goal?: IGoal }>) => {
  const [availableCommitments, setAvailableCommitments] = useState<Commitment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch commitments from Dexie DB
  useEffect(() => {
    async function fetchCommitments() {
      try {
        setIsLoading(true)
        // Get the current user from trekie
        const user = trekie.use($ => $.user)

        // Get user's commitments from trekie
        const userCommitments = trekie.commitments.table
          .where('userId')
          .equals(user.id)
          .toArray()

        // Fetch all commitments that match the user's commitment IDs
        const commitmentData = await db.commitments
          .where('id')
          .anyOf(userCommitments.map(c => c.id))
          .toArray()

        // Format for the component
        const formattedCommitments: Commitment[] = commitmentData.map(commitment => ({
          id: commitment.id,
          title: commitment.title || `Unnamed ${commitment.kind}`,
          kind: commitment.kind
        }))

        setAvailableCommitments(formattedCommitments)
      } catch (error) {
        console.error("Error fetching commitments:", error)
        // Fallback to empty array
        setAvailableCommitments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommitments()
  }, [])

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

  const handleCreateGoal = (values: typeof form.values) => {
    // In a real app, you would call an API to create the goal
    console.log('Creating goal:', values)
    // After successful creation, close the modal
    context.closeModal(id)
  }

  const handleUpdateGoal = (values: typeof form.values) => {
    // In a real app, you would call an API to update the goal
    console.log('Updating goal:', values)
    // After successful update, close the modal
    context.closeModal(id)
  }

  const handleDeleteGoal = () => {
    if (!innerProps.goal?.id) return

    // In a real app, you would call an API to delete the goal
    console.log('Deleting goal with ID:', innerProps.goal.id)
    // After successful deletion, close the modal
    context.closeModal(id)
  }

  const isCommitmentSelected = (commitmentId: string) => {
    return form.values.commitments.includes(commitmentId)
  }

  const toggleCommitment = (commitmentId: string) => {
    const currentCommitments = [...form.values.commitments]
    const index = currentCommitments.indexOf(commitmentId)

    if (index === -1) {
      // Add commitment
      form.setFieldValue('commitments', [...currentCommitments, commitmentId])
    } else {
      // Remove commitment
      currentCommitments.splice(index, 1)
      form.setFieldValue('commitments', currentCommitments)
    }
  }

  return (
    <>
      <form onSubmit={form.onSubmit(innerProps.mode === 'CREATE' ? handleCreateGoal : handleUpdateGoal)}>
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

          <TextInput
            withAsterisk
            label="XP Target"
            type="number"
            placeholder="0"
            key={form.key('xpTarget')}
            {...form.getInputProps('xpTarget')}
          />

          <Box>
            <Text fw={500} mb={5}>Commitments</Text>
            <Paper p="sm" withBorder>
              <Stack gap="xs">
                {isLoading ? (
                  <Text size="sm" c="dimmed">Loading commitments...</Text>
                ) : availableCommitments.length === 0 ? (
                  <Text size="sm" c="dimmed">No commitments found</Text>
                ) : (
                  availableCommitments.map(commitment => (
                    <Checkbox
                      key={commitment.id}
                      label={`${commitment.title} - ${commitment.kind}`}
                      checked={isCommitmentSelected(commitment.id)}
                      onChange={() => toggleCommitment(commitment.id)}
                    />
                  ))
                )}
              </Stack>
            </Paper>
          </Box>

          {innerProps.mode === 'CREATE' && (
            <Button size="md" type="submit">
              CREATE
            </Button>
          )}
          {innerProps.mode === 'EDIT' && (
            <Flex gap={6}>
              <ActionIcon size="xl" color="red" variant="light" radius="lg"
                onClick={handleDeleteGoal}>
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
