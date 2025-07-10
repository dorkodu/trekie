import { Card, CardContent } from '@web/components/ui/card';
import { cn } from '@web/lib/utils';
import Emoji from '../misc/Emoji';

export function Features() {
  const glassBg = 'bg-white/35 dark:bg-black/35 backdrop-blur-2xs transition-all duration-500 hover:bg-white/45 dark:hover:bg-black/45';

  return (
    <section
      id="features"
      className="relative py-12 md:py-24 my-12 max-w-7xl rounded-3xl mx-auto overflow-hidden"
      style={{
        backgroundSize: "120% 120%",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundImage: 'url("https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        transition: 'background-size 0.8s ease-in-out'
      }}>
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 transition-opacity duration-500" />

      <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            <Card className={cn("relative col-span-full flex overflow-hidden lg:col-span-2", glassBg)}>
              <CardContent className="relative size-fit">
                <div className="relative flex aspect-square size-14 bg-white rounded-xl dark:bg-black/40">
                  <Emoji className="m-auto" size={40} emoji="🗃️" />
                </div>
                <div className="pt-6 lg:px-6">
                  <img src="/images/oasis.webp" alt="" />
                </div>
                <h2 className="my-4 text-center text-2xl font-semibold">Your life, in one place.</h2>
                <p className='text-center'>Keep all your goals, habits, and tasks organized in one playful dashboard. See your progress clearly, celebrate wins, and feel in control of your personal journey.</p>
              </CardContent>
            </Card>
            <Card className={cn("relative col-span-full flex overflow-hidden lg:col-span-2", glassBg)}>
              <CardContent>
                <div className="relative flex aspect-square size-14 bg-white rounded-xl dark:bg-black/25">
                  <Emoji className="m-auto" size={36} emoji="🎯" />
                </div>
                <div className="pt-6 lg:px-6">
                  <img src="/images/oasis.webp" alt="" />
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h2 className="group-hover:text-secondary-950 text-2xl font-bold transition dark:text-white">Life Goals</h2>
                  <p className="text-foreground">Define your biggest life goals and break them down into achievable steps. Trekie keeps you focused on what truly matters

                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className={cn("relative col-span-full flex overflow-hidden lg:col-span-2", glassBg)}>
              <CardContent>
                <div className="relative flex aspect-square size-14 bg-white rounded-xl dark:bg-black/25">
                  <Emoji className="m-auto" size={36} emoji="✅" />
                </div>
                <div className="pt-6 lg:px-6">
                  <img src="/images/oasis.webp" alt="" />
                </div>
                <div className="relative z-10 mt-14 space-y-2 text-center">
                  <h2 className="text-2xl font-bold transition">Commitments</h2>
                  <p className="text-foreground">Turn daily habits and routines into commitments. Trekie helps you stay consistent by making each action feel like a win.</p>
                </div>
              </CardContent>
            </Card>
            <Card className={cn("relative col-span-full overflow-hidden lg:col-span-3", glassBg)}>
              <CardContent className="grid sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-14 bg-white rounded-xl dark:bg-black/25">
                    <Emoji className="m-auto" size={40} emoji="💬" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="group-hover:text-secondary-950 text-xl font-bold transition">
                      Your AI Companion
                    </h2>
                    <p className="text-foreground">
                      Your personal coach, always one step ahead. Trekie’s AI gives you <b>smart hints, motivational nudges, and clarity</b> on what to focus on next; tailored to your habits and progress.
                    </p>
                  </div>
                </div>
                <div className="relative -mb-6 -mr-6 mt-6 h-fit p-4 sm:ml-6">
                  <img src="/images/oasis.webp" alt="" />
                </div>
              </CardContent>
            </Card>
            <Card className={cn("relative col-span-full overflow-hidden lg:col-span-3", glassBg)}>
              <CardContent className="grid h-full sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-14 bg-white rounded-xl dark:bg-black/20">
                    <Emoji className="m-auto" size={40} emoji="🎮" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">Gamify Your Growth</h2>
                    <p className="text-foreground">Earn XP, build momentum streaks, and unlock rewards as you complete your tasks. Real-life progress, but with the joy of leveling up in a game.</p>
                  </div>
                </div>
                <div className="relative -mb-6 -mr-6 mt-6 h-fit p-4 sm:ml-6">
                  <img src="/images/oasis.webp" alt="" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section >
  )
}
