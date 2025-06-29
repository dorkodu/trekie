import { IconAd, IconArrowRight, IconBuildings, IconCheck, IconGlobe, IconInfinity, IconMail, IconMultiplier2x, IconStar, IconUsers, IconUsersGroup } from "@tabler/icons-react";
import { Button } from "@web/components/ui/button";
import Emoji from "../misc/Emoji";

export function PremiumHero() {
  return (
    <div className="flex items-center justify-center px-6">
      <div className="p-6 max-w-3xl lg:max-w-5xl rounded-xl bg-gradient-to-b from-indigo-800 to-cyan-400  text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-shadow-xs text-shadow-blue-800">
              Supercharge Your<br />Gamified Productivity.
            </h1>
            <p className="text-lg text-shadow-xs leading-tight">
              Reaching your life goals never been more fun. <br /> Your first super-week
              is on us.
            </p>
            <Button
              className="px-8! py-6 border-b-4
              text-lg font-bold
              rounded-xl cursor-pointer 
              shadow-lg hover:shadow-xl transition-all duration-300
              bg-white text-blue-600 hover:bg-blue-100 border-blue-300"
            >
              TRY FOR FREE
              <IconArrowRight stroke={2.5} style={{ width: 24, height: 24 }} />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-1.5 rounded-lg bg-white/15"><IconAd className="w-7 h-7" /></div>
              <div>
                <h3 className="font-bold">Ad-free</h3>
                <p>No interruptions, full productivity.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-1.5 rounded-lg bg-white/15"><IconMultiplier2x className="w-7 h-7" /></div>
              <div>
                <h3 className="font-bold">Doubled Gains</h3>
                <p>More coins, XP and items available.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-1.5 rounded-lg bg-white/20"><IconUsersGroup className="w-7 h-7" /></div>
              <div>
                <h3 className="font-bold">Groups</h3>
                <p>
                  Share common goals & habits with friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingSection() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Emoji emoji="💸" size={40} />
          <h2 className="text-3xl font-extrabold tracking-tight">Pricing</h2>
        </div>
        <p className="text-lg">One app to gamify your life and 10x your productivity.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <div className="absolute -top-10 left-4">
            <img src="/images/free.svg" className="h-20 w-20" />
          </div>

          <div className="mb-6 mt-6">
            <h3 className="text-2xl font-bold">Starter Pack</h3>
            <div className="text-gray-600 mb-4">All basics for a new beginning!</div>

            <Button className="w-full bg-gradient-to-tr from-green-600 to-emerald-500 hover:from-green-600 hover:to-emerald-400 text-white font-bold py-5 rounded-xl text-lg cursor-pointer">
              GET STARTED
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-200 p-0.5 rounded-sm"><IconCheck stroke={2.25} className="w-5 h-5 text-green-600 flex-shrink-0" /></div>

              <span>3 Life Goals</span>
            </div>
            <div className="flex items-center gap-3">
              <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>10 Habits</span>
            </div>
            <div className="flex items-center gap-3">
              <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>One Story Per Day</span>
            </div>
            <div className="flex items-center gap-3">
              <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Social Feed</span>
            </div>
            <div className="flex items-center gap-3">
              <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>1x Gains</span>
            </div>
          </div>
        </div>

        {/* Super Tier */}
        <div className="relative bg-gradient-to-br from-indigo-800 to-cyan-400 rounded-2xl p-8 shadow-lg text-white">
          <div className="absolute -top-6 left-2">
            <img src="/images/trekie_SUPER_Badge.svg" alt="" className="w-auto h-14" />
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold">$6</span>
              <span className="text-lg opacity-80">/month</span>
            </div>
            <div className="text-lg mb-4 opacity-90">Say hello to your new <strong>supercharged life</strong>!</div>

            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-xl text-lg mb-4">
              TRY FOR FREE
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-black/15 p-1 rounded-md"><IconInfinity className="w-6 h-6 flex-shrink-0" /></div>
              <span className="text-shadow-sm">Increased Limits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-black/15 p-1 rounded-md"><IconMail className="w-6 h-6 flex-shrink-0" /></div>
              <span className="text-shadow-sm">No Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-black/15 p-0.5 rounded-md"><IconMultiplier2x className="w-7 h-7 flex-shrink-0" /></div>
              <span className="text-shadow-sm">Doubled Gains</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-black/15 p-1 rounded-md"><IconGlobe className="w-6 h-6 flex-shrink-0" /></div>
              <span className="text-shadow-sm">Public Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-black/15 p-1 rounded-md"><IconStar className="w-6 h-6 flex-shrink-0" /></div>
              <span className="text-shadow-sm">Profile Highlights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-black/15 p-1 rounded-md"><IconUsers className="w-6 h-6 flex-shrink-0" /></div>
              <span className="text-shadow-sm">Communities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="mt-16 text-center">
        <p className="text-xl font-medium mb-8">Need more?</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p- border-2 border-blue-100 shadow-md shadow-slate-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white p-2 rounded-lg">
                <IconUsers className="w-8 h-8" stroke={2.25} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Teams & Family</h3>
                <p className="text-gray-700 mb-4">A better place for small groups to gamify and get productive!</p>
                <p className="text-blue-600 font-medium italic">Coming soon!</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border-2 border-slate-200 shadow-md shadow-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white p-2 rounded-lg">
                <IconBuildings className="w-8 h-8" stroke={2.25} />
              </div>
              <h3 className="text-xl font-bold">For Business</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Advanced controls & support to gamify your organization. <strong>Contact us, we can offer a solution that suit your needs.</strong>
            </p>
            <div className="flex items-center gap-2 text-blue-600">
              <IconMail className="w-4 h-4" />
              <span className="font-medium">hey@dorkodu.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

