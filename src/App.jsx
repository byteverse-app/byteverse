import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ModesSection from './components/ModesSection'
import TryByteNimbus from './components/TryByteNimbus'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Mission from './components/Mission'
import ByteVerseUniverse from './components/ByteVerseUniverse'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="font-ui bg-nimbus-bg text-white">
      <Header />
      <main>
        <Hero />
        <ModesSection />
        <TryByteNimbus />
        <Features />
        <Pricing />
        <Mission />
        <ByteVerseUniverse />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
