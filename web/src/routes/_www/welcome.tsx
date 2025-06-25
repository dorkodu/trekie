import { createFileRoute } from '@tanstack/react-router'
import { Features } from '@web/components/www/features'
import { Hero } from '@web/components/www/hero'
import { PremiumHero } from '@web/components/www/premium-hero'

export const Route = createFileRoute('/_www/welcome')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Hero />
    <Features />
    <PremiumHero />
  </div>
}
