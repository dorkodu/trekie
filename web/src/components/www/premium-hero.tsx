
import { IconAd, IconCoins, IconUsers } from "@tabler/icons-react";
import { Button } from "@web/components/ui/button";

export function PremiumHero() {
  return (
    <div className="flex items-center justify-center px-6">
      <div className="max-w-3xl lg:max-w-5xl rounded-lg bg-gradient-to-b from-indigo-800 to-cyan-400 p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              Supercharge Your Gamified Productivity.
            </h1>
            <p className="text-lg">
              Reaching your life goals never been more fun. Your first super-week
              is on us.
            </p>
            <Button variant="secondary">Try For Free →</Button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className=""><IconAd className="w-10 h-10" /></div>
              <div>
                <h3 className="font-bold">Ad-free</h3>
                <p>No interruptions, full productivity.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <IconCoins className="w-10 h-10" />
              <div>
                <h3 className="font-bold">Doubled Gains</h3>
                <p>More coins, XP and items available.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <IconUsers className="w-10 h-10" />
              <div>
                <h3 className="font-bold">Groups</h3>
                <p>
                  Share common goals & habits with friends. Say hello to social
                  productivity boost!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

