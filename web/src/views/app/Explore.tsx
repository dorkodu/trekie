import WIPCard from '@/shared/components/cards/WIPCard'
import { Divider, Flex, Group, Space, Text, TextInput, Title } from '@mantine/core'
import { IconSearch, IconSocial, IconTrendingUp, IconTrendingUp2, IconTrendingUp3, IconUsers, IconUsersGroup } from '@tabler/icons-react'

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
