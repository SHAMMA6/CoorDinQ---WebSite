import { motion } from 'framer-motion'

const orbs = [
  {
    size: 600,
    color: 'rgba(58, 191, 176, 0.12)',
    initialX: '-10%',
    initialY: '-20%',
    animate: {
      x: ['0%', '15%', '-5%', '0%'],
      y: ['0%', '-10%', '12%', '0%'],
      scale: [1, 1.2, 0.9, 1],
    },
    duration: 22,
  },
  {
    size: 500,
    color: 'rgba(58, 191, 176, 0.08)',
    initialX: '60%',
    initialY: '10%',
    animate: {
      x: ['0%', '-12%', '8%', '0%'],
      y: ['0%', '15%', '-8%', '0%'],
      scale: [1, 0.85, 1.15, 1],
    },
    duration: 18,
  },
  {
    size: 450,
    color: 'rgba(58, 191, 176, 0.06)',
    initialX: '30%',
    initialY: '60%',
    animate: {
      x: ['0%', '10%', '-15%', '0%'],
      y: ['0%', '-12%', '5%', '0%'],
      scale: [1, 1.1, 0.95, 1],
    },
    duration: 25,
  },
  {
    size: 350,
    color: 'rgba(92, 212, 198, 0.07)',
    initialX: '-5%',
    initialY: '50%',
    animate: {
      x: ['0%', '20%', '-8%', '0%'],
      y: ['0%', '-15%', '10%', '0%'],
      scale: [1, 1.15, 0.9, 1],
    },
    duration: 20,
  },
]

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Base radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #243447 0%, #1B2838 70%)',
        }}
      />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.initialX,
            top: orb.initialY,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(17, 28, 39, 0.7) 100%)',
        }}
      />
    </div>
  )
}
