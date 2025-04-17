import { ActionIcon, Button, Flex, Grid, Group, Modal, Paper, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCoin, IconInfoCircle } from '@tabler/icons-react'
import { trekie } from '@web/shared/lib/trekie'
import { useState } from 'react'

import { InventoryDisplay } from '@web/namespaces/market/InventoryDisplay'
import { ItemCard } from '@web/namespaces/market/ItemCard'
import { useMarketStore } from '@web/namespaces/market/store'
import { Item } from '@web/namespaces/market/types'

function Page() {
  // Get coins directly from trekie user context
  const coins = trekie.use($ => $.coins) || 0

  // Get other state from market store
  const items = useMarketStore($ => $.items)
  const addPowerUp = useMarketStore($ => $.addPowerUp)

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [opened, { open, close }] = useDisclosure(false)

  const handleBuyItem = (item: Item) => {
    setSelectedItem(item)
    open()
  }

  const confirmPurchase = async () => {
    if (!selectedItem) return

    if (coins < selectedItem.price) {
      notifications.show({
        title: 'Purchase Failed',
        message: 'Not enough coins',
        color: 'red'
      })
      close()
      return
    }

    try {
      // Update user coins in trekie
      await updateUser({ coins: coins - selectedItem.price })

      // Add power-up to inventory in store
      addPowerUp(selectedItem.id)

      notifications.show({
        title: 'Purchase Successful',
        message: `You bought ${selectedItem.name}!`,
        color: 'green'
      })
    } catch (error) {
      notifications.show({
        title: 'Purchase Failed',
        message: 'An error occurred',
        color: 'red'
      })
    }

    close()
  }

  return (
    <Flex direction="column" m="md">
      {/* User coins display */}
      <Paper withBorder p="md" mb="md">
        <Group justify="space-between">
          <Title order={2}>Market</Title>
          <Group>
            <Group gap="xs">
              <IconCoin size={24} color="#FFD700" />
              <Text size="xl" fw={700}>{coins}</Text>
            </Group>
            <ActionIcon variant="subtle" color="gray">
              <IconInfoCircle size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>

      {/* Inventory display */}
      <InventoryDisplay />

      {/* Market items */}
      <Grid>
        {items.map(item => (
          <Grid.Col key={item.id}>
            <ItemCard
              item={item}
              onBuy={handleBuyItem}
              userCoins={coins}
            />
          </Grid.Col>
        ))}
      </Grid>

      {/* Purchase confirmation modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Purchase"
        centered
      >
        {selectedItem && (
          <Flex direction="column" gap="md">
            <Text>Are you sure you want to buy {selectedItem.name} for {selectedItem.price} coins?</Text>
            <Text size="sm">{selectedItem.description}</Text>
            <Group justify="right" mt="md">
              <Button variant="outline" onClick={close}>Cancel</Button>
              <Button onClick={confirmPurchase}>Buy Now</Button>
            </Group>
          </Flex>
        )}
      </Modal>
    </Flex>
  )
}

export default Page
