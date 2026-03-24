import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut', delay },
})

/* ────────────────────────────────────────────────────────────────
   Image Lightbox
   ──────────────────────────────────────────────────────────────── */
function ImageLightbox({ images, current, onClose, onPrev, onNext }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-dark/95 backdrop-blur-2xl"
      onClick={onClose}
    >
      {/* Close */}
      <button onClick={onClose} className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}

      <img
        src={images[current]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_0_80px_rgba(0,0,0,0.6)]"
      />

      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {images.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-teal' : 'w-1.5 bg-white/25'}`} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Project Detail Page
   ──────────────────────────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const [project, setProject] = useState(null)
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [id])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API_URL}/projects/${id}`).then((r) => r.json()),
      fetch(`${API_URL}/projects`).then((r) => r.json()),
    ])
      .then(([proj, all]) => {
        setProject(proj)
        setAllProjects(all)
      })
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  // Navigation
  const currentIndex = allProjects.findIndex((p) => p.id === Number(id))
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  // Images
  const hasFeaturedImage = project?.featured_image || project?.image_url
  const allImages = [
    ...(hasFeaturedImage ? [project.featured_image || project.image_url] : []),
    ...(project?.images || []),
  ]

  // Video helpers
  const isYouTubeUrl = (url) => /youtube\.com|youtu\.be/i.test(url || '')
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : url
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal border-t-transparent" />
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="min-h-screen bg-navy">
      <Navbar scrolled={scrolled} />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden pt-24 md:pt-28">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 50% at 50% 0%, rgba(58, 191, 176, 0.1) 0%, rgba(27, 40, 56, 0) 70%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
          {/* Breadcrumb */}
          <motion.div {...(reduceMotion ? {} : fadeUp(0))}>
            <Link to="/projects" className="group inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition-colors hover:text-teal-light">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              All Portfolio
            </Link>
          </motion.div>

          {/* Title area */}
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div {...(reduceMotion ? {} : fadeUp(0.1))} className="max-w-2xl">
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/90">
                  {project.category}
                </p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  project.status === 'Live'
                    ? 'bg-teal/15 text-teal-light border border-teal/25'
                    : 'bg-white/8 text-white/60 border border-white/12'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${project.status === 'Live' ? 'bg-teal-light animate-pulse' : 'bg-white/50'}`} />
                  {project.status}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                {project.title}
              </h1>
            </motion.div>

            {/* Meta pills */}
            <motion.div {...(reduceMotion ? {} : fadeUp(0.2))} className="flex flex-wrap gap-3 md:flex-nowrap">
              {project.client && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Client</p>
                  <p className="mt-0.5 text-sm font-semibold text-white/85">{project.client}</p>
                </div>
              )}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Year</p>
                <p className="mt-0.5 text-sm font-semibold text-white/85">{project.year}</p>
              </div>
              {project.duration && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Duration</p>
                  <p className="mt-0.5 text-sm font-semibold text-white/85">{project.duration}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Featured image */}
        <motion.div
          {...(reduceMotion ? {} : fadeUp(0.25))}
          className="mx-auto mt-10 max-w-6xl px-6 md:px-10"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            {hasFeaturedImage ? (
              <img
                src={project.featured_image || project.image_url}
                alt={project.title}
                className="w-full object-cover"
                style={{ maxHeight: '520px' }}
              />
            ) : (
              <div className={`h-72 w-full bg-gradient-to-br ${project.gradient} md:h-96`} />
            )}
          </div>
        </motion.div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_340px]">
            {/* Left column */}
            <div>
              {/* Description */}
              <motion.div {...(reduceMotion ? {} : fadeUp(0.1))}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/80">
                  About the Project
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg md:leading-relaxed">
                  {project.description}
                </p>
              </motion.div>

              {/* ── Gallery ──────────────────────────────── */}
              {allImages.length > 1 && (
                <motion.div {...(reduceMotion ? {} : fadeUp(0.2))} className="mt-14">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/80">
                    Gallery
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox(i)}
                        className="group/img relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/8 transition-all duration-300 hover:border-teal/30 hover:shadow-[0_0_30px_rgba(58,191,176,0.1)] cursor-pointer"
                      >
                        <img
                          src={img}
                          alt={`${project.title} — ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-navy-dark/0 transition-colors duration-300 group-hover/img:bg-navy-dark/40">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/0 transition-all duration-300 group-hover/img:bg-teal/20">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              className="opacity-0 transition-opacity duration-300 group-hover/img:opacity-90">
                              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Video ────────────────────────────────── */}
              {project.video_url && project.video_url.trim() !== '' && (
                <motion.div {...(reduceMotion ? {} : fadeUp(0.25))} className="mt-14">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/80">
                    Video
                  </h2>
                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    {isYouTubeUrl(project.video_url) ? (
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={getYouTubeEmbedUrl(project.video_url)}
                          title={`${project.title} video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      </div>
                    ) : (
                      <video src={project.video_url} controls className="w-full" style={{ maxHeight: '440px' }} />
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              {/* Tech Stack */}
              <motion.div {...(reduceMotion ? {} : fadeUp(0.15))}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/80">
                  Tech Stack
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech?.map((t) => (
                    <span key={t} className="rounded-full border border-teal/20 bg-teal/[0.06] px-4 py-1.5 text-xs font-medium text-teal-light/80 transition-colors hover:bg-teal/[0.12]">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Highlights */}
              {project.highlights?.length > 0 && (
                <motion.div {...(reduceMotion ? {} : fadeUp(0.2))}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-light/80">
                    Key Results
                  </h2>
                  <div className="mt-4 space-y-2.5">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/15">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5CD4C6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <p className="text-sm leading-snug text-white/65">{h}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div {...(reduceMotion ? {} : fadeUp(0.25))}>
                <Link to="/#contact">
                  <Button variant="primary" size="lg" className="w-full">
                    Start a Similar Project
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ PREV / NEXT NAVIGATION ══════════════ */}
      <section className="border-t border-white/8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/8">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.id}`}
              className="group flex items-center gap-4 px-6 py-8 transition-colors hover:bg-white/[0.02] md:px-10 md:py-12"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white/30 transition-all group-hover:-translate-x-1 group-hover:text-teal">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Previous</p>
                <p className="mt-1 truncate text-sm font-bold text-white/70 transition-colors group-hover:text-white">{prevProject.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              to={`/projects/${nextProject.id}`}
              className="group flex items-center justify-end gap-4 px-6 py-8 text-right transition-colors hover:bg-white/[0.02] md:px-10 md:py-12"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Next</p>
                <p className="mt-1 truncate text-sm font-bold text-white/70 transition-colors group-hover:text-white">{nextProject.title}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-teal">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      {/* ══════════════ CTA FOOTER ══════════════ */}
      <section className="relative border-t border-white/8 bg-navy-dark py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(50% 80% at 50% 0%, rgba(58, 191, 176, 0.1) 0%, rgba(17, 28, 39, 0) 70%)' }}
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
            <Link to="/projects">
              <Button variant="secondary" size="lg">View Portfolio</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <ImageLightbox
            images={allImages}
            current={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox((prev) => (prev - 1 + allImages.length) % allImages.length)}
            onNext={() => setLightbox((prev) => (prev + 1) % allImages.length)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
