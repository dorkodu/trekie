import { IHabit } from '@/core/commons/habit'
import {
  ActionIcon,
  Button,
  Checkbox,
  Flex,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { useForm, zodResolver } from '@mantine/form'
import { IGoal, schema as GoalSchema, IGoalTemplate } from '@/core/commons/goal'
import { IconTrash } from '@tabler/icons-react'

type GoalEditorMode = 'CREATE' | 'EDIT'

const GoalEditorModal = ({
  context,
  id,
  innerProps = { mode: 'CREATE' },
}: ContextModalProps<{ mode: GoalEditorMode, goal?: IGoal }>) => {

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: innerProps.goal ?? {
      title: '',
      description: '',
      xpTarget: 0,
    } satisfies IGoalTemplate,

    validate: zodResolver(GoalSchema.IGoalTemplate),
  })

  return (
    <>
      <form>
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

          {innerProps.mode === 'CREATE' && (
            <Button size="md"
              onClick={() => { form.onSubmit(values => console.log(values)) }}>
              CREATE
            </Button>
          )}
          {innerProps.mode === 'EDIT' && (
            <Flex gap={6}>
              <ActionIcon size="xl" color="red" variant="light" radius="lg"
                onClick={() => { }}>
                <IconTrash />
              </ActionIcon>
              <Button size="md" style={{ flexGrow: 1 }}
                onClick={() => { }}>
                UPDATE
              </Button>
            </Flex>
          )}
        </Stack>
      </form >
    </>
  )
}

export default GoalEditorModal
