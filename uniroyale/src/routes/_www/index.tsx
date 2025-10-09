import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from '../../components/www/about-section';
import { ContactSection } from '../../components/www/contact-section';
import { Hero } from '../../components/www/hero';
import { PrizesSection } from '../../components/www/prizes-section';
import { RulesSection } from '../../components/www/rules-section';
import { ScheduleSection } from '../../components/www/schedule-section';

export const Route = createFileRoute('/_www/')({
  component: Page,
})

function Page() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <RulesSection />
      <ScheduleSection />
      <PrizesSection />
      <ContactSection />
    </main>
  )
}
