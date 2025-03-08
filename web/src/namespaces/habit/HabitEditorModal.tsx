import {
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { IHabit } from '@web/namespaces/habit'

interface Props {
  opened: boolean
  onClose: () => void

  habit: IHabit | undefined

  onCreate: (front: string, back: string) => void
  onUpdate: (id: string, front: string, back: string) => void
  onDelete: (id: string) => void
}

const HabitEditorModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ modalBody: string }>) => {

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  })

  return (<>
    <Text size="sm">{innerProps.modalBody}</Text>
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack>
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Title"
          key={form.key('title')}
          {...form.getInputProps('title')}
        />

        <Group justify="center" mt="md">
          <Button type="submit" w="100%" size="md" fw={700}>CREATE</Button>
        </Group>
      </Stack>
    </form>
  </>)
}

export default HabitEditorModal
