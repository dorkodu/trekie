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
    <section id="oduller" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ödül Havuzu
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Toplam 50.000₺'lik ödül havuzu ile kazananları bekliyor!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {prizes.map((prize, index) => (
            <div key={index} className="relative">
              <div className={`bg-gradient-to-br ${prize.color} rounded-2xl p-8 text-white text-center shadow-2xl transform hover:scale-105 transition-transform`}>
                <div className="flex justify-center mb-4">
                  <prize.icon className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{prize.position}</h3>
                <div className="text-3xl font-black mb-4">{prize.amount}</div>
                <p className="text-sm opacity-90">{prize.description}</p>
              </div>
              {index === 0 && (
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ŞAMPİYON
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-500/10 via-blue-500/10 to-yellow-500/10 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">🎁 Özel Ödüller</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🎮</div>
                <p className="font-semibold">Gaming Setup</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mekanik klavye ve mouse</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="font-semibold">Telefon</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">En yeni model</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎧</div>
                <p className="font-semibold">Kulaklık</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kablosuz gaming kulaklık</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <p className="font-semibold">Nakit Ödül</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Para ödülü</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}