import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import CardSwap, { Card } from '../reactbits/CardSwap'
import heroImage from '../../assets/hero.png'
import mainLogo from '../../assets/Main Logo.png'
import textLogo from '../../assets/CoorDinQ Logo Wihtout Q Shadow .png'

const projects = [
  {
    title: 'Pulse Commerce',
    category: 'Web Platform',
    image: heroImage,
    gradient: 'from-teal/30 via-navy-light/40 to-navy-dark/90',
  },
  {
    title: 'Orbit HQ',
    category: 'Custom Software',
    image: mainLogo,
    gradient: 'from-[#2D7D74]/40 via-[#243447]/50 to-[#111C27]/95',
  },
  {
    title: 'FleetFlow App',
    category: 'Mobile Application',
    image: null,
    gradient: 'from-[#3ABFB0]/35 via-[#2A9A8D]/30 to-[#111C27]/95',
  },
  {
    title: 'Peak Studio',
    category: 'UI/UX System',
    image: textLogo,
    gradient: 'from-[#415A77]/45 via-[#243447]/50 to-[#0E1721]/95',
  },
  {
    title: 'Signal Reach',
    category: 'Digital Marketing',
    image: null,
    gradient: 'from-[#2A9A8D]/45 via-[#1B2838]/55 to-[#111C27]/96',
  },
]

function ProjectCardContent({ project }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${project.gradient}`}>
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C1420] via-[#0C1420]/35 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/95">
          {project.category}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{project.title}</h3>
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const reduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const staticCards = (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.title}
          className="h-56 overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
        >
          <ProjectCardContent project={project} />
        </article>
      ))}
    </div>
  )

  return (
    <section id="projects" className="relative overflow-hidden bg-navy py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(65% 55% at 50% 18%, rgba(58, 191, 176, 0.15) 0%, rgba(27, 40, 56, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/90">
            Projects
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
            Selected product outcomes
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
            Fast-moving teams, clear product direction, and execution that turns
            concepts into dependable digital products.
          </p>
        </div>

        {!isDesktop || reduceMotion ? (
          staticCards
        ) : (
          <div className="mt-8 flex min-h-[460px] items-center justify-center">
            <CardSwap
              width={430}
              height={280}
              cardDistance={52}
              verticalDistance={56}
              delay={4400}
              pauseOnHover
              skewAmount={4}
            >
              {projects.map((project) => (
                <Card
                  key={project.title}
                  className="overflow-hidden rounded-2xl border border-white/12 bg-[#101B28] shadow-[0_20px_55px_rgba(0,0,0,0.38)]"
                >
                  <ProjectCardContent project={project} />
                </Card>
              ))}
            </CardSwap>
          </div>
        )}
      </div>
    </section>
  )
}
