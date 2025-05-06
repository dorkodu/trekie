import { IconSearch, IconTrendingUp } from '@tabler/icons-react'

function Explore() {
  return (
    <Flex direction="column" m="md">
      <TextInput
        variant="filled"
        size="md"
        radius="md"
        placeholder="Search"
        leftSection={<IconSearch />}
      />

      <Divider my="md" />

      <Group gap="xs">
        <IconTrendingUp />
        <Text fw="bold">Trending Activities</Text>
      </Group>
      <Text c="dimmed">Nothing to see, yet.</Text>
    </Flex>
  )
}

export default Explore
