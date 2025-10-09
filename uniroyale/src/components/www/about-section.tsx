import { IconBolt, IconTarget, IconUsers } from '@tabler/icons-react'

export function AboutSection() {
  return (
    <section id="hakkinda" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turnuva Hakkında
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Uniturnuva, Türkiye'nin ilk ve en büyük üniversiteler arası mobil oyun turnuvasıdır.
            Öğrencilerin yeteneklerini sergileyebilecekleri, yeni arkadaşlıklar kurabilecekleri bir platform sunuyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconUsers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Üniversite Öğrencileri</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Türkiye'nin dört bir yanından üniversite öğrencileri bir araya geliyor
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconTarget className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Profesyonel Organizasyon</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Deneyimli organizatörler ve hakemlerle adil ve eğlenceli bir turnuva
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconBolt className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Heyecan Dolu Mücadele</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clash Royale'ın en iyi stratejilerini sergileyin ve şampiyon olun
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}