import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'
import Button from '../ui/Button'
import logo from '../../assets/CoorDinQ Logo Wihtout Q Shadow .png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut', delay },
})

const typingPhrases = [
  'Build Scalable Software.',
  'Ship Faster, Together.',
  'Engineer the Future.',
  'Code with Confidence.',
]

function TypingText() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const currentPhrase = typingPhrases[phraseIndex]
  const displayText = currentPhrase.slice(0, charIndex)

  useEffect(() => {
    const speed = isDeleting ? 40 : 70
    const pause = !isDeleting && charIndex === currentPhrase.length ? 2000 : 0

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true)
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % typingPhrases.length)
      } else {
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1))
      }
    }, pause || speed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, currentPhrase])

  return (
    <span className="text-teal">
      {displayText}
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-teal ml-1 align-middle rounded-full"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Logo */}
        <motion.img
          src={logo}
          alt="CoorDinQ"
          className="w-48 sm:w-64 md:w-80 lg:w-full max-w-md md:max-w-lg"
          {...fadeUp(0)}
        />

        {/* Slogan with typing effect */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mt-6 md:mt-8 tracking-tight leading-tight whitespace-nowrap"
          {...fadeUp(0.25)}
        >
          We <TypingText />
        </motion.h1>

        {/* Summary */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/60 mt-4 md:mt-6 max-w-xl leading-relaxed px-2"
          {...fadeUp(0.45)}
        >
          We design and develop cutting-edge digital products, from robust web
          platforms to intelligent systems — delivering technology solutions
          that drive growth and innovation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10 justify-center w-full sm:w-auto px-4 sm:px-0"
          {...fadeUp(0.65)}
        >
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="secondary" size="lg">
            Our Projects
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
