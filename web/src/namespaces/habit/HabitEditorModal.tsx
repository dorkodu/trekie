import {
  Box,
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { IHabit, IHabitTemplate } from '@web/namespaces/habit' // Import schema and Zod validation
import { habits } from '.' // Assuming habits library is exported from index

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

  const form = useForm<Omit<IHabitTemplate, 'description'> & { description?: string }>({
    mode: 'uncontrolled',
    initialValues: {
      title: habit?.title ?? '',
      description: habit?.description ?? '',
      dailyTarget: habit?.dailyTarget ?? 1,
    },
    validate: zodResolver(IHabitTemplate), // Use Zod schema for validation
  })

  const handleSubmit = async (values: typeof form.values) => {
    const template: IHabitTemplate = {
      title: values.title,
      description: values.description || '', // Ensure description is string
      dailyTarget: values.dailyTarget,
    }
    if (isEditing && habit) {
      await habits.update(habit.id, template)
    } else {
      try {
        const h = await habits.create(template)
        console.log('Habit created successfully:', h)
      } catch (error) {
        console.error('Error creating habit:', error)
      }
    }
    context.closeModal(id)
  }

  const handleDelete = async () => {
    if (isEditing && habit) {
      // Optional: Add confirmation dialog here
      await habits.delete(habit.id)
      context.closeModal(id)
    }
  }

  return (
    <Box> {/* Wrap form in a Box or Fragment */}
      {/* Removed the <Text size="sm">{innerProps.modalBody}</Text> as modalBody is not in props */}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="e.g., Drink 8 glasses of water"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Description (Optional)"
            placeholder="e.g., Stay hydrated throughout the day"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />

          <NumberInput
            withAsterisk
            label="Daily Target"
            placeholder="e.g., 8"
            min={1}
            key={form.key('dailyTarget')}
            {...form.getInputProps('dailyTarget')}
          />

          {mode === 'CREATE' && (
            <Button type="submit" fw={700}>
              CREATE
            </Button>
          )}
          {mode === 'EDIT' && (
            <Group justify="space-between" mt="md">
              <Button variant="outline" color="red" onClick={handleDelete}>
                Delete
              </Button>
              <Button type="submit" fw={700}>
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
