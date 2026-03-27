import pool from './pool.js'

const DEFAULT_GRADIENT = 'from-teal/30 via-navy-light/40 to-navy-dark/90'

function assetUrl(baseUrl, id) {
  return `${baseUrl}/api/assets/${id}`
}

function extractAssetIdFromUrl(url) {
  const value = String(url || '').trim()
  if (!value) return null
  const match = value.match(/\/api\/assets\/(\d+)(?:$|[/?#])/i)
  if (!match) return null
  return Number(match[1])
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string' || value.trim() === '') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizeProjectInput(input) {
  return {
    title: String(input.title || '').trim(),
    category: String(input.category || '').trim(),
    description: String(input.description || '').trim(),
    tech: asArray(input.tech).map((v) => String(v).trim()).filter(Boolean),
    gradient: String(input.gradient || '').trim() || DEFAULT_GRADIENT,
    status: String(input.status || 'In Progress').trim() || 'In Progress',
    year: Number.parseInt(String(input.year), 10) || new Date().getFullYear(),
    client: String(input.client || '').trim() || null,
    duration: String(input.duration || '').trim() || null,
    highlights: asArray(input.highlights).map((v) => String(v).trim()).filter(Boolean),
    sort_order: Number.parseInt(String(input.sort_order), 10) || 0,
    website_url: String(input.website_url || '').trim() || null,
    featured_image: String(input.featured_image || '').trim() || null,
    video_url: String(input.video_url || '').trim() || null,
    existing_images: asArray(input.existing_images),
    images: asArray(input.images),
  }
}

async function insertAsset(client, file) {
  if (!file?.buffer) return null
  const { rows } = await client.query(
    `
      INSERT INTO project_assets (filename, mime_type, data, byte_size)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [
      file.originalname || null,
      file.mimetype || 'application/octet-stream',
      file.buffer,
      Number.parseInt(String(file.size), 10) || file.buffer.length,
    ],
  )
  return rows[0].id
}

function parseSingleMediaReference(url) {
  const value = String(url || '').trim()
  if (!value) return { assetId: null, externalUrl: null }
  const assetId = extractAssetIdFromUrl(value)
  if (assetId) return { assetId, externalUrl: null }
  return { assetId: null, externalUrl: value }
}

function parseMediaListReferences(urls) {
  const assetIds = []
  const externalUrls = []

  for (const raw of urls || []) {
    const value = String(raw || '').trim()
    if (!value) continue
    const assetId = extractAssetIdFromUrl(value)
    if (assetId) {
      assetIds.push(assetId)
    } else {
      externalUrls.push(value)
    }
  }

  return { assetIds, externalUrls }
}

function responseProject(row, baseUrl) {
  const featuredFromAsset = row.featured_asset_id ? assetUrl(baseUrl, row.featured_asset_id) : null
  const featured = featuredFromAsset || row.featured_external_url || null

  const galleryAssetUrls = (row.images_asset_ids || []).map((id) => assetUrl(baseUrl, id))
  const galleryExternalUrls = row.images_external_urls || []
  const images = [...galleryAssetUrls, ...galleryExternalUrls]

  const videoFromAsset = row.video_asset_id ? assetUrl(baseUrl, row.video_asset_id) : null
  const video = videoFromAsset || row.video_external_url || null

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    tech: row.tech || [],
    gradient: row.gradient || DEFAULT_GRADIENT,
    status: row.status || 'In Progress',
    year: row.year,
    client: row.client,
    duration: row.duration,
    highlights: row.highlights || [],
    sort_order: row.sort_order || 0,
    website_url: row.website_url || null,
    featured_image: featured,
    image_url: featured,
    images,
    video_url: video,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

const PROJECT_COLUMNS = `
  id, title, category, description, tech, gradient, status, year, client, duration,
  highlights, sort_order, website_url, featured_asset_id, featured_external_url,
  images_asset_ids, images_external_urls, video_asset_id, video_external_url,
  created_at, updated_at
`

async function getProjectRowById(client, id) {
  const { rows } = await client.query(
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = $1`,
    [Number(id)],
  )
  return rows[0] || null
}

function collectProjectAssetIds(projectRow) {
  const ids = new Set()
  if (projectRow?.featured_asset_id) ids.add(Number(projectRow.featured_asset_id))
  if (projectRow?.video_asset_id) ids.add(Number(projectRow.video_asset_id))
  for (const id of projectRow?.images_asset_ids || []) ids.add(Number(id))
  return ids
}

async function isAssetReferenced(client, assetId) {
  const { rows } = await client.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM projects
        WHERE featured_asset_id = $1
          OR video_asset_id = $1
          OR $1 = ANY(images_asset_ids)
      ) AS in_use
    `,
    [assetId],
  )
  return Boolean(rows[0]?.in_use)
}

async function cleanupUnreferencedAssets(client, assetIds) {
  for (const id of assetIds) {
    if (!id) continue
    const inUse = await isAssetReferenced(client, id)
    if (!inUse) {
      await client.query('DELETE FROM project_assets WHERE id = $1', [id])
    }
  }
}

function computeExistingMediaInput(data, isUpdate) {
  if (isUpdate) return data.existing_images || []
  if ((data.images || []).length > 0) return data.images
  return []
}

export async function getAll(baseUrl) {
  const { rows } = await pool.query(
    `SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY sort_order ASC, id ASC`,
  )
  return rows.map((row) => responseProject(row, baseUrl))
}

export async function getById(id, baseUrl) {
  const row = await getProjectRowById(pool, id)
  if (!row) return null
  return responseProject(row, baseUrl)
}

export async function getAssetById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, filename, mime_type, data, byte_size, created_at
      FROM project_assets
      WHERE id = $1
    `,
    [Number(id)],
  )
  return rows[0] || null
}

export async function create(rawData, files, baseUrl) {
  const data = normalizeProjectInput(rawData)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const featuredUploadId = await insertAsset(client, files?.featured)
    const galleryUploadIds = []
    for (const file of files?.images || []) {
      const id = await insertAsset(client, file)
      if (id) galleryUploadIds.push(id)
    }
    const videoUploadId = await insertAsset(client, files?.video)

    const featuredRef = featuredUploadId
      ? { assetId: featuredUploadId, externalUrl: null }
      : parseSingleMediaReference(data.featured_image)
    const videoRef = videoUploadId
      ? { assetId: videoUploadId, externalUrl: null }
      : parseSingleMediaReference(data.video_url)

    const existingMedia = parseMediaListReferences(computeExistingMediaInput(data, false))
    const imageAssetIds = [...existingMedia.assetIds, ...galleryUploadIds]
    const imageExternalUrls = existingMedia.externalUrls

    const { rows } = await client.query(
      `
        INSERT INTO projects (
          title, category, description, tech, gradient, status, year, client, duration,
          highlights, sort_order, website_url, featured_asset_id, featured_external_url,
          images_asset_ids, images_external_urls, video_asset_id, video_external_url
        ) VALUES (
          $1, $2, $3, $4::text[], $5, $6, $7, $8, $9,
          $10::text[], $11, $12, $13, $14,
          $15::bigint[], $16::text[], $17, $18
        )
        RETURNING ${PROJECT_COLUMNS}
      `,
      [
        data.title,
        data.category,
        data.description,
        data.tech,
        data.gradient,
        data.status,
        data.year,
        data.client,
        data.duration,
        data.highlights,
        data.sort_order,
        data.website_url,
        featuredRef.assetId,
        featuredRef.externalUrl,
        imageAssetIds,
        imageExternalUrls,
        videoRef.assetId,
        videoRef.externalUrl,
      ],
    )

    await client.query('COMMIT')
    return responseProject(rows[0], baseUrl)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function update(id, rawData, files, baseUrl) {
  const data = normalizeProjectInput(rawData)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const existing = await getProjectRowById(client, id)
    if (!existing) {
      await client.query('ROLLBACK')
      return null
    }

    const beforeAssetIds = collectProjectAssetIds(existing)

    const featuredUploadId = await insertAsset(client, files?.featured)
    const galleryUploadIds = []
    for (const file of files?.images || []) {
      const assetId = await insertAsset(client, file)
      if (assetId) galleryUploadIds.push(assetId)
    }
    const videoUploadId = await insertAsset(client, files?.video)

    const featuredRef = featuredUploadId
      ? { assetId: featuredUploadId, externalUrl: null }
      : parseSingleMediaReference(data.featured_image)
    const videoRef = videoUploadId
      ? { assetId: videoUploadId, externalUrl: null }
      : parseSingleMediaReference(data.video_url)

    const existingMedia = parseMediaListReferences(computeExistingMediaInput(data, true))
    const imageAssetIds = [...existingMedia.assetIds, ...galleryUploadIds]
    const imageExternalUrls = existingMedia.externalUrls

    const { rows } = await client.query(
      `
        UPDATE projects
        SET
          title = $1,
          category = $2,
          description = $3,
          tech = $4::text[],
          gradient = $5,
          status = $6,
          year = $7,
          client = $8,
          duration = $9,
          highlights = $10::text[],
          sort_order = $11,
          website_url = $12,
          featured_asset_id = $13,
          featured_external_url = $14,
          images_asset_ids = $15::bigint[],
          images_external_urls = $16::text[],
          video_asset_id = $17,
          video_external_url = $18,
          updated_at = NOW()
        WHERE id = $19
        RETURNING ${PROJECT_COLUMNS}
      `,
      [
        data.title,
        data.category,
        data.description,
        data.tech,
        data.gradient,
        data.status,
        data.year,
        data.client,
        data.duration,
        data.highlights,
        data.sort_order,
        data.website_url,
        featuredRef.assetId,
        featuredRef.externalUrl,
        imageAssetIds,
        imageExternalUrls,
        videoRef.assetId,
        videoRef.externalUrl,
        Number(id),
      ],
    )

    const updated = rows[0]
    const afterAssetIds = collectProjectAssetIds(updated)
    const removed = []
    for (const assetId of beforeAssetIds) {
      if (!afterAssetIds.has(assetId)) removed.push(assetId)
    }
    await cleanupUnreferencedAssets(client, removed)

    await client.query('COMMIT')
    return responseProject(updated, baseUrl)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function remove(id) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const existing = await getProjectRowById(client, id)
    if (!existing) {
      await client.query('ROLLBACK')
      return false
    }

    const assetIds = [...collectProjectAssetIds(existing)]
    await client.query('DELETE FROM projects WHERE id = $1', [Number(id)])
    await cleanupUnreferencedAssets(client, assetIds)

    await client.query('COMMIT')
    return true
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
