import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'projects.json')

// Seed data
const seedProjects = [
  {
    id: 1, title: 'Pulse Commerce', category: 'Web Platform',
    description: 'A high-performance e-commerce platform built for scale. Features real-time inventory management, AI-powered recommendations, and seamless payment integration across 40+ countries.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
    gradient: 'from-teal/30 via-navy-light/40 to-navy-dark/90',
    status: 'Live', year: 2025, client: 'Pulse Retail Inc.', duration: '6 months',
    highlights: ['3x faster load times', '40% increase in conversions', '99.9% uptime'],
    image_url: null, featured_image: null, images: [], video_url: null,
    sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 2, title: 'Orbit HQ', category: 'Custom Software',
    description: 'Enterprise workspace management platform that unifies team communication, project tracking, and resource allocation into a single intelligent dashboard.',
    tech: ['Next.js', 'TypeScript', 'GraphQL', 'PostgreSQL'],
    gradient: 'from-[#2D7D74]/40 via-[#243447]/50 to-[#111C27]/95',
    status: 'Live', year: 2024, client: 'Orbit Technologies', duration: '8 months',
    highlights: ['500+ daily active users', '60% reduction in meeting time', 'Custom analytics engine'],
    image_url: null, featured_image: null, images: [], video_url: null,
    sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 3, title: 'FleetFlow App', category: 'Mobile Application',
    description: 'Real-time fleet management mobile app with GPS tracking, route optimization, and predictive maintenance alerts for logistics companies.',
    tech: ['React Native', 'Express', 'MongoDB', 'Socket.io', 'Google Maps API'],
    gradient: 'from-[#3ABFB0]/35 via-[#2A9A8D]/30 to-[#111C27]/95',
    status: 'Live', year: 2025, client: 'FleetFlow Logistics', duration: '5 months',
    highlights: ['Real-time GPS tracking', '25% fuel cost reduction', '10K+ deliveries tracked daily'],
    image_url: null, featured_image: null, images: [], video_url: null,
    sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 4, title: 'Peak Studio', category: 'UI/UX System',
    description: 'A comprehensive design system and component library powering 12 products. Includes Figma integration, accessibility-first components, and automated documentation.',
    tech: ['Figma', 'Storybook', 'React', 'Tailwind CSS', 'Chromatic'],
    gradient: 'from-[#415A77]/45 via-[#243447]/50 to-[#0E1721]/95',
    status: 'Live', year: 2024, client: 'Peak Digital Group', duration: '4 months',
    highlights: ['200+ reusable components', 'WCAG 2.1 AA compliant', '70% faster design-to-dev handoff'],
    image_url: null, featured_image: null, images: [], video_url: null,
    sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 5, title: 'Signal Reach', category: 'Digital Marketing',
    description: 'Full-funnel digital marketing platform with campaign automation, audience segmentation, multi-channel attribution, and real-time performance dashboards.',
    tech: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Google Ads API'],
    gradient: 'from-[#2A9A8D]/45 via-[#1B2838]/55 to-[#111C27]/96',
    status: 'In Progress', year: 2025, client: 'Signal Media Co.', duration: '7 months',
    highlights: ['4.2x ROAS average', 'Multi-channel attribution', 'AI-driven audience targeting'],
    image_url: null, featured_image: null, images: [], video_url: null,
    sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    }
  } catch { /* ignore */ }
  // First run — seed
  save(seedProjects)
  return seedProjects
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

function nextId(projects) {
  return projects.length === 0 ? 1 : Math.max(...projects.map((p) => p.id)) + 1
}

// ── Public API ──────────────────────────────────────────────────

export function getAll() {
  return load().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}

export function getById(id) {
  return load().find((p) => p.id === Number(id)) || null
}

export function create(data) {
  const projects = load()
  const project = {
    id: nextId(projects),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  projects.push(project)
  save(projects)
  return project
}

export function update(id, data) {
  const projects = load()
  const idx = projects.findIndex((p) => p.id === Number(id))
  if (idx === -1) return null
  projects[idx] = { ...projects[idx], ...data, id: Number(id), updated_at: new Date().toISOString() }
  save(projects)
  return projects[idx]
}

export function remove(id) {
  const projects = load()
  const idx = projects.findIndex((p) => p.id === Number(id))
  if (idx === -1) return false
  projects.splice(idx, 1)
  save(projects)
  return true
}
