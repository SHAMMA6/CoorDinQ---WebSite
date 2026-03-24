import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import qLogo from '../../assets/Main Q.png'
import coordin from '../../assets/CoorDinQ Logo Wihtout Main Q and Q Shadow .png'

const navLinks = [
  { label: 'Home', to: '/', hash: '#home' },
  { label: 'Projects', to: '/projects' },
]

const MotionNav = motion.nav
const MotionDiv = motion.div
const MotionSpan = motion.span

function NavLink({ link, className, onClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    onClick?.()

    if (link.to === '/' && link.hash) {
      if (location.pathname === '/') {
        document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => {
          document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      navigate(link.to)
      window.scrollTo(0, 0)
    }
  }

  return (
    <a href={link.to} onClick={handleClick} className={className}>
      {link.label}
    </a>
  )
}

function ContactButton({ className, onClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    onClick?.()

    if (location.pathname === '/') {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <a href="/#contact" onClick={handleClick} className={className}>
      <Button variant="primary" size="sm" className="whitespace-nowrap ml-1">
        Contact Us
      </Button>
    </a>
  )
}

export default function Navbar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <MotionNav
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-fit"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <MotionDiv
          className="flex items-center gap-2 rounded-full px-3 py-2 border border-white/[0.08] navbar-glass"
          animate={{
            backgroundColor: scrolled ? 'rgba(20, 30, 44, 0.6)' : 'rgba(20, 30, 44, 0.35)',
            boxShadow: scrolled
              ? '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Logo: CoorDin text + circular Q */}
          <Link
            to="/"
            className="group/logo flex items-center shrink-0"
          >
            {/* CoorDin text - collapses on scroll */}
            <MotionDiv
              className="overflow-hidden flex items-center"
              animate={{
                width: scrolled ? 0 : 'auto',
                opacity: scrolled ? 0 : 1,
                marginRight: scrolled ? 0 : 4,
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <img
                src={coordin}
                alt="CoorDin"
                className="h-5 sm:h-6 object-contain object-left"
              />
            </MotionDiv>

            {/* Circular Q - always visible, CSS rotation for GPU perf */}
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0">
              <img
                src={qLogo}
                alt="Q"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain q-logo-spin"
              />
            </div>
          </Link>

          {/* Nav Links - desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                link={link}
                className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
              />
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col gap-[5px] px-3 py-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <MotionSpan
              className="block w-5 h-[2px] bg-white/70 rounded-full origin-center"
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <MotionSpan
              className="block w-5 h-[2px] bg-white/70 rounded-full"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <MotionSpan
              className="block w-5 h-[2px] bg-white/70 rounded-full origin-center"
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>

          {/* CTA Button - appears on scroll (desktop only) */}
          <AnimatePresence>
            {scrolled && (
              <MotionDiv
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="overflow-hidden hidden sm:block"
              >
                <ContactButton />
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionDiv>
      </MotionNav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MotionDiv
            className="fixed top-[4.5rem] left-4 right-4 z-40 sm:hidden rounded-2xl border border-white/[0.08] overflow-hidden navbar-glass"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, backgroundColor: 'rgba(20, 30, 44, 0.75)' }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex flex-col py-3 px-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    link={link}
                    className="block px-4 py-3 text-base font-semibold text-white/70 hover:text-white transition-colors duration-200 rounded-xl hover:bg-white/5"
                    onClick={() => setMobileOpen(false)}
                  />
                </motion.div>
              ))}
              <div className="px-4 pt-2 pb-1">
                <ContactButton
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                />
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  )
}
