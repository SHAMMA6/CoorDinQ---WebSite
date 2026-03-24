import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import StickyMetricsSection from './components/sections/StickyMetricsSection'
import ServicesSection from './components/sections/ServicesSection'
import ProjectsSection from './components/sections/ProjectsSection'
import CreativeFooter from './components/sections/CreativeFooter'
import ClickSpark from './components/reactbits/ClickSpark'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-teal/30 bg-gradient-to-br from-teal to-teal-dark shadow-[0_0_24px_rgba(58,191,176,0.35)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(58,191,176,0.55)]"
          aria-label="Back to top"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111C27"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

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
      <BackToTop />
    </ClickSpark>
  )
}

export default App
