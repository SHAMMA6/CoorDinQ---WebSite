import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Navbar from '../components/layout/Navbar'
import AnimatedBackground from '../components/sections/AnimatedBackground'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const fallbackProjects = [
  {
    id: 1,
    title: 'Pulse Commerce',
    category: 'Web Platform',
    description: 'A high-performance e-commerce platform built for scale. Features real-time inventory management, AI-powered recommendations, and seamless payment integration across 40+ countries.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
    gradient: 'from-teal/30 via-navy-light/40 to-navy-dark/90',
    status: 'Live',
    year: 2025,
    client: 'Pulse Retail Inc.',
    duration: '6 months',
    highlights: ['3x faster load times', '40% increase in conversions', '99.9% uptime'],
  },
  {
    id: 2,
    title: 'Orbit HQ',
    category: 'Custom Software',
    description: 'Enterprise workspace management platform that unifies team communication, project tracking, and resource allocation into a single intelligent dashboard.',
    tech: ['Next.js', 'TypeScript', 'GraphQL', 'PostgreSQL'],
    gradient: 'from-[#2D7D74]/40 via-[#243447]/50 to-[#111C27]/95',
    status: 'Live',
    year: 2024,
    client: 'Orbit Technologies',
    duration: '8 months',
    highlights: ['500+ daily active users', '60% reduction in meeting time', 'Custom analytics engine'],
  },
  {
    id: 3,
    title: 'FleetFlow App',
    category: 'Mobile Application',
    description: 'Real-time fleet management mobile app with GPS tracking, route optimization, and predictive maintenance alerts for logistics companies.',
    tech: ['React Native', 'Express', 'MongoDB', 'Socket.io', 'Google Maps API'],
    gradient: 'from-[#3ABFB0]/35 via-[#2A9A8D]/30 to-[#111C27]/95',
    status: 'Live',
    year: 2025,
    client: 'FleetFlow Logistics',
    duration: '5 months',
    highlights: ['Real-time GPS tracking', '25% fuel cost reduction', '10K+ deliveries tracked daily'],
  },
  {
    id: 4,
    title: 'Peak Studio',
    category: 'UI/UX System',
    description: 'A comprehensive design system and component library powering 12 products. Includes Figma integration, accessibility-first components, and automated documentation.',
    tech: ['Figma', 'Storybook', 'React', 'Tailwind CSS', 'Chromatic'],
    gradient: 'from-[#415A77]/45 via-[#243447]/50 to-[#0E1721]/95',
    status: 'Live',
    year: 2024,
    client: 'Peak Digital Group',
    duration: '4 months',
    highlights: ['200+ reusable components', 'WCAG 2.1 AA compliant', '70% faster design-to-dev handoff'],
  },
  {
    id: 5,
    title: 'Signal Reach',
    category: 'Digital Marketing',
    description: 'Full-funnel digital marketing platform with campaign automation, audience segmentation, multi-channel attribution, and real-time performance dashboards.',
    tech: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Google Ads API'],
    gradient: 'from-[#2A9A8D]/45 via-[#1B2838]/55 to-[#111C27]/96',
    status: 'In Progress',
    year: 2025,
    client: 'Signal Media Co.',
    duration: '7 months',
    highlights: ['4.2x ROAS average', 'Multi-channel attribution', 'AI-driven audience targeting'],
  },
]

function ProjectCard({ project, index, onSelect, isSelected }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      onClick={() => onSelect(project)}
      className={`group relative cursor-pointer overflow-hidden rounded-3xl border transition-all duration-500 ${
        isSelected
          ? 'border-teal/40 shadow-[0_0_40px_rgba(58,191,176,0.2)]'
          : 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-white/20 hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)]'
      }`}
    >
      <div className={`relative h-64 w-full overflow-hidden bg-gradient-to-br ${project.gradient} md:h-72`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1420] via-[#0C1420]/40 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            project.status === 'Live'
              ? 'bg-teal/20 text-teal-light border border-teal/30'
              : 'bg-white/10 text-white/70 border border-white/15'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${project.status === 'Live' ? 'bg-teal-light' : 'bg-white/50'}`} />
            {project.status}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-light/90">
            {project.category}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
            {project.title}
          </h3>
        </div>
      </div>

      <div className="bg-navy-dark/80 p-6 backdrop-blur-sm">
        <p className="text-sm leading-relaxed text-white/65 line-clamp-2">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60">
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/40">
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(58, 191, 176, 0.06), transparent 40%)' }}
      />
    </motion.article>
  )
}

function ProjectDetail({ project, onClose }) {
  if (!project) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/12 bg-gradient-to-b from-navy-light/95 to-navy-dark/98 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        {/* Header gradient */}
        <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${project.gradient} md:h-56`}>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-light/95 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-navy-dark/50 text-white/70 backdrop-blur-sm transition-colors hover:bg-navy-dark/80 hover:text-white cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/90">
                {project.category}
              </p>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                project.status === 'Live'
                  ? 'bg-teal/20 text-teal-light border border-teal/30'
                  : 'bg-white/10 text-white/70 border border-white/15'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${project.status === 'Live' ? 'bg-teal-light' : 'bg-white/50'}`} />
                {project.status}
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">{project.title}</h2>
          </div>
        </div>

        <div className="p-8">
          {/* Meta info */}
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Client</p>
              <p className="mt-1 text-sm font-semibold text-white/80">{project.client}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Year</p>
              <p className="mt-1 text-sm font-semibold text-white/80">{project.year}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Duration</p>
              <p className="mt-1 text-sm font-semibold text-white/80">{project.duration}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/80">About the Project</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{project.description}</p>
          </div>

          {/* Highlights */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/80">Key Results</h3>
            <div className="mt-3 space-y-2">
              {project.highlights.map((h) => (
                <div key={h} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/15">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5CD4C6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-white/70">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-light/80">Tech Stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full border border-teal/20 bg-teal/[0.06] px-4 py-1.5 text-xs font-medium text-teal-light/80">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('All')
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  const categories = ['All', ...new Set(fallbackProjects.map((p) => p.category))]

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Try to fetch from API, fallback to static data
  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setProjects(data)
      })
      .catch(() => {
        // Use fallback data silently
      })
  }, [])

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter)

  return (
    <div className="min-h-screen bg-navy">
      <Navbar scrolled={scrolled} />

      {/* Hero header */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <AnimatedBackground />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(70% 60% at 50% 20%, rgba(58, 191, 176, 0.12) 0%, rgba(27, 40, 56, 0) 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Link to="/" className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition-colors hover:text-teal-light">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/90">
              Our Work
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
              Projects
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-lg">
              A curated collection of digital products we've designed, engineered, and
              launched — each built to solve real problems and deliver measurable outcomes.
            </p>
          </motion.div>

          {/* Category filter */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`cursor-pointer rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  filter === cat
                    ? 'bg-teal text-navy-dark shadow-[0_0_20px_rgba(58,191,176,0.3)]'
                    : 'border border-white/12 bg-white/[0.04] text-white/60 hover:border-white/25 hover:text-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="relative pb-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id || project.title}
                  project={project}
                  index={i}
                  onSelect={setSelectedProject}
                  isSelected={selectedProject?.id === project.id}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-white/40">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="relative border-t border-white/8 bg-navy-dark py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(50% 80% at 50% 0%, rgba(58, 191, 176, 0.1) 0%, rgba(17, 28, 39, 0) 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Have a project in mind?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
            Let's discuss how we can bring your vision to life with clean engineering
            and intentional design.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link to="/#contact">
              <Button variant="primary" size="lg">Get in Touch</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="lg">Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
