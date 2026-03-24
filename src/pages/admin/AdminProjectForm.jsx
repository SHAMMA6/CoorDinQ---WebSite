import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const CATEGORIES = ['Website', 'Software', 'Mobile App', 'Digital Marketing']
const STATUSES = ['Live', 'In Progress']

export default function AdminProjectForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    category: CATEGORIES[0],
    description: '',
    tech: '',
    gradient: 'from-teal/30 via-navy-light/40 to-navy-dark/90',
    status: 'In Progress',
    year: new Date().getFullYear(),
    client: '',
    duration: '',
    highlights: '',
    sort_order: 0,
    video_url: '',
  })

  const [featuredFile, setFeaturedFile] = useState(null)
  const [featuredPreview, setFeaturedPreview] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const featuredRef = useRef()
  const imagesRef = useRef()
  const videoRef = useRef()

  // Load existing project for edit
  useEffect(() => {
    if (!isEdit) return
    fetch(`${API_URL}/projects/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          title: p.title || '',
          category: p.category || CATEGORIES[0],
          description: p.description || '',
          tech: (p.tech || []).join(', '),
          gradient: p.gradient || '',
          status: p.status || 'In Progress',
          year: p.year || new Date().getFullYear(),
          client: p.client || '',
          duration: p.duration || '',
          highlights: (p.highlights || []).join('\n'),
          sort_order: p.sort_order || 0,
          video_url: p.video_url || '',
        })
        if (p.featured_image) setFeaturedPreview(p.featured_image)
        if (p.images?.length) setExistingImages(p.images)
        if (p.video_url) setVideoPreview(p.video_url)
      })
      .catch(() => setError('Failed to load project'))
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleFeaturedImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setFeaturedFile(file)
    setFeaturedPreview(URL.createObjectURL(file))
  }

  function handleImages(e) {
    const files = Array.from(e.target.files)
    setImageFiles((prev) => [...prev, ...files])
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
  }

  function removeNewImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(index) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  function handleVideo(e) {
    const file = e.target.files[0]
    if (!file) return
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  function removeVideo() {
    setVideoFile(null)
    setVideoPreview(null)
    setForm((prev) => ({ ...prev, video_url: '' }))
    if (videoRef.current) videoRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('category', form.category)
    fd.append('description', form.description)
    fd.append('tech', JSON.stringify(form.tech.split(',').map((t) => t.trim()).filter(Boolean)))
    fd.append('gradient', form.gradient)
    fd.append('status', form.status)
    fd.append('year', form.year)
    fd.append('client', form.client)
    fd.append('duration', form.duration)
    fd.append('highlights', JSON.stringify(form.highlights.split('\n').map((h) => h.trim()).filter(Boolean)))
    fd.append('sort_order', form.sort_order)

    if (featuredFile) {
      fd.append('featured_image_file', featuredFile)
    } else if (featuredPreview && !featuredFile) {
      fd.append('featured_image', featuredPreview)
    }

    if (isEdit) {
      fd.append('existing_images', JSON.stringify(existingImages))
    }

    imageFiles.forEach((f) => fd.append('image_files', f))

    if (videoFile) {
      fd.append('video_file', videoFile)
    } else if (form.video_url) {
      fd.append('video_url', form.video_url)
    }

    try {
      const url = isEdit ? `${API_URL}/projects/${id}` : `${API_URL}/projects`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: fd })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-dark/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <Link to="/admin" className="text-white/50 transition hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h1>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── Featured Image ─────────────────────────────── */}
        <section className="mb-8">
          <label className="mb-3 block text-sm font-semibold text-white/70">Featured Image</label>
          <div
            onClick={() => featuredRef.current?.click()}
            className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-white/20 transition hover:border-teal/50"
          >
            {featuredPreview ? (
              <div className="relative">
                <img src={featuredPreview} alt="Featured" className="h-56 w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <span className="text-sm font-semibold text-white">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="flex h-56 flex-col items-center justify-center text-white/30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="mt-2 text-sm">Click to upload featured image</span>
              </div>
            )}
          </div>
          <input ref={featuredRef} type="file" accept="image/*" onChange={handleFeaturedImage} className="hidden" />
        </section>

        {/* ── Project Images Gallery ─────────────────────── */}
        <section className="mb-8">
          <label className="mb-3 block text-sm font-semibold text-white/70">
            Project Images
            <span className="ml-2 font-normal text-white/30">({existingImages.length + imagePreviews.length} images)</span>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {/* Existing images */}
            {existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="group relative aspect-square overflow-hidden rounded-lg">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}

            {/* New image previews */}
            {imagePreviews.map((url, i) => (
              <div key={`new-${i}`} className="group relative aspect-square overflow-hidden rounded-lg">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add button */}
            <button
              type="button"
              onClick={() => imagesRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-white/15 text-white/30 transition hover:border-teal/40 hover:text-teal/60"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          <input ref={imagesRef} type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
        </section>

        {/* ── Video (Optional) ───────────────────────────── */}
        <section className="mb-8">
          <label className="mb-3 block text-sm font-semibold text-white/70">
            Video <span className="font-normal text-white/30">(optional)</span>
          </label>
          {videoPreview ? (
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <video src={videoPreview} controls className="w-full rounded-xl" style={{ maxHeight: '300px' }} />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => videoRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 py-8 text-white/30 transition hover:border-teal/40 hover:text-teal/60"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span className="text-sm">Upload video file</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/30">or paste URL</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <input
                type="url"
                name="video_url"
                value={form.video_url}
                onChange={handleChange}
                placeholder="https://youtube.com/... or video URL"
                className="w-full rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal/50"
              />
            </div>
          )}
          <input ref={videoRef} type="file" accept="video/*" onChange={handleVideo} className="hidden" />
        </section>

        <hr className="mb-8 border-white/10" />

        {/* ── Text Fields ────────────────────────────────── */}
        <div className="space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white/70">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal/50"
            />
          </div>

          {/* Tech & Client */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Tech Stack" name="tech" value={form.tech} onChange={handleChange} placeholder="React, Node.js, PostgreSQL" />
            <Field label="Client" name="client" value={form.client} onChange={handleChange} />
          </div>

          {/* Year, Duration, Status */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Year" name="year" type="number" value={form.year} onChange={handleChange} />
            <Field label="Duration" name="duration" value={form.duration} onChange={handleChange} placeholder="6 months" />
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal/50"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white/70">
              Key Highlights <span className="font-normal text-white/30">(one per line)</span>
            </label>
            <textarea
              name="highlights"
              value={form.highlights}
              onChange={handleChange}
              rows={3}
              placeholder={"3x faster load times\n40% increase in conversions\n99.9% uptime"}
              className="w-full resize-none rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal/50"
            />
          </div>

          {/* Sort Order & Gradient */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Sort Order" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} />
            <Field label="Gradient" name="gradient" value={form.gradient} onChange={handleChange} placeholder="from-teal/30 via-navy-light/40 to-navy-dark/90" />
          </div>
        </div>

        {/* ── Submit ─────────────────────────────────────── */}
        <div className="mt-10 flex items-center justify-end gap-4">
          <Link
            to="/admin"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-teal px-6 py-2.5 text-sm font-semibold text-navy-dark transition hover:bg-teal-light disabled:opacity-50"
          >
            {saving && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy-dark border-t-transparent" />
            )}
            {saving ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-white/70">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal/50"
      />
    </div>
  )
}
