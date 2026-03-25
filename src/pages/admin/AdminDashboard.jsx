import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch(`${API_URL}/projects`, { credentials: 'include' })
      const data = await res.json()
      setProjects(data)
    } catch {
      console.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/admin/logout`, { method: 'POST', credentials: 'include' })
    } finally {
      navigate('/admin/login')
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Delete failed')
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setDeleteId(null)
    } catch {
      console.error('Failed to delete project')
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-dark/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/50 transition hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/projects/new')}
              className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-navy-dark transition hover:bg-teal-light"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Project
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-navy-light/50 p-5">
            <p className="text-sm text-white/50">Total Projects</p>
            <p className="mt-1 text-3xl font-bold text-white">{projects.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-navy-light/50 p-5">
            <p className="text-sm text-white/50">Live</p>
            <p className="mt-1 text-3xl font-bold text-teal">
              {projects.filter((p) => p.status === 'Live').length}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-navy-light/50 p-5">
            <p className="text-sm text-white/50">In Progress</p>
            <p className="mt-1 text-3xl font-bold text-yellow-400">
              {projects.filter((p) => p.status === 'In Progress').length}
            </p>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/20 py-20 text-center">
            <p className="text-lg text-white/40">No projects yet</p>
            <button
              onClick={() => navigate('/admin/projects/new')}
              className="mt-4 rounded-lg bg-teal/20 px-5 py-2 text-sm font-semibold text-teal transition hover:bg-teal/30"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-navy-light/40 p-4 transition hover:border-teal/30 hover:bg-navy-light/60"
              >
                {/* Thumbnail */}
                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-navy-dark">
                  {project.featured_image || project.image_url ? (
                    <img
                      src={project.featured_image || project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${project.gradient}`} />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate text-base font-semibold text-white">{project.title}</h3>
                    <span
                      className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        project.status === 'Live'
                          ? 'bg-teal/20 text-teal'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-white/40">
                    <span>{project.category}</span>
                    <span>·</span>
                    <span>{project.year}</span>
                    {project.images?.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{project.images.length} images</span>
                      </>
                    )}
                    {project.video_url && (
                      <>
                        <span>·</span>
                        <span className="text-teal/60">Has video</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 transition hover:border-teal/40 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-red-400/70 transition hover:border-red-400/40 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-white/10 bg-navy-light p-6">
            <h3 className="text-lg font-bold text-white">Delete Project?</h3>
            <p className="mt-2 text-sm text-white/50">
              This action cannot be undone. The project and all its data will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
