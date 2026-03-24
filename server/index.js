import express from 'express'
import cors from 'cors'
import pool from './db/pool.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ── GET all projects ────────────────────────────────────────────
app.get('/api/projects', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC',
    )
    res.json(rows)
  } catch (err) {
    console.error('GET /api/projects error:', err.message)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// ── GET single project by ID ────────────────────────────────────
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [
      req.params.id,
    ])
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('GET /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// ── POST create project ─────────────────────────────────────────
app.post('/api/projects', async (req, res) => {
  const { title, category, description, tech, gradient, status, year, client, duration, highlights, image_url, sort_order } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO projects (title, category, description, tech, gradient, status, year, client, duration, highlights, image_url, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [title, category, description, tech || [], gradient, status || 'In Progress', year, client, duration, highlights || [], image_url, sort_order || 0],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /api/projects error:', err.message)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// ── PUT update project ──────────────────────────────────────────
app.put('/api/projects/:id', async (req, res) => {
  const { title, category, description, tech, gradient, status, year, client, duration, highlights, image_url, sort_order } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE projects SET title=$1, category=$2, description=$3, tech=$4, gradient=$5, status=$6, year=$7, client=$8, duration=$9, highlights=$10, image_url=$11, sort_order=$12, updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [title, category, description, tech, gradient, status, year, client, duration, highlights, image_url, sort_order, req.params.id],
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// ── DELETE project ──────────────────────────────────────────────
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id])
    if (rowCount === 0) return res.status(404).json({ error: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

app.listen(PORT, () => {
  console.log(`CoorDinQ API running on http://localhost:${PORT}`)
})
