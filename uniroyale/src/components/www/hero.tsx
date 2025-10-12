import { IconCalendar, IconMapPin } from '@tabler/icons-react'
import { Button } from '@web/components/ui/button'
import { useEffect, useState } from 'react'
import Emoji from '../misc/Emoji'

const HERO_BACKGROUND_IMAGE = '/cr-1.jpg'
const PARTICIPANT_TARGET = 500
const PARTICIPANT_CURRENT = 172
const PRIZE_TARGET = 25000
const PRIZE_CURRENT = 8600

const formatCurrency = (value: number) => new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0
}).format(value)

const formatNumber = (value: number) => new Intl.NumberFormat('tr-TR').format(value)

export function Hero() {
  const [approvedParticipants, setApprovedParticipants] = useState(PARTICIPANT_CURRENT)
  const [prizeAmount, setPrizeAmount] = useState(PRIZE_CURRENT)

  useEffect(() => {
    let frame: number
    let start: number | null = null
    const duration = 2500

    const animate = (timestamp: number) => {
      if (start === null) {
        start = timestamp
      }

      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      const nextParticipants = Math.round(PARTICIPANT_CURRENT * eased)
      const nextPrize = Math.round(PRIZE_CURRENT * eased)

      setApprovedParticipants(current => (current === nextParticipants ? current : nextParticipants))
      setPrizeAmount(current => (current === nextPrize ? current : nextPrize))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [])

  const onRegister = () => {
    if (typeof window === 'undefined') {
      return
    }

    const target = document.getElementById('basvuru')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.hash = 'basvuru'
    }
  }

  return (
    <>
      <div className="overflow-hidden">
        <section>
          <div className="relative py-6">
            {/* Background image with overlay and correct stacking */}
            <div
              aria-hidden
              className="absolute inset-0 z-0 transition-opacity duration-700"
              style={{
                backgroundImage: `linear-gradient(rgba(3,7,18,0.5), rgba(3,7,18,0.65)), url(${HERO_BACKGROUND_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 z-0"
              style={{
                background: 'radial-gradient(120% 120% at 50% 95%, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.5) 70%, rgba(3, 7, 18, 0.8) 100%)'
              }}
            />

            <div className="relative z-10 mx-auto max-w-5xl px-6">
              <div className="grid items-center gap-10 sm:mx-auto lg:grid-cols-2 lg:gap-12 lg:mr-auto">
                {/* Left: Hero content */}
                <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">

                  <div className="flex w-full flex-col gap-6 lg:gap-8">
                    <div className="flex items-center justify-center lg:items-start lg:justify-start">
                      <img
                        src="/uniturnuva-logo.png"
                        className="w-36 max-w-[42vw] shrink-0 sm:w-38 lg:w-40 xl:w-44"
                        alt="Uniturnuva Logosu"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-3 lg:items-start">
                      <h1 className="text-balance font-black font-stretch-75% text-4xl leading-tight sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem]">
                        <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#ffffff]">
                          UNITURNUVA
                        </span>
                      </h1>

                    </div>
                  </div>

                  <div className="mx-auto my-4 max-w-3xl text-balance text-lg text-white lg:mx-0 lg:text-xl text-shadow-lg">
                    <p>
                      <b>Türkiye'nin en heyecanlı öğrenciler arası Clash Royale turnuvası!</b> <br /> Öğrenciler arenada kozlarını paylaşıyor,
                      rekabetin tadını çıkarıyor, şampiyonluk ve prestijli ödüller için mücadele ediyor.
                    </p>
                  </div>

                  {/* Badges: Mega Draft + Prize distribution */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/40 bg-gradient-to-tr from-red-600 to-orange-500 px-3 py-1 text-[0.88rem] font-extrabold uppercase tracking-wide text-shadow-2xs text-white/90">
                      Mega Draft
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-gradient-to-tr from-orange-500 to-yellow-500 px-3 py-1 text-[0.88rem] font-bold text-white/90 text-shadow-sm">
                      ÖDÜL HEDEFİ · <b>{formatCurrency(PRIZE_TARGET)}</b>
                    </span>
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-center text-xl">
                    <div className="flex items-center gap-2 text-gray-200 text-shadow-sm">
                      <IconCalendar className="w-8 h-8 dark:text-gray-400" />
                      <span>15-26 Ekim 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200 text-shadow-sm">
                      <IconMapPin className="w-8 h-8 dark:text-gray-400" />
                      <span>Online</span>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                    <Button
                      className="rounded-xl px-12 py-8
                    text-xl duration-200 
                    cursor-pointer
                    bg-gradient-to-r from-green-500 to-emerald-600
                    hover:from-green-600 hover:to-emerald-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={onRegister}
                    >
                      <span className="text-nowrap font-extrabold text-white text-shadow-xs">HEMEN KAYDOL !</span>
                    </Button>

                  </div>
                  {/* Close left content wrapper */}
                </div>
                {/* Right: Adjacent hero image (normal) */}
                <div className="w-full">
                  <div className="mt-8 flex flex-col gap-6 text-left">
                    <div className="rounded-xl border dark:border-white/70 dark:bg-white/20 p-5 shadow-sm shadow-black/5 backdrop-blur-sm ">
                      <div className='flex gap-2 justify-between'>
                        <span className="text-sm font-extrabold uppercase tracking-[0.3em] text-gray-600 dark:text-slate-300 text-shadow-lg">Onaylanmış Katılımcı</span>
                        <Emoji emoji="👥" />
                      </div>

                      <span className="mt-3 flex items-baseline gap-2 text-3xl font-black tabular-nums text-gray-900 dark:text-white text-shadow-md" aria-live="polite">
                        {formatNumber(approvedParticipants)}
                        <span className="text-base font-semibold text-gray-500 dark:text-slate-400">/ {formatNumber(PARTICIPANT_TARGET)}</span>
                      </span>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-200 ease-out"
                          style={{ width: `${Math.max((approvedParticipants / PARTICIPANT_TARGET) * 100, 4)}%` }}
                          aria-hidden
                        />
                      </div>
                      <p className="mt-3 text text-gray-600 dark:text-slate-200">
                        Turnuvaya katılmaya hak kazanan <b>{formatNumber(approvedParticipants)}</b> oyuncu lobide.
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/30 bg-white/40 p-5 shadow-sm shadow-black/5 backdrop-blur-sm dark:border-white/70 dark:bg-white/30">
                      <div className='flex gap-2 justify-between'>
                        <span className="text-sm font-extrabold uppercase tracking-[0.3em] text-gray-600 dark:text-slate-300 text-shadow-lg">Ödül Havuzu</span>
                        <Emoji emoji="🏆" />
                      </div>
                      <span className="mt-3 flex items-baseline gap-2 text-3xl font-black tabular-nums text-graclassName='w-1 h-1'y-900 dark:text-white text-shadow-sm" aria-live="polite">
                        {formatCurrency(prizeAmount)}
                        <span className="text-base font-semibold text-gray-500 dark:text-slate-400">/ {formatCurrency(PRIZE_TARGET)}</span>
                      </span>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/80">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-700 to-emerald-500 transition-[width] duration-200 ease-out"
                          style={{ width: `${Math.max((prizeAmount / PRIZE_TARGET) * 100, 4)}%` }}
                          aria-hidden
                        />
                      </div>
                      <p className="mt-3 text-gray-600 dark:text-slate-100 text-shadow-sm">
                        Bilet gelirleri sayesinde hedefe yaklaşıyoruz. <br /> Ödül havuzu, son 32'ye paylaştırılacak.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="my-10 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-1 shadow-lg shadow-zinc-950/15 ring-1">
          <div className="bg-gradient-to-tr from-indigo-900 via-blue-600 to-cyan-400 rounded-2xl p-8">
            <div className="grid gap-6 text-left sm:grid-cols-3">
              {[
                { stage: 'Isınma Turu', date: '15-24 Ekim', description: 'Oyuncular tanışıyor, turnuva test ediliyor ve ilk maçlar atılıyor.' },
                { stage: 'Elemeler', date: '25 Ekim', description: 'Gruplarda üst sıraları zorlayan oyuncular finale yükselmek için mücadele ediyor.' },
                { stage: 'Fİnal', date: '26 Ekim', description: 'En iyi oyuncular sahnede kapışıyor, şampiyon belli oluyor.' }
              ].map(({ stage, date, description }, index) => (
                <div key={stage} className="rounded-2xl border border-white/20 bg-white/40 p-6 backdrop-blur dark:border-white/70 dark:bg-white/30">
                  <div className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.28em] text-gray-600 dark:text-slate-200 text-shadow-lg">
                    <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 text-white text-xl font-black">
                      {index + 1}
                    </span>
                    {stage}
                  </div>
                  <p className="mt-3 text-2xl font-black text-gray-900 dark:text-white text-shadow-sm">{date} 2025</p>
                  <p className="mt-3 text text-gray-800 dark:text-slate-100 text-shadow-lg">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}