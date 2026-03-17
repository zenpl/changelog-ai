'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'pro'
  const canceled = searchParams.get('canceled')
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email })
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error || 'Failed to create checkout session')
        return
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <span className="text-2xl">📋</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ChangelogAI
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-16">
        {canceled && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 text-yellow-300 text-sm">
            Payment canceled. You can try again anytime.
          </div>
        )}

        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h1 className="text-2xl font-bold mb-2">Upgrade to Pro</h1>
          <p className="text-slate-400 text-sm mb-6">7-day free trial, then $9/month</p>

          <div className="bg-blue-500/10 rounded-xl p-4 mb-6 border border-blue-500/30">
            <h2 className="font-semibold mb-3 text-blue-300">Pro includes:</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {[
                'Unlimited changelog generations',
                'Private repository support',
                'Advanced AI (Claude claude-3-5-haiku)',
                'Multiple export formats (MD, JSON, HTML)',
                'GitHub Releases push integration',
                'Custom changelog templates',
                'Priority email support',
              ].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckout()}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.01]"
          >
            {loading ? 'Redirecting to Stripe...' : 'Start 7-Day Free Trial →'}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            No charge during trial · Cancel anytime · Secured by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <CheckoutContent />
    </Suspense>
  )
}
