import { IconCalendar, IconClock } from '@tabler/icons-react'

export function ScheduleSection() {
  const schedule = [
    {
      date: "1 Kasım 2025",
      time: "23:59",
      title: "Kayıtların Son Günü",
      description: "Son kayıt tarihi"
    },
    {
      date: "10 Kasım 2025",
      time: "18:00",
      title: "Teknik toplantı",
      description: "Kurallar ve format açıklaması"
    },
    {
      date: "15 Kasım 2025",
      time: "10:00",
      title: "Grup Maçları",
      description: "Eleme turu maçları"
    },
    {
      date: "15 Kasım 2025",
      time: "14:00",
      title: "Çeyrek Final",
      description: "İkinci gün maçları"
    },
    {
      date: "16 Kasım 2025",
      time: "10:00",
      title: "Yarı Final",
      description: "Finalistler belirleniyor"
    },
    {
      date: "16 Kasım 2025",
      time: "15:00",
      title: "Final & Ödül Töreni",
      description: "Şampiyonluk maçı ve ödül dağıtımı"
    }
  ]

  return (
    <section id="takvim" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turnuva Takvimi
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Turnuvanın önemli tarihlerini ve saatlerini takip edin
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-red-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconCalendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-lg">{item.date}</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <IconClock className="w-4 h-4" />
                      <span className="text-sm">{item.time}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">📍 Yer: İstanbul Teknik Üniversitesi</h3>
            <p className="text-lg opacity-90">Maslak Kampüsü - Bilgisayar Mühendisliği Fakültesi</p>
          </div>
        </div>
      </div>
    </section>
  )
}