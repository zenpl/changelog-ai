'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ChangelogAI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/generate" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition-colors">
              Try Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-8 border border-blue-500/30">
          <span>✨</span>
          <span>AI-Powered Release Notes in 10 seconds</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Turn GitHub commits into
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {' '}beautiful changelogs
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Stop writing release notes manually. ChangelogAI analyzes your GitHub commits and PRs, 
          then generates professional, user-friendly changelogs instantly.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/generate" className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            Generate Changelog Free →
          </Link>
          <a href="#demo" className="text-slate-300 hover:text-white px-6 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-all">
            See Demo
          </a>
        </div>

        <p className="text-sm text-slate-500 mt-6">No credit card required • 3 free generations/month</p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why ChangelogAI?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '⚡',
              title: 'Instant Generation',
              desc: 'Input your GitHub repo + tag range, get a polished changelog in under 10 seconds.'
            },
            {
              icon: '🤖',
              title: 'AI-Curated',
              desc: 'Claude AI understands context, groups related changes, and writes in human-readable language.'
            },
            {
              icon: '🎨',
              title: 'Multiple Formats',
              desc: 'Export as Markdown, JSON, or HTML. Perfect for GitHub releases, blogs, or newsletters.'
            },
            {
              icon: '🔒',
              title: 'Private Repos',
              desc: 'Secure GitHub OAuth authentication. Your code never leaves GitHub\'s servers.'
            },
            {
              icon: '📊',
              title: 'Smart Categorization',
              desc: 'Auto-categorizes changes: Features, Bug Fixes, Breaking Changes, Security Updates.'
            },
            {
              icon: '🚀',
              title: 'One-Click Deploy',
              desc: 'Directly push release notes to GitHub Releases. No copy-paste needed.'
            }
          ].map((f) => (
            <div key={f.title} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">See it in action</h2>
        <p className="text-slate-400 text-center mb-12">From raw commits to polished release notes</p>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-400 font-mono">Input: GitHub Commits</span>
            </div>
            <div className="font-mono text-sm text-slate-300 space-y-2">
              <div className="text-slate-500">$ git log v1.0.0..v1.1.0 --oneline</div>
              <div><span className="text-green-400">a3f2e1b</span> fix: resolve null pointer in auth</div>
              <div><span className="text-green-400">b8d4c2a</span> feat: add dark mode support</div>
              <div><span className="text-green-400">c1e5f3d</span> feat: export to CSV feature</div>
              <div><span className="text-green-400">d7a8b4c</span> chore: update dependencies</div>
              <div><span className="text-green-400">e2c9d5e</span> fix: mobile layout overflow</div>
              <div><span className="text-green-400">f4b6a1d</span> BREAKING: rename config key</div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-400 font-mono">Output: Release Notes ✨</span>
            </div>
            <div className="text-sm text-slate-300 space-y-3">
              <div>
                <div className="text-blue-400 font-semibold">## 🚀 New Features</div>
                <div className="text-slate-400 ml-2">- Added dark mode support across the entire app</div>
                <div className="text-slate-400 ml-2">- Export data to CSV format</div>
              </div>
              <div>
                <div className="text-green-400 font-semibold">## 🐛 Bug Fixes</div>
                <div className="text-slate-400 ml-2">- Fixed authentication crash on null user</div>
                <div className="text-slate-400 ml-2">- Resolved mobile layout overflow issue</div>
              </div>
              <div>
                <div className="text-red-400 font-semibold">## ⚠️ Breaking Changes</div>
                <div className="text-slate-400 ml-2">- Config key renamed (migration required)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-slate-400 text-center mb-12">Start free, upgrade when you need more</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="text-lg font-semibold mb-1">Free</div>
            <div className="text-4xl font-bold mb-2">$0</div>
            <div className="text-slate-400 text-sm mb-8">Forever free</div>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              {['3 changelogs/month', 'Markdown output', 'Public repos', 'Basic AI generation'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/generate" className="block text-center bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
              Start Free
            </Link>
          </div>
          
          {/* Pro */}
          <div className="bg-gradient-to-b from-blue-600/20 to-blue-800/20 rounded-2xl p-8 border border-blue-500/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              MOST POPULAR
            </div>
            <div className="text-lg font-semibold mb-1">Pro</div>
            <div className="text-4xl font-bold mb-2">$9<span className="text-xl text-slate-400">/mo</span></div>
            <div className="text-slate-400 text-sm mb-8">Billed monthly</div>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              {[
                'Unlimited changelogs',
                'Markdown + JSON + HTML',
                'Private repos',
                'Advanced AI (Claude)',
                'GitHub Release push',
                'Custom templates',
                'Priority support'
              ].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/checkout?plan=pro" className="block text-center bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105">
              Upgrade to Pro →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="font-semibold">ChangelogAI</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 ChangelogAI · Made with ❤️ for developers
          </div>
        </div>
      </footer>
    </div>
  )
}
