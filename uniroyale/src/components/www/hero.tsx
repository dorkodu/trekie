import { IconArrowRight, IconCalendar, IconMapPin, IconTrophy } from '@tabler/icons-react'
import { Button } from '@web/components/ui/button'

export function Hero() {
  const onRegister = () => {
    // Kayıt sayfasına yönlendirme
    window.open('https://forms.google.com/uniturnuva-kayit', '_blank')
  }

  return (
    <>
      <div className="overflow-hidden">
        <section>
          <div className="relative pt-20 md:pt-30">
            <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <div className="flex justify-center mb-8">
                  <div className="bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 p-1 rounded-full">
                    <div className="bg-white dark:bg-gray-900 rounded-full p-4">
                      <IconTrophy className="w-16 h-16 text-red-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="mt-8 max-w-5xl mx-auto text-balance font-black font-stretch-75% text-3xl/9 md:text-4xl lg:text-4xl lg:mt-16 xl:text-[3.5rem]">
                    <span className="bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                      UNITURNUVA
                    </span><br />
                    <span className='text-2xl leading-0 md:text-4xl lg:text-4xl xl:text-5xl text-gray-400 font-medium'>
                      Clash Royale Turnuvası
                    </span>
                  </h1>
                  <p className="mx-auto mt-4 max-w-4xl text-balance text-lg lg:text-xl">
                    Türkiye'nin en heyecanlı Clash Royale turnuvası!
                    Öğrenciler arenada kozlarını paylaşacak,
                    şampiyonluk için mücadele edecek.
                  </p>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-center">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <IconCalendar className="w-5 h-5" />
                    <span>15-16 Kasım 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <IconMapPin className="w-5 h-5" />
                    <span>İstanbul Teknik Üniversitesi</span>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                  <Button
                    className="rounded-xl px-12 py-8
                    text-xl duration-200 
                    bg-gradient-to-r from-green-500 to-emerald-600
                    hover:from-green-600 hover:to-emerald-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={onRegister}
                  >
                    <span className="text-nowrap font-extrabold text-white text-shadow-xs">HEMEN KAYDOL</span>
                  </Button>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-0 py-6">
                    <a className="block px-8 py-3" href='#kurallar'>
                      <span className="text-nowrap text-lg">Kuralları İncele</span>
                      <IconArrowRight className="size-6" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>


            <div className="my-10 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
              <div className="bg-gradient-to-r from-red-500/10 via-blue-500/10 to-yellow-500/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">🏆 Ödül Havuzu: 50.000₺</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Birinci: 25.000₺ + Özel Ödül<br />
                  İkinci: 15.000₺<br />
                  Üçüncü: 10.000₺
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}