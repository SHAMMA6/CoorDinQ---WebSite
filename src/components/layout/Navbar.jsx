import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import qLogo from '../../assets/Main Q.png'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ scrolled }) {
  const [hoveredQ, setHoveredQ] = useState(false)

  return (
    <motion.nav
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
    >
      <motion.div
        className="flex items-center gap-2 rounded-full px-3 py-2 border border-white/10"
        animate={{
          backgroundColor: scrolled ? 'rgba(36, 52, 71, 0.95)' : 'rgba(36, 52, 71, 0.7)',
          boxShadow: scrolled
            ? '0 20px 40px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Q Logo with spin animation */}
        <a
          href="#"
          className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden shrink-0 bg-navy-dark/50"
          onMouseEnter={() => setHoveredQ(true)}
          onMouseLeave={() => setHoveredQ(false)}
        >
          <motion.img
            src={qLogo}
            alt="Q"
            className="w-7 h-7 object-contain"
            animate={{ rotate: 360 }}
            transition={{
              duration: hoveredQ ? 2 : 12,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </a>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button - appears on scroll */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <Button variant="primary" size="sm" className="whitespace-nowrap ml-1">
                Contact Us
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  )
}
