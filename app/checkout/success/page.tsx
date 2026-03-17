'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Pro!</h1>
        <p className="text-slate-400 mb-8">
          Your subscription is active. You now have unlimited changelog generations, 
          private repo access, and all Pro features.
        </p>
        <Link
          href="/generate"
          className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 inline-block"
        >
          Start Generating →
        </Link>
      </div>
    </div>
  )
}
