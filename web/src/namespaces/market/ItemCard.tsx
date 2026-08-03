import { IconCoin } from "@tabler/icons-react";
import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import { Card, CardContent } from "@web/components/ui/card";
import type { Item } from "./types";

interface ItemCardProps {
  item: Item;
  onBuy: (item: Item) => void;
  userCoins: number;
}

export function ItemCard({ item, onBuy, userCoins }: ItemCardProps) {
  const canBuy = userCoins >= item.price;

  return (
    <Card className="shadow-sm border rounded-md overflow-hidden">
      <div className="p-4 h-[140px] bg-gray-100 flex items-center justify-center">
        <img
          src={item.image || "https://placehold.co/80x80?text=Item"}
          className="h-20 w-20 object-cover"
          alt={item.name}
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/80x80?text=Item";
          }}
        />
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mt-0 mb-2">
          <h3 className="font-medium text-lg leading-tight">{item.name}</h3>
          <Badge className="bg-yellow-500 text-white">
            <div className="flex items-center gap-1">
              <IconCoin size={14} />
              <span>{item.price}</span>
            </div>
          </Badge>
        </div>

        <p className="text-sm text-gray-500 mb-3">{item.description}</p>

        {item.duration && (
          <p className="text-xs mb-1">Duration: {item.duration}</p>
        )}

        <p className="text-xs mb-3">Effect: {item.effect}</p>

        <Button
          className={`w-full ${canBuy
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
            }`}
          onClick={() => canBuy && onBuy(item)}
          disabled={!canBuy}
        >
          {canBuy ? "Buy" : "Not enough coins"}
        </Button>
      </CardContent>
    </Card>
  );
}
