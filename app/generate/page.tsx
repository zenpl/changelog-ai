'use client'

import { useState } from 'react'
import Link from 'next/link'
import { marked } from 'marked'

interface GenerateResult {
  changelog: string
  stats: {
    commits: number
    prs: number
    contributors: number
  }
  error?: string
}

export default function GeneratePage() {
  const [repo, setRepo] = useState('')
  const [fromTag, setFromTag] = useState('')
  const [toTag, setToTag] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!repo) {
      setError('Please enter a GitHub repository (e.g., owner/repo)')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo, fromTag, toTag, token })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Generation failed. Please try again.')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (result?.changelog) {
      await navigator.clipboard.writeText(result.changelog)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (result?.changelog) {
      const blob = new Blob([result.changelog], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CHANGELOG-${repo.replace('/', '-')}.md`
      a.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ChangelogAI
            </span>
          </Link>
          <Link href="/#pricing" className="text-slate-300 hover:text-white text-sm transition-colors">
            Upgrade to Pro →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Generate Your Changelog</h1>
          <p className="text-slate-400">Enter your GitHub repo and tag range to get started</p>
        </div>

        {/* Input Form */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
          <div className="space-y-6">
            {/* Repo */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Repository <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., vercel/next.js or facebook/react"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  From Tag / Commit
                </label>
                <input
                  type="text"
                  placeholder="e.g., v1.0.0 or main"
                  value={fromTag}
                  onChange={(e) => setFromTag(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  To Tag / Commit
                </label>
                <input
                  type="text"
                  placeholder="e.g., v1.1.0 or HEAD"
                  value={toTag}
                  onChange={(e) => setToTag(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Token (optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Token <span className="text-slate-500">(optional — for private repos)</span>
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">
                Token is not stored. Used only for this request. Private repos require Pro plan.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Changelog...
                </span>
              ) : '✨ Generate Changelog'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold">Generated Changelog</h2>
                {result.stats && (
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span>📝 {result.stats.commits} commits</span>
                    <span>👥 {result.stats.contributors} contributors</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  ⬇️ Download .md
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                  {result.changelog}
                </pre>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300">🚀 Want unlimited changelogs?</p>
                  <p className="text-xs text-slate-400">Upgrade to Pro for $9/month — unlimited generations, private repos, and more.</p>
                </div>
                <Link href="/checkout?plan=pro" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ml-4">
                  Upgrade →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
