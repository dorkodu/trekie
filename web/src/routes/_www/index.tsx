import { createFileRoute } from '@tanstack/react-router'
import FAQ from '@web/components/www/faq'
import { Features } from '@web/components/www/features'
import { Hero } from '@web/components/www/hero'
import { PremiumHero, PricingSection } from '@web/components/www/premium-hero'

export const Route = createFileRoute('/_www/')({
  component: Page,
})

function Page() {
  return (
    <main>
      <Hero />
      <Features />
      <PremiumHero />
      <PricingSection />
      <FAQ />
    </main>
  )
}
