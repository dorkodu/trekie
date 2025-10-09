import { IconAward, IconMedal, IconTrophy } from '@tabler/icons-react'

export function PrizesSection() {
  const prizes = [
    {
      position: "🥇 Birinci",
      amount: "25.000₺",
      description: "Şampiyonluk kupası + Özel ödül paketi",
      color: "from-yellow-400 to-yellow-600",
      icon: IconTrophy
    },
    {
      position: "🥈 İkinci",
      amount: "15.000₺",
      description: "Gümüş madalya + Ödül paketi",
      color: "from-gray-300 to-gray-500",
      icon: IconMedal
    },
    {
      position: "🥉 Üçüncü",
      amount: "10.000₺",
      description: "Bronz madalya + Ödül paketi",
      color: "from-orange-400 to-orange-600",
      icon: IconAward
    }
  ]

  return (
    <section id="oduller" className="relative py-20">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.05),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ödül Havuzu
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Toplam 50.000₺'lik havuz ve özel ödüller, arenanın en iyilerini bekliyor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {prizes.map((prize, index) => (
            <div key={index} className="relative">
              <div className={`bg-gradient-to-br ${prize.color} rounded-2xl p-8 text-white text-center shadow-2xl shadow-black/30 ring-1 ring-white/20 transition-transform duration-300 hover:-translate-y-1`}>
                <div className="flex justify-center mb-4">
                  <prize.icon className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{prize.position}</h3>
                <div className="text-3xl font-black mb-4">{prize.amount}</div>
                <p className="text-sm opacity-90">{prize.description}</p>
              </div>
              {index === 0 && (
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg shadow-red-500/30">
                  ŞAMPİYON
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20 backdrop-blur">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">🎁 Özel Ödüller</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🎮</div>
                <p className="font-semibold text-white">Gaming Setup</p>
                <p className="text-sm text-slate-300">Mekanik klavye ve mouse</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="font-semibold text-white">Telefon</p>
                <p className="text-sm text-slate-300">Yeni nesil akıllı cihaz</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎧</div>
                <p className="font-semibold text-white">Kulaklık</p>
                <p className="text-sm text-slate-300">Kablosuz gaming kulaklık</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="font-semibold text-white">Nakit Ödül</p>
                <p className="text-sm text-slate-300">Ek nakit sürprizleri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}