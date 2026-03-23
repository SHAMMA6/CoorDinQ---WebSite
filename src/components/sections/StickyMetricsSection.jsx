import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

const MotionDiv = motion.div

const metrics = ['1,150 apps', '605,100 screens', '322,100 flows']

const timingConfig = {
  entryOffset: 110,
  phases: [
    { start: 0.3, end: 0.52 },
    { start: 0.55, end: 0.77 },
    { start: 0.8, end: 0.95 },
  ],
}

const desktopFloatingLogos = [
  {
    id: 'creme',
    label: 'CR',
    src: null,
    bg: '#0F1723',
    fg: '#F4F7FB',
    top: '16%',
    left: '12%',
    size: 94,
    drift: 18,
  },
  {
    id: 'dropbox',
    label: 'DB',
    src: null,
    bg: '#1A6DFF',
    fg: '#FFFFFF',
    top: '31%',
    left: '34%',
    size: 118,
    drift: 22,
  },
  {
    id: 'mails',
    label: 'MC',
    src: null,
    bg: '#FEE440',
    fg: '#212529',
    top: '60%',
    left: '20%',
    size: 100,
    drift: 16,
  },
  {
    id: 'air',
    label: 'AB',
    src: null,
    bg: '#FF3E6B',
    fg: '#FFF4F7',
    top: '66%',
    left: '78%',
    size: 108,
    drift: 20,
  },
  {
    id: 'apple',
    label: 'TV',
    src: null,
    bg: '#181D28',
    fg: '#F3F7FF',
    top: '80%',
    left: '88%',
    size: 102,
    drift: 24,
  },
  {
    id: 'orange',
    label: 'OR',
    src: null,
    bg: '#F5822E',
    fg: '#FFFFFF',
    top: '24%',
    left: '84%',
    size: 96,
    drift: 14,
  },
]

const mobileFloatingLogos = [
  {
    id: 'm-1-creme',
    label: 'CR',
    src: null,
    bg: '#0F1723',
    fg: '#F4F7FB',
    top: '18%',
    left: '-8%',
    size: 86,
    drift: 10,
  },
  {
    id: 'm-2-openai',
    label: 'AI',
    src: null,
    bg: '#EBEDF1',
    fg: '#1E2330',
    top: '21%',
    left: '54%',
    size: 82,
    drift: 8,
  },
  {
    id: 'm-3-orange',
    label: 'OR',
    src: null,
    bg: '#F5822E',
    fg: '#FFFFFF',
    top: '30%',
    left: '95%',
    size: 90,
    drift: 10,
  },
  {
    id: 'm-4-dropbox',
    label: 'DB',
    src: null,
    bg: '#1A6DFF',
    fg: '#FFFFFF',
    top: '35%',
    left: '27%',
    size: 92,
    drift: 12,
  },
  {
    id: 'm-5-dots',
    label: '::',
    src: null,
    bg: '#E8E7E5',
    fg: '#2A2A2A',
    top: '37%',
    left: '73%',
    size: 84,
    drift: 8,
  },
  {
    id: 'm-6-mail',
    label: 'MC',
    src: null,
    bg: '#FEE440',
    fg: '#212529',
    top: '63%',
    left: '13%',
    size: 96,
    drift: 12,
  },
  {
    id: 'm-7-air',
    label: 'AB',
    src: null,
    bg: '#FF3E6B',
    fg: '#FFF4F7',
    top: '65%',
    left: '95%',
    size: 98,
    drift: 12,
  },
  {
    id: 'm-8-studio',
    label: 'S',
    src: null,
    bg: '#2A2D7A',
    fg: '#FFB648',
    top: '79%',
    left: '-8%',
    size: 90,
    drift: 10,
  },
  {
    id: 'm-9-bolt',
    label: 'B',
    src: null,
    bg: '#83EA58',
    fg: '#121A25',
    top: '76%',
    left: '51%',
    size: 86,
    drift: 9,
  },
  {
    id: 'm-10-twitch',
    label: 'TW',
    src: null,
    bg: '#A361FF',
    fg: '#120D24',
    top: '85%',
    left: '23%',
    size: 84,
    drift: 9,
  },
  {
    id: 'm-11-nike',
    label: 'N',
    src: null,
    bg: '#F5F5F5',
    fg: '#0E1015',
    top: '88%',
    left: '75%',
    size: 80,
    drift: 8,
  },
  {
    id: 'm-12-tv',
    label: 'TV',
    src: null,
    bg: '#181D28',
    fg: '#F3F7FF',
    top: '80%',
    left: '95%',
    size: 92,
    drift: 11,
  },
]

function FloatingLogo({ logo, reduceMotion }) {
  const motionProps = reduceMotion
    ? {}
    : {
        animate: {
          y: [0, -logo.drift, 0],
          rotate: [0, 2, -1, 0],
        },
        transition: {
          duration: 7 + logo.drift * 0.08,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }

  return (
    <MotionDiv
      className="absolute z-20 flex items-center justify-center rounded-[22px] border border-white/10 shadow-[0_24px_55px_rgba(0,0,0,0.28)] backdrop-blur-sm"
      style={{
        top: logo.top,
        left: logo.left,
        width: `clamp(${Math.round(logo.size * 0.56)}px, ${Math.round(logo.size / 14)}vw, ${logo.size}px)`,
        height: `clamp(${Math.round(logo.size * 0.56)}px, ${Math.round(logo.size / 14)}vw, ${logo.size}px)`,
        backgroundColor: logo.bg,
        color: logo.fg,
      }}
      aria-hidden="true"
      {...motionProps}
    >
      {logo.src ? (
        <img
          src={logo.src}
          alt=""
          className="h-[62%] w-[62%] object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-[clamp(0.75rem,1.5vw,1.25rem)] font-bold tracking-[0.08em]">
          {logo.label}
        </span>
      )}
    </MotionDiv>
  )
}

function AnimatedMetricLine({ metric, index, scrollYProgress, reduceMotion }) {
  const phase = timingConfig.phases[index] ?? timingConfig.phases[timingConfig.phases.length - 1]
  const { start, end } = phase

  const lineYRaw = useTransform(scrollYProgress, [start, end, 1], [timingConfig.entryOffset, 0, 0])
  const lineOpacityRaw = useTransform(scrollYProgress, [0, start, end, 1], [0, 0, 1, 1])
  const lineY = useSpring(lineYRaw, { stiffness: 85, damping: 24, mass: 0.45 })
  const lineOpacity = useSpring(lineOpacityRaw, { stiffness: 80, damping: 22, mass: 0.5 })

  return (
    <MotionDiv
      className="whitespace-nowrap text-[clamp(0.95rem,6vw,1.45rem)] sm:text-[clamp(1.2rem,4.2vw,3.75rem)] font-black leading-[0.96] tracking-tight text-white"
      style={reduceMotion ? undefined : { y: lineY, opacity: lineOpacity }}
    >
      {metric}
    </MotionDiv>
  )
}

export default function StickyMetricsSection() {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.9])

  return (
    <section ref={sectionRef} className="relative h-[100svh] sm:h-[240vh] overflow-x-clip bg-navy" id="library">
      <div className="relative h-[100svh] overflow-hidden sm:sticky sm:top-0 sm:h-screen">
        <MotionDiv
          className="absolute inset-0"
          style={{
            opacity: glowOpacity,
            background:
              'radial-gradient(70% 55% at 50% 50%, rgba(58, 191, 176, 0.2) 0%, rgba(27, 40, 56, 0) 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'linear-gradient(110deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 45%, rgba(58,191,176,0.06) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="sm:hidden">
          {mobileFloatingLogos.map((logo) => (
            <FloatingLogo key={logo.id} logo={logo} reduceMotion={reduceMotion} />
          ))}
        </div>
        <div className="hidden sm:block">
          {desktopFloatingLogos.map((logo) => (
            <FloatingLogo key={logo.id} logo={logo} reduceMotion={reduceMotion} />
          ))}
        </div>

        <div className="relative z-30 mx-auto flex h-full w-full max-w-6xl items-center justify-center px-4 pt-0 sm:items-start sm:px-10 sm:pt-28 md:pt-36">
          <div className="w-full max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/90 sm:text-base sm:tracking-[0.16em]">
              A growing library of
            </p>

            <div
              className="relative mx-auto mt-4 h-[220px] w-full max-w-[94vw] overflow-hidden sm:h-[clamp(255px,31vw,420px)] sm:max-w-5xl"
            >
              <div className="flex h-full flex-col items-center justify-center gap-2 sm:hidden">
                {metrics.map((metric) => (
                  <p
                    key={metric}
                    className="whitespace-nowrap text-[clamp(1.2rem,7.8vw,2rem)] font-black leading-[1.02] tracking-tight text-white"
                  >
                    {metric}
                  </p>
                ))}
              </div>

              <MotionDiv className="absolute left-1/2 top-0 hidden -translate-x-1/2 flex-col items-center gap-[clamp(0.95rem,2.2vw,1.7rem)] sm:flex">
                {metrics.map((metric, index) => (
                  <AnimatedMetricLine
                    key={metric}
                    metric={metric}
                    index={index}
                    scrollYProgress={scrollYProgress}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
