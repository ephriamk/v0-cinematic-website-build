import { HeroSection } from "@/components/sections/hero-section"
import { MarqueeBanner } from "@/components/sections/marquee-banner"
import { IntroSection } from "@/components/sections/intro-section"
import { FuturesSection } from "@/components/sections/futures-section"
import { TheoriesSection } from "@/components/sections/theories-section"
import { ResourcesSection } from "@/components/sections/resources-section"
import { CtaSection } from "@/components/sections/cta-section"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <HeroSection />
      <MarqueeBanner />
      <IntroSection />
      <FuturesSection />
      <TheoriesSection />
      <ResourcesSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
