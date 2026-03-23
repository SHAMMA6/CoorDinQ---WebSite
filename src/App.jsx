import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-navy">
      <Navbar scrolled={scrolled} />
      <Hero />
      {/* Spacer to allow scroll testing */}
      <div className="h-screen bg-navy" />
    </div>
  )
}

export default App
