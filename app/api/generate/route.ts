import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

interface CommitData {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

async function fetchGitHubCommits(
  repo: string,
  fromTag: string,
  toTag: string,
  token?: string
): Promise<CommitData[]> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'ChangelogAI/1.0',
  }
  
  const authToken = token || GITHUB_TOKEN
  if (authToken) {
    headers['Authorization'] = `token ${authToken}`
  }

  let url: string
  if (fromTag && toTag) {
    // Compare two refs
    url = `https://api.github.com/repos/${repo}/compare/${fromTag}...${toTag}`
    const res = await fetch(url, { headers })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `GitHub API error: ${res.status}`)
    }
    const data = await res.json()
    return (data.commits || []).map((c: any) => ({
      sha: c.sha?.substring(0, 7),
      message: c.commit?.message || '',
      author: c.commit?.author?.name || c.author?.login || 'Unknown',
      date: c.commit?.author?.date || '',
      url: c.html_url || '',
    }))
  } else {
    // Get recent commits
    const ref = toTag || fromTag || 'HEAD'
    url = `https://api.github.com/repos/${repo}/commits?sha=${ref}&per_page=50`
    const res = await fetch(url, { headers })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `GitHub API error: ${res.status}`)
    }
    const data = await res.json()
    return (data || []).map((c: any) => ({
      sha: c.sha?.substring(0, 7),
      message: c.commit?.message || '',
      author: c.commit?.author?.name || c.author?.login || 'Unknown',
      date: c.commit?.author?.date || '',
      url: c.html_url || '',
    }))
  }
}

async function generateWithClaude(
  repo: string,
  commits: CommitData[],
  fromTag: string,
  toTag: string
): Promise<string> {
  const commitList = commits
    .map(c => `- ${c.sha} ${c.message.split('\n')[0]} (by ${c.author})`)
    .join('\n')

  const versionLabel = toTag || 'Latest'
  const prompt = `You are a technical writer helping developers create professional release notes.

Repository: ${repo}
Version: ${versionLabel}${fromTag ? ` (since ${fromTag})` : ''}

Commits to analyze:
${commitList}

Generate a clean, professional changelog in Markdown format. Follow these rules:
1. Group changes into categories: 🚀 New Features, 🐛 Bug Fixes, ⚠️ Breaking Changes, 🔒 Security, 📦 Dependencies, 🔧 Internal
2. Only include relevant categories (skip empty ones)
3. Rewrite commit messages to be user-friendly (not developer jargon)
4. Add a brief summary paragraph at the top
5. Include contributors list at the bottom if multiple authors
6. Use the format:
   ## [Version] - Date
   
   Brief summary of this release.
   
   ### 🚀 New Features
   - Feature description
   
   etc.

Keep it concise but informative. Focus on what changed from a user's perspective.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  })

  if (!res.ok) {
    throw new Error('AI generation failed')
  }

  const data = await res.json()
  return data.content?.[0]?.text || 'Failed to generate changelog.'
}

function generateFallbackChangelog(
  repo: string,
  commits: CommitData[],
  fromTag: string,
  toTag: string
): string {
  const date = new Date().toISOString().split('T')[0]
  const version = toTag || 'v1.0.0'
  
  const features: string[] = []
  const fixes: string[] = []
  const breaking: string[] = []
  const internal: string[] = []

  commits.forEach(c => {
    const msg = c.message.split('\n')[0]
    if (msg.toLowerCase().startsWith('feat') || msg.toLowerCase().startsWith('add')) {
      features.push(`- ${msg.replace(/^feat(\(.*?\))?: ?/i, '').replace(/^add ?/i, '')}`)
    } else if (msg.toLowerCase().startsWith('fix') || msg.toLowerCase().startsWith('bug')) {
      fixes.push(`- ${msg.replace(/^fix(\(.*?\))?: ?/i, '').replace(/^bug ?/i, '')}`)
    } else if (msg.toLowerCase().includes('breaking') || msg.toUpperCase() === msg) {
      breaking.push(`- ${msg}`)
    } else {
      internal.push(`- ${msg}`)
    }
  })

  let changelog = `## [${version}] - ${date}\n\n`
  changelog += `Release for ${repo}.\n\n`

  if (features.length > 0) {
    changelog += `### 🚀 New Features\n${features.join('\n')}\n\n`
  }
  if (fixes.length > 0) {
    changelog += `### 🐛 Bug Fixes\n${fixes.join('\n')}\n\n`
  }
  if (breaking.length > 0) {
    changelog += `### ⚠️ Breaking Changes\n${breaking.join('\n')}\n\n`
  }
  if (internal.length > 0) {
    changelog += `### 🔧 Internal\n${internal.join('\n')}\n\n`
  }

  const contributors = [...new Set(commits.map(c => c.author).filter(Boolean))]
  if (contributors.length > 0) {
    changelog += `### 👥 Contributors\nThank you to ${contributors.join(', ')} for contributing to this release.\n`
  }

  return changelog
}

// Simple in-memory rate limit (production would use Redis/DB)
const usageMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const monthMs = 30 * 24 * 60 * 60 * 1000
  
  const usage = usageMap.get(ip)
  if (!usage || now > usage.resetAt) {
    usageMap.set(ip, { count: 1, resetAt: now + monthMs })
    return { allowed: true, remaining: 2 }
  }
  
  if (usage.count >= 3) {
    return { allowed: false, remaining: 0 }
  }
  
  usage.count++
  return { allowed: true, remaining: 3 - usage.count }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { repo, fromTag, toTag, token } = body

    if (!repo) {
      return NextResponse.json({ error: 'Repository is required' }, { status: 400 })
    }

    // Validate repo format
    if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) {
      return NextResponse.json({ error: 'Invalid repository format. Use owner/repo' }, { status: 400 })
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { allowed, remaining } = checkRateLimit(ip)
    
    if (!allowed) {
      return NextResponse.json({
        error: 'Free tier limit reached (3/month). Upgrade to Pro for unlimited changelogs.',
        upgradeUrl: '/checkout?plan=pro'
      }, { status: 429 })
    }

    // Fetch commits from GitHub
    let commits: CommitData[]
    try {
      commits = await fetchGitHubCommits(repo, fromTag || '', toTag || '', token)
    } catch (err: any) {
      return NextResponse.json({ 
        error: `GitHub error: ${err.message}` 
      }, { status: 400 })
    }

    if (commits.length === 0) {
      return NextResponse.json({ error: 'No commits found in the specified range' }, { status: 400 })
    }

    // Limit to 100 commits
    const limitedCommits = commits.slice(0, 100)

    // Generate changelog
    let changelog: string
    if (ANTHROPIC_API_KEY) {
      try {
        changelog = await generateWithClaude(repo, limitedCommits, fromTag || '', toTag || '')
      } catch (err) {
        // Fallback to rule-based generation
        changelog = generateFallbackChangelog(repo, limitedCommits, fromTag || '', toTag || '')
      }
    } else {
      changelog = generateFallbackChangelog(repo, limitedCommits, fromTag || '', toTag || '')
    }

    const contributors = [...new Set(limitedCommits.map(c => c.author).filter(Boolean))]

    return NextResponse.json({
      changelog,
      stats: {
        commits: limitedCommits.length,
        prs: 0,
        contributors: contributors.length,
      },
      remaining,
    })

  } catch (err: any) {
    console.error('Generation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
