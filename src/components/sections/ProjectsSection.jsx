import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CardSwap, { Card } from '../reactbits/CardSwap'
import Button from '../ui/Button'
import AutoScrollCards from '../ui/AutoScrollCards'
import amrImage from '../../assets/amr.png'
import redseaImage from '../../assets/redsea.png'

const projects = [
  {
    title: 'Dr. Amr El Yamany',
    category: 'Website',
    image: amrImage,
    gradient: 'from-[#0d7377]/35 via-[#1a252f]/50 to-[#0E1721]/95',
  },
  {
    title: 'Red Sea Construction',
    category: 'Website',
    image: redseaImage,
    gradient: 'from-[#c9a227]/25 via-[#1a252f]/45 to-[#0E1721]/95',
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
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-light/95">
          {project.category}
        </p>
        <h3 className="mt-1.5 text-lg font-black tracking-tight text-white">{project.title}</h3>
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const reduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  )
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : true,
  )

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 1024px)')
    const mobileMedia = window.matchMedia('(max-width: 767px)')
    const updateDesktop = () => setIsDesktop(desktopMedia.matches)
    const updateMobile = () => setIsMobile(mobileMedia.matches)
    updateDesktop()
    updateMobile()
    desktopMedia.addEventListener('change', updateDesktop)
    mobileMedia.addEventListener('change', updateMobile)
    return () => {
      desktopMedia.removeEventListener('change', updateDesktop)
      mobileMedia.removeEventListener('change', updateMobile)
    }
  }, [])

  const tabletCards = (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
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
        {isDesktop && !reduceMotion ? (
          <div className="flex items-center gap-12">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/90">
                Portfolio
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white lg:text-5xl">
                Selected product outcomes
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65 lg:text-base">
                Fast moving teams, clear product direction, and execution that turns
                concepts into dependable digital products.
              </p>
              <div className="mt-8">
                <Link to="/projects">
                  <Button variant="primary" size="lg">View Portfolio</Button>
                </Link>
              </div>
            </div>
            <div className="flex min-h-[460px] flex-1 items-center justify-center">
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
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/90">
                Portfolio
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white lg:text-5xl">
                Selected product outcomes
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
                Fast-moving teams, clear product direction, and execution that turns
                concepts into dependable digital products.
              </p>
              <div className="mt-6">
                <Link to="/projects">
                  <Button variant="primary" size="md">View Portfolio</Button>
                </Link>
              </div>
            </div>

            {isMobile ? (
              <div className="mt-10 -mx-6">
                <AutoScrollCards direction="right" speed={0.4} className="px-6">
                  {projects.map((project) => (
                    <article
                      key={project.title}
                      className="flex-shrink-0 w-64 h-64 overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                    >
                      <ProjectCardContent project={project} />
                    </article>
                  ))}
                </AutoScrollCards>
              </div>
            ) : (
              tabletCards
            )}
          </>
        )}
      </div>
    </section>
  )
}
