import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import StickyMetricsSection from './components/sections/StickyMetricsSection'
import ServicesSection from './components/sections/ServicesSection'
import ProjectsSection from './components/sections/ProjectsSection'
import CreativeFooter from './components/sections/CreativeFooter'
import ClickSpark from './components/reactbits/ClickSpark'

function App() {
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ClickSpark
      sparkColor="#5CD4C6"
      sparkCount={reduceMotion ? 0 : 6}
      sparkRadius={reduceMotion ? 0 : 14}
      sparkSize={reduceMotion ? 0 : 8}
      duration={reduceMotion ? 0 : 320}
      disabled={reduceMotion}
      className="min-h-screen bg-navy"
    >
      <Navbar scrolled={scrolled} />
      <Hero />
      <StickyMetricsSection />
      <ServicesSection />
      <ProjectsSection />
      <CreativeFooter />
    </ClickSpark>
  )
}

export default App
