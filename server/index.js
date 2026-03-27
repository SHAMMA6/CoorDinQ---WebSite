import express from 'express'
import cors from 'cors'
import multer from 'multer'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import * as store from './db/store.js'

const app = express()
const PORT = process.env.PORT || 3001

app.set('trust proxy', 1)

const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'coordinq_admin'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || ''
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || ''
const NODE_ENV = process.env.NODE_ENV || 'development'

function buildCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

function getBaseUrl(req) {
  return `${req.protocol}://${req.get('host')}`
}

function signAdminToken(payload) {
  if (!ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET is required')
  }
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '7d' })
}

function verifyAdminToken(token) {
  if (!ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET is required')
  }
  return jwt.verify(token, ADMIN_JWT_SECRET)
}

function parseJsonArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string' || value.trim() === '') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizeWebsiteUrl(value) {
  const input = String(value || '').trim()
  if (!input) return null
  if (/^https?:\/\//i.test(input)) return input
  return `https://${input}`
}

function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[ADMIN_COOKIE_NAME]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const payload = verifyAdminToken(token)
    req.admin = payload
    return next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

app.use(
  cors({
    origin: FRONTEND_ORIGIN ? [FRONTEND_ORIGIN] : true,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

const fileFilter = (_req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov)$/i
  if (allowed.test(file.originalname || '')) {
    cb(null, true)
  } else {
    cb(new Error('Only image and video files are allowed'), false)
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
})

const uploadFields = upload.fields([
  { name: 'featured_image_file', maxCount: 1 },
  { name: 'image_files', maxCount: 20 },
  { name: 'video_file', maxCount: 1 },
])

function buildProjectData(req) {
  const b = req.body || {}
  return {
    title: b.title,
    category: b.category,
    description: b.description,
    tech: parseJsonArray(b.tech),
    gradient: b.gradient || 'from-teal/30 via-navy-light/40 to-navy-dark/90',
    status: b.status || 'In Progress',
    year: Number.parseInt(String(b.year), 10) || new Date().getFullYear(),
    client: b.client || null,
    duration: b.duration || null,
    highlights: parseJsonArray(b.highlights),
    sort_order: Number.parseInt(String(b.sort_order), 10) || 0,
    website_url: normalizeWebsiteUrl(b.website_url),
    featured_image: b.featured_image || null,
    existing_images: parseJsonArray(b.existing_images),
    images: parseJsonArray(b.images),
    video_url: b.video_url || null,
  }
}

function buildProjectFiles(req) {
  return {
    featured: req.files?.featured_image_file?.[0] || null,
    images: req.files?.image_files || [],
    video: req.files?.video_file?.[0] || null,
  }
}

// Assets from PostgreSQL
app.get('/api/assets/:id', async (req, res) => {
  try {
    const asset = await store.getAssetById(req.params.id)
    if (!asset) return res.status(404).end()

    res.setHeader('Content-Type', asset.mime_type || 'application/octet-stream')
    res.setHeader('Content-Length', String(asset.byte_size || asset.data?.length || 0))
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    return res.send(asset.data)
  } catch (err) {
    console.error('GET /api/assets/:id error:', err.message)
    return res.status(500).json({ error: 'Failed to fetch asset' })
  }
})

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await store.getAll(getBaseUrl(req))
    return res.json(projects)
  } catch (err) {
    console.error('GET /api/projects error:', err.message)
    return res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await store.getById(req.params.id, getBaseUrl(req))
    if (!project) return res.status(404).json({ error: 'Project not found' })
    return res.json(project)
  } catch (err) {
    console.error('GET /api/projects/:id error:', err.message)
    return res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// Admin auth
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

    if (!ADMIN_EMAIL) return res.status(500).json({ error: 'Admin not configured' })

    const emailOk = String(email).trim().toLowerCase() === String(ADMIN_EMAIL).trim().toLowerCase()
    if (!emailOk) return res.status(401).json({ error: 'Invalid credentials' })

    let passwordOk = false
    if (ADMIN_PASSWORD_HASH) {
      passwordOk = await bcrypt.compare(String(password), ADMIN_PASSWORD_HASH)
    } else {
      passwordOk = String(password) === String(ADMIN_PASSWORD)
    }

    if (!passwordOk) return res.status(401).json({ error: 'Invalid credentials' })

    const token = signAdminToken({ email: ADMIN_EMAIL })
    res.cookie(ADMIN_COOKIE_NAME, token, buildCookieOptions())
    return res.json({ ok: true, email: ADMIN_EMAIL })
  } catch (err) {
    console.error('POST /api/admin/login error:', err.message)
    return res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' })
  res.json({ ok: true })
})

app.get('/api/admin/me', (req, res) => {
  try {
    const token = req.cookies?.[ADMIN_COOKIE_NAME]
    if (!token) return res.status(401).json({ ok: false })
    const payload = verifyAdminToken(token)
    return res.json({ ok: true, email: payload.email })
  } catch {
    return res.status(401).json({ ok: false })
  }
})

// Create project
app.post('/api/projects', requireAdmin, uploadFields, async (req, res) => {
  try {
    const data = buildProjectData(req)
    const files = buildProjectFiles(req)
    const project = await store.create(data, files, getBaseUrl(req))
    return res.status(201).json(project)
  } catch (err) {
    console.error('POST /api/projects error:', err.message)
    return res.status(500).json({ error: 'Failed to create project' })
  }
})

// Update project
app.put('/api/projects/:id', requireAdmin, uploadFields, async (req, res) => {
  try {
    const data = buildProjectData(req)
    const files = buildProjectFiles(req)
    const project = await store.update(req.params.id, data, files, getBaseUrl(req))
    if (!project) return res.status(404).json({ error: 'Project not found' })
    return res.json(project)
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err.message)
    return res.status(500).json({ error: 'Failed to update project' })
  }
})

// Delete project
app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await store.remove(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Project not found' })
    return res.json({ message: 'Project deleted' })
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err.message)
    return res.status(500).json({ error: 'Failed to delete project' })
  }
})

app.listen(PORT, () => {
  console.log(`CoorDinQ API running on http://localhost:${PORT}`)
})
