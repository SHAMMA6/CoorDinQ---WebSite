import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import ClickSpark from './components/reactbits/ClickSpark'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProjectForm from './pages/admin/AdminProjectForm'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
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
  const reduceMotion = useReducedMotion()
  // Disable ClickSpark on mobile — full-page canvas + touch overhead hurts FPS
  const [isMobile] = useState(() =>
    typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)
  )
  const sparkDisabled = reduceMotion || isMobile

  return (
    <BrowserRouter>
      <ClickSpark
        sparkColor="#5CD4C6"
        sparkCount={sparkDisabled ? 0 : 6}
        sparkRadius={sparkDisabled ? 0 : 14}
        sparkSize={sparkDisabled ? 0 : 8}
        duration={sparkDisabled ? 0 : 320}
        disabled={sparkDisabled}
        className="min-h-screen bg-navy"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/projects/new" element={<AdminProjectForm />} />
          <Route path="/admin/projects/:id/edit" element={<AdminProjectForm />} />
        </Routes>
        <BackToTop />
      </ClickSpark>
    </BrowserRouter>
  )
}

export default App
