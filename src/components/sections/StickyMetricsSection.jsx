import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

import reactIcon from '../../assets/tech-logos/react.svg'
import dotnetIcon from '../../assets/tech-logos/dotnet.svg'
import typescriptIcon from '../../assets/tech-logos/typescript.svg'
import figmaIcon from '../../assets/tech-logos/figma.svg'
import tailwindIcon from '../../assets/tech-logos/tailwindcss.svg'
import viteIcon from '../../assets/tech-logos/vite.svg'
import nextIcon from '../../assets/tech-logos/nextdotjs.svg'
import nodeIcon from '../../assets/tech-logos/nodedotjs.svg'
import storybookIcon from '../../assets/tech-logos/storybook.svg'
import graphqlIcon from '../../assets/tech-logos/graphql.svg'
import prismaIcon from '../../assets/tech-logos/prisma.svg'
import muiIcon from '../../assets/tech-logos/mui.svg'

const MotionDiv = motion.div

const desktopMetrics = ['5 systems', '10 websites', '6 apps']
const mobileMetrics = ['5 systems', '10 websites', '6 apps']

const timingConfig = {
  entryOffset: 110,
  phases: [
    { start: 0.3, end: 0.52 },
    { start: 0.55, end: 0.77 },
    { start: 0.8, end: 0.95 },
  ],
}

// Desktop: fewer tiles, identical pixel size + shape (fixed box, uniform radius)
const DESKTOP_LOGO_PX = 88

const desktopFloatingLogos = [
  {
    id: 'desk-react',
    label: 'React',
    src: reactIcon,
    bg: '#EEF2F7',
    fg: '#087EA4',
    top: '12%',
    left: '5%',
    size: DESKTOP_LOGO_PX,
    drift: 9,
  },
  {
    id: 'desk-typescript',
    label: 'TypeScript',
    src: typescriptIcon,
    bg: '#E8EEF8',
    fg: '#3178C6',
    top: '18%',
    right: '6%',
    size: DESKTOP_LOGO_PX,
    drift: 9,
  },
  {
    id: 'desk-vite',
    label: 'Vite',
    src: viteIcon,
    bg: '#EEF0FF',
    fg: '#646CFF',
    top: '8%',
    right: '22%',
    size: DESKTOP_LOGO_PX,
    drift: 10,
  },
  {
    id: 'desk-dotnet',
    label: '.NET',
    src: dotnetIcon,
    bg: '#EDE9F7',
    fg: '#512BD4',
    top: '44%',
    left: '4%',
    size: DESKTOP_LOGO_PX,
    drift: 8,
  },
  {
    id: 'desk-figma',
    label: 'Figma',
    src: figmaIcon,
    bg: '#F7EBE6',
    fg: '#F24E1E',
    top: '54%',
    right: '5%',
    size: DESKTOP_LOGO_PX,
    drift: 9,
  },
  {
    id: 'desk-tailwind',
    label: 'Tailwind CSS',
    src: tailwindIcon,
    bg: '#E8F7F7',
    fg: '#06B6D4',
    top: '76%',
    left: '8%',
    size: DESKTOP_LOGO_PX,
    drift: 8,
  },
  // Upper gap (between nav and React cluster)
  {
    id: 'desk-next',
    label: 'Next.js',
    src: nextIcon,
    bg: '#F2F2F2',
    fg: '#000000',
    top: '3%',
    left: '19%',
    size: DESKTOP_LOGO_PX,
    drift: 8,
  },
  // Bottom row — spaced between lower-left Tailwind and lower-right Figma
  {
    id: 'desk-node',
    label: 'Node.js',
    src: nodeIcon,
    bg: '#EAF6EC',
    fg: '#339933',
    top: '88%',
    left: '24%',
    size: DESKTOP_LOGO_PX,
    drift: 9,
  },
  {
    id: 'desk-storybook',
    label: 'Storybook',
    src: storybookIcon,
    bg: '#F7EDF2',
    fg: '#FF4785',
    top: '90%',
    left: '46%',
    size: DESKTOP_LOGO_PX,
    drift: 8,
  },
  {
    id: 'desk-graphql',
    label: 'GraphQL',
    src: graphqlIcon,
    bg: '#F5EAF3',
    fg: '#E10098',
    top: '88%',
    left: '68%',
    size: DESKTOP_LOGO_PX,
    drift: 9,
  },
]

const mobileFloatingLogos = [
  {
    id: 'm-tech-react',
    label: 'React',
    src: reactIcon,
    bg: '#E8F4FC',
    fg: '#087EA4',
    top: '18%',
    left: '-8%',
    size: 86,
    drift: 10,
  },
  {
    id: 'm-tech-dotnet',
    label: '.NET',
    src: dotnetIcon,
    bg: '#EDE9F7',
    fg: '#512BD4',
    top: '21%',
    left: '54%',
    size: 82,
    drift: 8,
  },
  {
    id: 'm-tech-typescript',
    label: 'TypeScript',
    src: typescriptIcon,
    bg: '#E8EEF8',
    fg: '#3178C6',
    top: '30%',
    left: '95%',
    size: 90,
    drift: 10,
  },
  {
    id: 'm-tech-figma',
    label: 'Figma',
    src: figmaIcon,
    bg: '#F5EBE8',
    fg: '#F24E1E',
    top: '35%',
    left: '27%',
    size: 92,
    drift: 12,
  },
  {
    id: 'm-tech-tailwind',
    label: 'Tailwind CSS',
    src: tailwindIcon,
    bg: '#E8F7F7',
    fg: '#06B6D4',
    top: '37%',
    left: '73%',
    size: 84,
    drift: 8,
  },
  {
    id: 'm-tech-node',
    label: 'Node.js',
    src: nodeIcon,
    bg: '#E8F5E9',
    fg: '#339933',
    top: '63%',
    left: '13%',
    size: 96,
    drift: 12,
  },
  {
    id: 'm-tech-storybook',
    label: 'Storybook',
    src: storybookIcon,
    bg: '#F5E8F0',
    fg: '#FF4785',
    top: '65%',
    left: '95%',
    size: 98,
    drift: 12,
  },
  {
    id: 'm-tech-vite',
    label: 'Vite',
    src: viteIcon,
    bg: '#EDEFFF',
    fg: '#646CFF',
    top: '79%',
    left: '-8%',
    size: 90,
    drift: 10,
  },
  {
    id: 'm-tech-next',
    label: 'Next.js',
    src: nextIcon,
    bg: '#ECECEC',
    fg: '#000000',
    top: '76%',
    left: '51%',
    size: 86,
    drift: 9,
  },
  {
    id: 'm-tech-graphql',
    label: 'GraphQL',
    src: graphqlIcon,
    bg: '#F3E8F5',
    fg: '#E10098',
    top: '85%',
    left: '23%',
    size: 84,
    drift: 9,
  },
  {
    id: 'm-tech-prisma',
    label: 'Prisma',
    src: prismaIcon,
    bg: '#E8EAF5',
    fg: '#2D3748',
    top: '88%',
    left: '75%',
    size: 80,
    drift: 8,
  },
  {
    id: 'm-tech-mui',
    label: 'MUI',
    src: muiIcon,
    bg: '#E3F2FD',
    fg: '#007FFF',
    top: '80%',
    left: '95%',
    size: 92,
    drift: 11,
  },
]

function FloatingLogo({ logo, reduceMotion, vwDivisor = 14, uniformSize = false }) {
  // Use CSS animation instead of framer-motion for compositor-thread performance
  const animStyle = reduceMotion
    ? {}
    : {
        '--drift': logo.drift,
        animation: `float-logo ${7 + logo.drift * 0.08}s ease-in-out infinite`,
        willChange: 'transform',
      }

  const vw = Math.round(logo.size / vwDivisor)
  const minPx = Math.round(logo.size * 0.56)
  const horizontal =
    logo.right != null
      ? { left: 'auto', right: logo.right }
      : { left: logo.left, right: 'auto' }

  const boxSize = uniformSize
    ? { width: logo.size, height: logo.size }
    : {
        width: `clamp(${minPx}px, ${vw}vw, ${logo.size}px)`,
        height: `clamp(${minPx}px, ${vw}vw, ${logo.size}px)`,
      }

  return (
    <div
      className="absolute z-20 flex aspect-square shrink-0 items-center justify-center rounded-[22px] border border-white/15 shadow-[0_18px_42px_rgba(0,0,0,0.34)] sm:rounded-[22px] sm:border-white/20 sm:shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
      style={{
        top: logo.top,
        ...horizontal,
        ...boxSize,
        backgroundColor: logo.bg,
        color: logo.fg,
        opacity: logo.opacity ?? 1,
        ...(logo.zIndex != null ? { zIndex: logo.zIndex } : {}),
        ...animStyle,
      }}
      aria-hidden="true"
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
    </div>
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
      className="whitespace-nowrap text-[clamp(0.95rem,6vw,1.45rem)] sm:text-[clamp(1.5rem,5.5vw,4.6rem)] sm:leading-[0.9] font-black leading-[0.96] tracking-[-0.02em] text-white"
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
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          {desktopFloatingLogos.map((logo) => (
            <FloatingLogo key={logo.id} logo={logo} reduceMotion={reduceMotion} uniformSize />
          ))}
        </div>

        <div className="relative z-30 mx-auto flex h-full w-full max-w-6xl items-center justify-center px-4 pt-0 sm:items-start sm:px-10 sm:pt-28 md:pt-36">
          <div className="w-full max-w-5xl pt-20 text-center sm:pt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/90 sm:text-[clamp(0.95rem,1.35vw,1.125rem)] sm:font-medium sm:tracking-[0.12em]">
              A growing library of
            </p>

            <div
              className="relative mx-auto mt-2 h-auto w-full max-w-[94vw] overflow-hidden sm:mt-4 sm:h-[clamp(280px,36vw,500px)] sm:max-w-5xl"
            >
              <div className="flex flex-col items-center justify-start gap-1.5 sm:hidden">
                {mobileMetrics.map((metric) => (
                  <p
                    key={metric}
                    className="whitespace-nowrap text-[clamp(1.2rem,7.8vw,2rem)] font-black leading-[1.02] tracking-tight text-white"
                  >
                    {metric}
                  </p>
                ))}
              </div>

              <MotionDiv className="absolute left-1/2 top-0 hidden -translate-x-1/2 flex-col items-center gap-[clamp(0.5rem,1.5vw,1.1rem)] sm:flex">
                {desktopMetrics.map((metric, index) => (
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
