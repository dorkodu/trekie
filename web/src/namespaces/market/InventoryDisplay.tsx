import { Badge, Flex, Group, Image, Paper, Text, Title } from "../../components/ui/shadcn-clones";
import { items as marketItems } from "./data";
import { useMarketStore } from "./store";

export function InventoryDisplay() {
  const getPowerUpQuantity = useMarketStore((state) => state.getPowerUpQuantity);

  // Prepare display data
  const ownedPowerUps = marketItems
    .filter((item) => getPowerUpQuantity(item.id) > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      count: getPowerUpQuantity(item.id),
    }));

  return (
    <Paper withBorder p="md" mb="md">
      <Title order={4} mb="sm">
        Your Inventory
      </Title>

      <Flex direction="column" gap="md">
        {ownedPowerUps.length > 0 ? (
          <Flex gap="md" wrap="wrap">
            {ownedPowerUps.map((item) => (
              <Paper key={item.id} withBorder p="xs" radius="md">
                <Group gap="sm">
                  <Image
                    src={item.image}
                    width={30}
                    height={30}
                    alt={item.name}
                    fallbackSrc="https://placehold.co/30x30?text=Item"
                  />
                  <Text size="sm">{item.name}</Text>
                  <Badge>{item.count}</Badge>
                </Group>
              </Paper>
            ))}
          </Flex>
        ) : (
          <Text color="dimmed" size="sm">
            You don't have any power-ups yet.
          </Text>
        )}
      </Flex>
    </Paper>
  );
}
