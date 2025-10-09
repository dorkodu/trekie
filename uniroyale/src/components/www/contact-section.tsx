import { IconBrandInstagram, IconBrandTiktok, IconMail } from '@tabler/icons-react'
import { Button } from '@web/components/ui/button'

export function ContactSection() {
  return (
    <section id="iletisim" className="relative py-20">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.08),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            İletişim
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Sorularınız ve iş birlikleri için doğrudan ekibimize ulaşın.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white">Organizatörler</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <IconMail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Genel Sorular</p>
                    <p className="text-slate-300">unitournamenttr@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Sosyal Medya</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: '@uniturnuva_cr',
                    href: 'https://instagram.com/uniturnuva_cr',
                    icon: <IconBrandInstagram className="w-8 h-8" />,
                    platform: 'Instagram'
                  },
                  {
                    label: '@uni.turnuva.cr',
                    href: 'https://www.tiktok.com/@uni.turnuva.cr',
                    icon: <IconBrandTiktok className="w-8 h-8" />,
                    platform: 'TikTok'
                  }
                ].map(({ label, href, icon, platform }) => (
                  <Button
                    key={label}
                    variant="secondary"
                    size="lg"
                    asChild
                    className="group w-full rounded-2xl cursor-pointer border border-white/15 bg-white/[0.08] px-4 py-3 text-left text-white transition hover:border-white/25 hover:bg-white/15"
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${platform} profilimiz (${label})`}
                      className="flex w-full items-center justify-between gap-4"
                    >
                      <span className="flex items-center gap-4">
                        <span className="flex items-center justify-center rounded-full text-white">
                          {icon}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-lg font-bold text-white">
                            {label}
                          </span>
                        </span>
                      </span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20 backdrop-blur">
            <h3 className="text-xl font-semibold mb-6 text-white">Sık Sorulan Sorular</h3>
            <div className="space-y-6">
              {
                [
                  {
                    q: `Kimler katılabilir?`,
                    a: `Türkiye'den 13-30 yaş arası herhangi bir Clash Royale tutkunu öğrenci katılabilir.`
                  },

                  {
                    q: `Katılım ücretli mi?`,
                    a: `Uniturnuva standart bilet fiyatı 150₺, ancak referans kodunuz varsa 120₺'ye indirimli alabilirsiniz.`
                  },

                  {
                    q: `Etkinlik yüz yüze mi?`,
                    a: `Kısmen. Isınma turu ve elemeler çevrimiçi iken büyük final günü ise İstanbul'da Boğaziçi Üniversitesi Güney Kampüs'te katılmak isteyenlerle yüz yüze gerçekleşecek.`
                  },
                ].map((item) => (<div>
                  <h4 className="font-semibold mb-2 text-white/90">{item.q}</h4>
                  <p className="text-slate-300 text-sm">
                    {item.a}
                  </p>
                </div>))
              }
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-red-500/30 via-blue-500/25 to-yellow-500/30 p-8 text-white shadow-2xl shadow-black/30">
            <h3 className="text-2xl font-bold mb-4">🚀 Hazır mısınız?</h3>
            <p className="text-lg mb-6 text-white/90">
              Uniturnuva'ya katılmak için hemen başvuru formunu doldurun!
            </p>
            <Button
              className="rounded-xl bg-white text-red-500 hover:bg-slate-100 px-8 py-3 text-lg font-bold"
              asChild={true}
            >
              <a href="#basvuru">
                KAYIT OL
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}