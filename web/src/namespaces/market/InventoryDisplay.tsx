import { Badge } from "@web/components/ui/badge";
import { Card } from "@web/components/ui/card";
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
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Your Inventory
      </h3>

      <div className="flex flex-col gap-4">
        {ownedPowerUps.length > 0 ? (
          <div className="gap-6 wrap">
            {ownedPowerUps.map((item) => (
              <Card key={item.id} className="p-2 rounded-md shadow-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    className="w-8 h-8 rounded"
                    alt={item.name}
                  />
                  <p className="text-sm">{item.name}</p>
                  <Badge>{item.count}</Badge>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any power-ups yet.
          </p>
        )}
      </div>
    </Card>
  );
}
