import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from '../../components/www/about-section';
import { ContactSection } from '../../components/www/contact-section';
import { Hero } from '../../components/www/hero';

export const Route = createFileRoute('/_www/')({
  component: Page,
})

function Page() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <Basvuru />
      <ContactSection />
    </main>
  )
}

function Basvuru() {
  return (
    <section id="basvuru" className="px-2 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeK3OKi4yLIbDny9Ax-cjHnIuE66Gdhcoe4eVvoKp-5rvLFzQ/viewform?embedded=true"
          className="h-[1024px] w-full rounded-xl"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Uniturnuva Kayıt Formu"
        >
          Loading…
        </iframe>
      </div>
    </section>
  )
}
