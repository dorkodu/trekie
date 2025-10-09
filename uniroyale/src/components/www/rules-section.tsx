import { IconCheck, IconX } from '@tabler/icons-react'

export function RulesSection() {
  return (
    <section id="kurallar" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turnuva Kuralları
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Turnuvanın adil ve eğlenceli geçmesi için uymanız gereken kurallar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <IconCheck className="w-6 h-6 text-green-500" />
              Yapılması Gerekenler
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Üniversite öğrencisi olmak (öğrenci belgesi zorunlu)</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Kayıt formunu eksiksiz doldurmak</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Turnuva saatinde hazır bulunmak</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Hakem kararlarına saygı göstermek</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Fair play ruhuna uygun davranmak</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <IconX className="w-6 h-6 text-red-500" />
              Yasaklanan Davranışlar
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconX className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Hile yapmak veya üçüncü parti yazılımlar kullanmak</span>
              </li>
              <li className="flex items-start gap-3">
                <IconX className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Küfür, hakaret veya sportmenlik dışı davranış</span>
              </li>
              <li className="flex items-start gap-3">
                <IconX className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Hakem kararlarına itiraz etmek</span>
              </li>
              <li className="flex items-start gap-3">
                <IconX className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Geç kalmak veya maçı terk etmek</span>
              </li>
              <li className="flex items-start gap-3">
                <IconX className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Yasaklanmış kartlar kullanmak</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-yellow-500/10 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4">Turnuva Formatı</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 mb-2">Eleme</div>
              <p className="text-sm">Grup maçları ile elemeler</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-2">Çeyrek Final</div>
              <p className="text-sm">En iyi 8 takım</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-2">Final</div>
              <p className="text-sm">Şampiyonluk maçı</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}