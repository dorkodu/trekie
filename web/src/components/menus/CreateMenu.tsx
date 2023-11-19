import { useAppStore } from "@/stores/appStore";
import { ActionIcon, Button, Flex, Image, Menu, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconPencilPlus } from "@tabler/icons-react"

interface Props {

}

function CreateMenu({ }: Props) {
  const [opened, { open, close }] = useDisclosure();

  const onHabit = () => {
    useAppStore.setState(s => { s.modals.createHabit.opened = true });
    close();
  }
  const onGoal = () => {
    useAppStore.setState(s => { s.modals.createGoal.opened = true });
    close();
  }
  const onMemory = () => {
    useAppStore.setState(s => { s.modals.createMemory.opened = true });
    close();
  }

  return (
    <Menu position="top-end" opened={opened} onOpen={open} onClose={close}>
      <Menu.Target>
        <ActionIcon radius="xl" size={48}>
          <IconPencilPlus />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Flex direction="column" gap={4}>
          <Button variant="default" onClick={onHabit} h="auto" py="md" styles={{ label: { flex: 1 } }}>
            <Flex align="center" gap="md">
              <Image src="/favicon.svg" w={32} h={32} />
              <Title order={5}>Create a habit</Title>
            </Flex>
          </Button>
          <Button variant="default" onClick={onGoal} h="auto" py="md" styles={{ label: { flex: 1 } }}>
            <Flex align="center" gap="md">
              <Image src="/favicon.svg" w={32} h={32} />
              <Title order={5}>Create a goal</Title>
            </Flex>
          </Button>
          <Button variant="default" onClick={onMemory} h="auto" py="md" styles={{ label: { flex: 1 } }}>
            <Flex align="center" gap="md">
              <Image src="/favicon.svg" w={32} h={32} />
              <Title order={5}>Create a memory</Title>
            </Flex>
          </Button>
        </Flex>
      </Menu.Dropdown>
    </Menu>
  )
}

export default CreateMenu