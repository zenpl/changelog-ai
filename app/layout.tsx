import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChangelogAI - AI-Powered Release Notes Generator',
  description: 'Transform GitHub commits and PRs into beautiful, professional release notes in seconds. Powered by AI.',
  keywords: 'changelog, release notes, github, AI, automation, developer tools',
  openGraph: {
    title: 'ChangelogAI - AI-Powered Release Notes Generator',
    description: 'Transform GitHub commits and PRs into beautiful release notes in seconds.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
