import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import StickyMetricsSection from '../components/sections/StickyMetricsSection'
import ServicesSection from '../components/sections/ServicesSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import CreativeFooter from '../components/sections/CreativeFooter'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navbar scrolled={scrolled} />
      <Hero />
      <StickyMetricsSection />
      <ServicesSection />
      <ProjectsSection />
      <CreativeFooter />
    </>
  )
}
