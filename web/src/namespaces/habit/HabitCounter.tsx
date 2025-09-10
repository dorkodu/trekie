import { IconMinus, IconPlus, IconPlusMinus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import React, { type MouseEvent } from "react";

import { daystamp } from "@sdk/utils";
import EnhancedText from "@web/components/misc/TextParser";
import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@web/components/ui/tooltip";
import { habits } from "@web/namespaces/habit";
import HabitCounterMenu from "@web/namespaces/habit/HabitCounterMenu";

interface Props {
  habitId: string;
}

function HabitCounter({ habitId }: Props) {
  const navigate = useNavigate();
  const habit = useLiveQuery(() => habits.get(habitId), [habitId]);

  const onChangeCount = (ev: MouseEvent, count: number) => {
    ev.stopPropagation();
    if (!habit) return;
    habits.changeCount(habitId, count);
  };

  const onClick = () => {
    navigate({ to: `/habit/${habitId}` });
  };

  if (!habit) return null;

  return (
    <Card
      className="bg-transparent border-0 overflow-visible mb-2 rounded-2xl shadow-md p-0 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex flex-row items-stretch min-h-20">
        {/* Increment Button */}
        <Button
          className="rounded-none rounded-l-2xl flex items-center justify-center px-2 min-w-0"
          style={{
            background: "linear-gradient(45deg, hsl(135, 95%, 30%), hsl(170, 95%, 35%))",
            height: "auto",
          }}
          onClick={(ev) => onChangeCount(ev, +1)}
        >
          <div className="flex items-center justify-center bg-white/30 w-8 h-8 rounded-md p-0.5">
            <IconPlus stroke={2.5} className="size-7" />
          </div>
        </Button>

        {/* Main Content */}
        <div className="flex flex-col flex-1 justify-center py-3 pl-3 pr-2 min-w-0 bg-white/5 ring-1 ring-black/5">
          <div className="flex flex-row justify-between items-center">
            <div className="grid grid-rows-1 min-w-0">
              <h5 className="truncate font-bold text-base">
                <EnhancedText ids={["emoji"]} text={habit.title} />
              </h5>
            </div>
            <HabitCounterMenu habit={habit} />
          </div>

          {habit.description && habit.description.length > 0 && (
            <div className="pt-0.5">
              <span className="text-sm leading-tight">
                <EnhancedText
                  ids={["emoji", "url", "username"]}
                  text={habit.description}
                />
              </span>
            </div>
          )}

          <div className="flex flex-row gap-2 mt-1.5 justify-between pt-1">
            <div className="flex flex-row gap-3 items-start">
              <Badge className="block text-lg font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                <span>{habit.count}</span>
              </Badge>

              <div className="flex flex-col gap-0 items-start pt-0.5">
                <span className="text-xs text-gray-500 font-medium leading-none">Today</span>
                <span className="font-semibold text-blue-600 text-sm leading-none opacity-75">
                  {habit.history.get(daystamp.today()) ?? 0}
                  <span className="text-blue-600 opacity-25 px-1 font-semibold">/{habit.dailyTarget}</span>
                </span>
              </div>

              <div className="flex flex-col gap-1 items-start pt-0.5">
                <span className="text-xs text-gray-500 font-medium leading-none">This Week</span>
                <WeeklyActivity />
              </div>
            </div>

            <span className="inline-flex items-center justify-center text-gray-400">
              <IconPlusMinus />
            </span>
          </div>
        </div>

        {/* Decrement Button */}
        <Button
          className="rounded-none rounded-r-2xl flex items-center justify-center px-2 min-w-0"
          style={{
            background: "linear-gradient(135deg, hsl(15, 90%, 60%), hsl(0, 96%, 45%))",
            height: "auto",
          }}
          onClick={(ev) => onChangeCount(ev, -1)}
        >
          <div className="flex items-center justify-center bg-white/25 w-8 h-8 rounded-md p-0.5">
            <IconMinus stroke={2.5} className="size-7" />
          </div>
        </Button>
      </div>
    </Card>
  );
}
export default HabitCounter;

const WeeklyActivity: React.FC = () => {
  const counts = [1, 5, 3, 0, 6, 11, 1]; // feed this with the actual data
  return <WeekGraph counts={counts} />;
};

const WeekGraph: React.FC<{ counts: number[] }> = ({ counts }) => {
  const maxCount = Math.max(...counts, 1); // Avoid division by zero
  // Use Tailwind for color, fallback to green-600 with opacity for filled, gray-200 for empty
  return (
    <div className="flex gap-0.5" title="Weekly Activity">
      {counts.map((count, index) => (
        <Tooltip
          key={index}>
          <TooltipTrigger>
            <div
              className={
                count === 0
                  ? "w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700"
                  : "w-3 h-3 rounded-sm bg-green-600"
              }
              style={count !== 0 ? { opacity: Math.max(0.2, Math.min(1.0, count / maxCount)) } : {}}
            />
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs text-gray-500">{`${count} commits on day ${index + 1}`}</span>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
