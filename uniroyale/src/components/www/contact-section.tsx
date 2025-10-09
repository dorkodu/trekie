import { IconBrandInstagram, IconBrandTelegram, IconMail, IconPhone } from '@tabler/icons-react'
import { Button } from '@web/components/ui/button'

export function ContactSection() {
  return (
    <section id="iletisim" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            İletişim
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Sorularınız için bizimle iletişime geçin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Organizatörler</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <IconMail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Genel Sorular</p>
                    <p className="text-gray-600 dark:text-gray-400">info@uniturnuva.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <IconPhone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Destek Hattı</p>
                    <p className="text-gray-600 dark:text-gray-400">+90 555 123 45 67</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Sosyal Medya</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="rounded-full">
                  <IconBrandInstagram className="w-5 h-5" />
                  <span className="ml-2">@uniturnuva</span>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  <IconBrandTelegram className="w-5 h-5" />
                  <span className="ml-2">Uniturnuva</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Sık Sorulan Sorular</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Kimler katılabilir?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Türkiye'nin herhangi bir üniversitesinde kayıtlı aktif öğrenciler katılabilir.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Kayıt ücreti var mı?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Hayır, Uniturnuva tamamen ücretsizdir.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hangi cihazlar kullanılacak?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Kendi akıllı telefonunuzu getirmeniz yeterli. Clash Royale uygulamasının yüklü olması gerekir.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Öğrenci belgesi şart mı?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Evet, kayıt sırasında öğrenci belgenizi ibraz etmeniz zorunludur.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">🚀 Hazır mısınız?</h3>
            <p className="text-lg mb-6 opacity-90">
              Uniturnuva macerasına katılmak için hemen kayıt olun!
            </p>
            <Button
              className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 text-lg font-bold rounded-xl"
              onClick={() => window.open('https://forms.google.com/uniturnuva-kayit', '_blank')}
            >
              KAYIT OL
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}