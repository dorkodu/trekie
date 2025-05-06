import { Badge, Button, Card, Center, Group, Image, Text } from '@mantine/core'
import { IconCoin } from '@tabler/icons-react'
import { Item } from './types'

interface ItemCardProps {
  item: Item
  onBuy: (item: Item) => void
  userCoins: number
}

export function ItemCard({ item, onBuy, userCoins }: ItemCardProps) {
  const canBuy = userCoins >= item.price

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Center p="md" h={140} bg="gray.1">
          <Image
            src={item.image}
            height={80}
            width={80}
            alt={item.name}
            fallbackSrc="https://placehold.co/80x80?text=Item"
          />
        </Center>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} size="lg">{item.name}</Text>
        <Badge color="yellow" variant="filled">
          <Group gap="xs">
            <IconCoin size={14} />
            <Text>{item.price}</Text>
          </Group>
        </Badge>
      </Group>

      <Text size="sm" color="dimmed" mb="md">{item.description}</Text>

      {item.duration && (
        <Text size="xs" mb="xs">Duration: {item.duration}</Text>
      )}

      <Text size="xs" mb="md">Effect: {item.effect}</Text>

      <Button
        fullWidth
        color={canBuy ? "blue" : "gray"}
        onClick={() => canBuy && onBuy(item)}
        disabled={!canBuy}
      >
        {canBuy ? 'Buy' : 'Not enough coins'}
      </Button>
    </Card>
  )
}
