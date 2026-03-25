import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Login failed')
      }

      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-dark/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <Link to="/" className="text-white/50 transition hover:text-white" aria-label="Back to home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">Admin Login</h1>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-light/30 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
          <h2 className="text-2xl font-black tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-white/50">Sign in to manage your projects.</p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal/50"
                placeholder="coordinq@gmail.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-white/70">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-white/10 bg-navy-dark/50 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-6 py-2.5 text-sm font-semibold text-navy-dark transition hover:bg-teal-light disabled:opacity-50"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy-dark border-t-transparent" />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="pt-2 text-center text-xs text-white/35">
              <Link to="/" className="text-white/50 transition hover:text-white">Back to website</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

