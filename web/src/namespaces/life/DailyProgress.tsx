import { Tooltip, TooltipTrigger } from "@web/components/ui/tooltip";
import { trekie } from "@web/lib/trekie";
import { cn } from "@web/lib/utils";

export function DailyProgress() {
  let progress = trekie.use(($) => $.dailyProgress());

  let color: string;
  let message: string;

  let value = progress * 100;
  let haveProgressToday = value > 0;

  if (value > 0 && value < 30) {
    message = "Bad";
    color = "red";
  } else if (value >= 30 && value < 45) {
    message = "Meh";
    color = "orange";
  } else if (value >= 45 && value < 60) {
    message = "OK";
    color = "yellow";
  } else if (value >= 60 && value < 80) {
    message = "Good";
    color = "lime";
  } else if (value >= 80 && value < 95) {
    message = "Great";
    color = "green";
  } else if (value >= 95) {
    message = "Awesome!";
    color = "green";
  } else {
    message = "Nothing";
    color = "gray";
  }

  // Tailwind color map
  const colorMap: Record<string, string> = {
    red: "bg-red-500",
    orange: "bg-orange-400",
    yellow: "bg-yellow-400",
    lime: "bg-lime-400",
    green: "bg-green-500",
    gray: "bg-gray-400",
  };
  const barColor = colorMap[color] || colorMap.gray;

  const noProgressToday = (
    <div className="relative w-full h-6 rounded-xl bg-gray-200 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <span className="uppercase text-xs font-medium text-white text-shadow-lg tracking-wide">
          NO PROGRESS TODAY
        </span>
      </div>
      <div
        className="w-full h-full bg-gray-600 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0 8px, transparent 8px 16px)",
          backgroundSize: "auto",
          backgroundPosition: "0 0",
        }}
      />
    </div>
  );

  const progressBar = (
    <Tooltip>
      <TooltipTrigger>
        <div className="relative w-full h-6 rounded-lg bg-gray-200 overflow-hidden group">
          <div
            className={cn("h-full transition-all duration-100", barColor)}
            style={{ width: `${value}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-sm font-medium text-white drop-shadow-md">
              {message}
            </span>
          </div>
        </div>
      </TooltipTrigger>
    </Tooltip>
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-500">
          Your Daily Progress
        </span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
      {haveProgressToday ? progressBar : noProgressToday}
    </div>
  );
}

// Tailwind animation for stripes (add to your global CSS if not present)
// .animate-stripes {
//   background-image: repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0 8px, transparent 8px 16px);
//   animation: stripes 1s linear infinite;
// }
// @keyframes stripes {
//   0% { background-position: 0 0; }
//   100% { background-position: 32px 0; }
// }