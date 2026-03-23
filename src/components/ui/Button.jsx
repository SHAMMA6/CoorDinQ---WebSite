import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MotionButton = motion.button
const MotionSpan = motion.span

const variants = {
  primary: 'bg-teal text-navy-dark font-semibold hover:bg-teal-dark',
  secondary: 'bg-white/10 text-white border border-white/20 hover:border-white/30 hover:bg-white/5',
}

const sizes = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-2.5 text-base',
  lg: 'px-9 py-3.5 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { x, y, id }])
  }

  const handleMouseLeave = () => {
    setTimeout(() => setRipples([]), 600)
  }

  return (
    <MotionButton
      className={`relative overflow-hidden rounded-full cursor-pointer transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <MotionSpan
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
              background: variant === 'primary'
                ? 'rgba(27, 40, 56, 0.2)'
                : 'rgba(255, 255, 255, 0.2)',
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 12, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
            }}
          />
        ))}
      </AnimatePresence>
    </MotionButton>
  )
}
