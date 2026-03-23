import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'
import Button from '../ui/Button'
import logo from '../../assets/CoorDinQ Logo Wihtout Q Shadow .png'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut', delay },
})

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Logo */}
        <motion.img
          src={logo}
          alt="CoorDinQ"
          className="w-full max-w-md md:max-w-lg"
          {...fadeUp(0)}
        />

        {/* Slogan */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mt-8 tracking-tight leading-tight"
          {...fadeUp(0.25)}
        >
          Coordinate. Collaborate.
          <br />
          <span className="text-teal">Conquer.</span>
        </motion.h1>

        {/* Summary */}
        <motion.p
          className="text-base md:text-lg text-white/60 mt-6 max-w-xl leading-relaxed"
          {...fadeUp(0.45)}
        >
          Empowering teams with intelligent coordination tools that streamline
          workflows, enhance collaboration, and deliver results that matter.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mt-10 justify-center"
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
