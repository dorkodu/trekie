import { IHabit } from '@/core/commons/habit'
import {
  Button,
  Checkbox,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { IGoal } from '@/core/commons/goal'

type GoalEditorMode = "CREATE" | "EDIT";

const GoalEditorModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ mode: GoalEditorMode }>) => {

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (<>
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
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

        {innerProps.mode === "CREATE" && <Button type="submit" size="md">CREATE</Button>}
        {innerProps.mode === "EDIT" && <Stack>
          <Button type="submit" onClick={() => { }} size="md" color="red" variant="light">DELETE</Button>
          <Button type="submit" size="md" color="blue">UPDATE</Button>
        </Stack>}

      </Stack>
    </form>
  </>)
}

export default GoalEditorModal
