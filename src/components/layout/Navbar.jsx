import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import qLogo from '../../assets/Main Q.png'
import coordin from '../../assets/CoorDinQ Logo Wihtout Main Q and Q Shadow .png'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ scrolled }) {
  const [hoveredQ, setHoveredQ] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <motion.nav
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-fit"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <motion.div
          className="flex items-center gap-2 rounded-full px-3 py-2 border border-white/[0.08]"
          animate={{
            backgroundColor: scrolled ? 'rgba(20, 30, 44, 0.6)' : 'rgba(20, 30, 44, 0.35)',
            boxShadow: scrolled
              ? '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)' }}
        >
          {/* Logo: CoorDin text + circular Q */}
          <a
            href="#"
            className="flex items-center shrink-0"
            onMouseEnter={() => setHoveredQ(true)}
            onMouseLeave={() => setHoveredQ(false)}
          >
            {/* CoorDin text - collapses on scroll */}
            <motion.div
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
            </motion.div>

            {/* Circular Q - always visible */}
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0">
              <motion.img
                src={qLogo}
                alt="Q"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                animate={{ rotate: 360 }}
                transition={{
                  duration: hoveredQ ? 2 : 12,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
          </a>

          {/* Nav Links - desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col gap-[5px] px-3 py-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-[2px] bg-white/70 rounded-full origin-center"
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-[2px] bg-white/70 rounded-full"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-[2px] bg-white/70 rounded-full origin-center"
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>

          {/* CTA Button - appears on scroll (desktop only) */}
          <AnimatePresence>
            {scrolled && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="overflow-hidden hidden sm:block"
              >
                <Button variant="primary" size="sm" className="whitespace-nowrap ml-1">
                  Contact Us
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed top-[4.5rem] left-4 right-4 z-40 sm:hidden rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{ backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)' }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, backgroundColor: 'rgba(20, 30, 44, 0.75)' }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex flex-col py-3 px-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-base font-semibold text-white/70 hover:text-white transition-colors duration-200 rounded-xl hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="px-4 pt-2 pb-1">
                <Button variant="primary" size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
