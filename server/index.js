import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import * as store from './db/store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Multer config ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    const dir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename(_req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov)$/i
  if (allowed.test(path.extname(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('Only image and video files are allowed'), false)
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } })

const uploadFields = upload.fields([
  { name: 'featured_image_file', maxCount: 1 },
  { name: 'image_files', maxCount: 20 },
  { name: 'video_file', maxCount: 1 },
])

// ── GET all projects ────────────────────────────────────────────
app.get('/api/projects', (_req, res) => {
  try {
    res.json(store.getAll())
  } catch (err) {
    console.error('GET /api/projects error:', err.message)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// ── GET single project by ID ────────────────────────────────────
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = store.getById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    console.error('GET /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// ── Helper: build project data from request ─────────────────────
function buildProjectData(req) {
  const b = req.body
  const baseUrl = `${req.protocol}://${req.get('host')}`

  const featured_image = req.files?.featured_image_file?.[0]
    ? `${baseUrl}/uploads/${req.files.featured_image_file[0].filename}`
    : b.featured_image || null

  const uploadedImages = (req.files?.image_files || []).map(
    (f) => `${baseUrl}/uploads/${f.filename}`,
  )
  let images = uploadedImages
  if (b.existing_images) {
    const existing = typeof b.existing_images === 'string' ? JSON.parse(b.existing_images) : b.existing_images
    images = [...existing, ...uploadedImages]
  } else if (b.images) {
    const prev = typeof b.images === 'string' ? JSON.parse(b.images) : b.images
    images = [...prev, ...uploadedImages]
  }

  const video_url = req.files?.video_file?.[0]
    ? `${baseUrl}/uploads/${req.files.video_file[0].filename}`
    : b.video_url || null

  const tech = typeof b.tech === 'string' ? JSON.parse(b.tech) : (b.tech || [])
  const highlights = typeof b.highlights === 'string' ? JSON.parse(b.highlights) : (b.highlights || [])

  return {
    title: b.title,
    category: b.category,
    description: b.description,
    tech,
    gradient: b.gradient || 'from-teal/30 via-navy-light/40 to-navy-dark/90',
    status: b.status || 'In Progress',
    year: parseInt(b.year) || new Date().getFullYear(),
    client: b.client || null,
    duration: b.duration || null,
    highlights,
    image_url: b.image_url || featured_image,
    sort_order: parseInt(b.sort_order) || 0,
    featured_image,
    images,
    video_url,
  }
}

// ── POST create project ─────────────────────────────────────────
app.post('/api/projects', uploadFields, (req, res) => {
  try {
    const data = buildProjectData(req)
    const project = store.create(data)
    res.status(201).json(project)
  } catch (err) {
    console.error('POST /api/projects error:', err.message)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// ── PUT update project ──────────────────────────────────────────
app.put('/api/projects/:id', uploadFields, (req, res) => {
  try {
    const data = buildProjectData(req)
    const project = store.update(req.params.id, data)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// ── DELETE project ──────────────────────────────────────────────
app.delete('/api/projects/:id', (req, res) => {
  try {
    const deleted = store.remove(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

app.listen(PORT, () => {
  console.log(`CoorDinQ API running on http://localhost:${PORT}`)
})
