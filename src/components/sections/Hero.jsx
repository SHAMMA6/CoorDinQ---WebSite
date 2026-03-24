import { useEffect, useState, lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AnimatedBackground from './AnimatedBackground'
import Button from '../ui/Button'
import logo from '../../assets/CoorDinQ Logo Wihtout Q Shadow .png'

// Lazy-load WebGL LightRays — skip entirely on mobile
const LightRays = lazy(() => import('../reactbits/LightRays'))

const MotionImg = motion.img
const MotionH1 = motion.h1
const MotionP = motion.p
const MotionDiv = motion.div

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
      <span
        className="ml-1 inline-block h-[1em] w-[3px] rounded-full bg-teal align-middle typing-cursor"
      />
    </span>
  )
}

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Only enable WebGL LightRays on desktop (768px+)
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <AnimatedBackground />
      {!reduceMotion && isDesktop && (
        <Suspense fallback={null}>
          <div className="pointer-events-none absolute inset-0 z-[4] opacity-70">
            <LightRays
              raysOrigin="top-center"
              raysColor="#3ABFB0"
              raysSpeed={0.75}
              lightSpread={1.1}
              rayLength={1.3}
              pulsating={false}
              fadeDistance={1.05}
              saturation={1.1}
              followMouse
              mouseInfluence={0.05}
              noiseAmount={0.03}
              distortion={0.04}
            />
          </div>
        </Suspense>
      )}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <MotionImg
          src={logo}
          alt="CoorDinQ"
          className="w-48 max-w-md sm:w-64 md:w-80 md:max-w-lg lg:w-full"
          {...fadeUp(0)}
        />

        <MotionH1
          className="mt-6 whitespace-nowrap text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:mt-8 md:text-5xl lg:text-6xl"
          {...fadeUp(0.25)}
        >
          We <TypingText />
        </MotionH1>

        <MotionP
          className="mt-4 max-w-xl px-2 text-sm leading-relaxed text-white/60 sm:text-base md:mt-6 md:text-lg"
          {...fadeUp(0.45)}
        >
          We design and develop cutting-edge digital products, from robust web
          platforms to intelligent systems - delivering technology solutions
          that drive growth and innovation.
        </MotionP>

        <MotionDiv
          className="mt-8 flex w-full flex-col justify-center gap-3 px-4 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4 sm:px-0"
          {...fadeUp(0.65)}
        >
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </a>
          <Link to="/projects">
            <Button variant="secondary" size="lg">
              Our Projects
            </Button>
          </Link>
        </MotionDiv>
      </div>
    </section>
  )
}
