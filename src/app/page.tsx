'use client'

import Header from './_components/landing/header'
import Hero from './_components/landing/hero'
import Features from './_components/landing/features'
import HowItWorks from './_components/landing/how-it-works'
import Pricing from './_components/landing/pricing'
import Testimonials from './_components/landing/testimonials'
import CTASection from './_components/landing/cta-section'
import Footer from './_components/landing/footer'
import Contact from './_components/landing/contact'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTASection />
      <Contact />
      <Footer />
    </main>
  )
}