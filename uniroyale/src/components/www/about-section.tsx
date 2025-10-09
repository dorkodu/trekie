import { IconBolt, IconSchool, IconTarget } from '@tabler/icons-react'

export function AboutSection() {
  return (
    <section id="hakkinda" className="relative py-20">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_45%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Turnuva Hakkında
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Uniturnuva, Türkiye'nin ilk ve en büyük öğrenciler arası Clash Royale turnuvasını düzenlemeyi amaçlıyor.
            Oyuncular yeteneklerini gösterirken, arenada topluluk ruhu ve rekabet heyecanı yeniden canlanıyor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconSchool className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Öğrenciler Arenası</h3>
            <p className="text-slate-300">
              Türkiye'nin dört bir yanından her yaştan gençler aynı arenada buluşuyor.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconTarget className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Profesyonel Organizasyon</h3>
            <p className="text-slate-300">
              Moderatörlerden yayın sürecine kadar her şey adil, rekabetçi ve keyifli bir deneyim için hazırlandı.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconBolt className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Kesintisiz Heyecan</h3>
            <p className="text-slate-300">
              Clash Royale meta oyununu sahneye taşı, şampiyonluk kupası senin olsun.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}