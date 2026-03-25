import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Navbar from '../components/layout/Navbar'
import AnimatedBackground from '../components/sections/AnimatedBackground'
import CreativeFooter from '../components/sections/CreativeFooter'
import ElectricBorder from '../components/reactbits/ElectricBorder'
import amrImage from '../assets/amr.png'
import redseaImage from '../assets/redsea.png'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const fallbackProjects = [
  {
    id: 1,
    title: 'Dr. Amr El Yamany',
    category: 'Website',
    description:
      'Medical practice website for an orthopedic surgeon in Dubai—clear patient journey, consultation CTAs, and a trustworthy clinical brand presence.',
    tech: ['React', 'Next.js', 'Tailwind CSS'],
    gradient: 'from-[#0d7377]/35 via-[#1a252f]/50 to-[#111C27]/95',
    status: 'Live',
    year: 2025,
    client: 'Dr. Amr El Yamany',
    duration: '—',
    highlights: ['Patient-focused UX', 'Strong clinical trust cues', 'Performance-focused build'],
    featured_image: amrImage,
    images: [],
    video_url: null,
  },
  {
    id: 2,
    title: 'Red Sea Construction',
    category: 'Website',
    description:
      'Corporate web presence for a long-standing construction brand—bold typography, project storytelling, and a premium maritime-inspired visual language.',
    tech: ['React', 'Next.js', 'Tailwind CSS'],
    gradient: 'from-[#c9a227]/30 via-[#1a252f]/50 to-[#111C27]/95',
    status: 'Live',
    year: 2025,
    client: 'Red Sea Construction',
    duration: '—',
    highlights: ['Brand-led hero', 'Clear service paths', 'Responsive, fast delivery'],
    featured_image: redseaImage,
    images: [],
    video_url: null,
  },
]

/* ────────────────────────────────────────────────────────────────
   Project Card — links to detail page
   ──────────────────────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const hasFeaturedImage = project.featured_image || project.image_url
  const imageCount = project.images?.length || 0

  const linkContent = (
    <Link
      to={`/projects/${project.id}`}
      className="group relative block overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
    >
      {/* Image / Gradient hero */}
      <div className="relative h-64 w-full overflow-hidden md:h-72">
        {hasFeaturedImage ? (
          <img
            src={project.featured_image || project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${project.gradient} transition-all duration-700 group-hover:scale-105`} />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1420] via-[#0C1420]/45 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {project.video_url && (
            <span className="flex items-center gap-1 rounded-full border border-white/15 bg-navy-dark/60 px-2.5 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-sm">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Video
            </span>
          )}
          {imageCount > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-white/15 bg-navy-dark/60 px-2.5 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
              </svg>
              {imageCount}
            </span>
          )}
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
            project.status === 'Live'
              ? 'bg-teal/20 text-teal-light border border-teal/30'
              : 'bg-white/10 text-white/70 border border-white/15'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${project.status === 'Live' ? 'bg-teal-light animate-pulse' : 'bg-white/50'}`} />
            {project.status}
          </span>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-light/90">
            {project.category}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div className="bg-navy-dark/80 p-6 backdrop-blur-sm">
        <p className="text-sm leading-relaxed text-white/60 line-clamp-2">{project.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/55">
                {t}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/35">
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/30 transition-all duration-300 group-hover:border-teal/30 group-hover:bg-teal/10 group-hover:text-teal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <ElectricBorder color="#3ABFB0" speed={0.8} chaos={0.08} borderRadius={24}>
        {linkContent}
      </ElectricBorder>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Projects Page
   ──────────────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [filter, setFilter] = useState('All')
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  const categories = ['All', ...new Set(projects.map((p) => p.category))]

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setProjects(data)
      })
      .catch(() => { /* Use fallback data silently */ })
  }, [])

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter)

  return (
    <div className="min-h-screen bg-navy">
      <Navbar scrolled={scrolled} />

      {/* Hero header */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
        <AnimatedBackground />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 60% at 50% 20%, rgba(58, 191, 176, 0.12) 0%, rgba(27, 40, 56, 0) 70%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          {/* Back link */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Link to="/" className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition-colors hover:text-teal-light">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </motion.div>

          {/* Title block */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-light/90">
              Our Work
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
              Portfolio
            </h1>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-teal to-teal-light md:w-20" />
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
              A curated collection of digital products we've designed, engineered, and
              launched — each solving real problems with measurable outcomes.
            </p>
          </motion.div>

          {/* Category filter — centered */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap justify-center gap-2"
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
          <motion.div layout className="grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id || project.title}
                  project={project}
                  index={i}
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

      <CreativeFooter />
    </div>
  )
}
