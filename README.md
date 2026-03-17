# 📋 ChangelogAI

> AI-powered release notes generator. Turn GitHub commits into beautiful changelogs in 10 seconds.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/changelog-ai)

## 🚀 Live Demo

**Web App:** https://changelog-ai.vercel.app  
**Try it free:** 3 changelogs/month, no account required

## ✨ Features

- **Instant generation** — input repo + tags → changelog in 10 seconds
- **AI-powered** — Claude AI groups and rewrites commits in user-friendly language  
- **Smart categorization** — Features, Bug Fixes, Breaking Changes, Security
- **Multiple formats** — Markdown, JSON, HTML
- **CLI tool** — for terminal power users
- **Private repos** — with GitHub token (Pro plan)
- **Stripe payments** — Free (3/mo) or Pro ($9/mo unlimited)

## 📦 Quick Start

### Web App

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run dev server
npm run dev
# → http://localhost:3000
```

### CLI Tool

```bash
# Install dependencies  
pip install anthropic requests

# Set API key
export ANTHROPIC_API_KEY=sk-ant-...
export GITHUB_TOKEN=ghp_...  # optional

# Generate changelog
python3 cli/changelog-ai.py vercel/next.js --from v14.0.0 --to v14.1.0

# Save to file
python3 cli/changelog-ai.py facebook/react --output CHANGELOG.md
```

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for AI generation |
| `GITHUB_TOKEN` | No | For private repos / higher rate limits |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_PRICE_PRO` | Yes | Stripe Price ID for Pro plan |
| `NEXT_PUBLIC_APP_URL` | Yes | Your deployed URL |

## 🚢 Deploy to Vercel

```bash
npx vercel --prod
```

See [LAUNCH.md](./LAUNCH.md) for complete deployment guide.

## 📊 Architecture

```
changelog-ai/
├── app/
│   ├── page.tsx              # Landing page
│   ├── generate/page.tsx     # Generator UI
│   ├── checkout/page.tsx     # Stripe checkout
│   └── api/
│       ├── generate/route.ts  # Core API: GitHub + AI
│       └── stripe/
│           ├── create-checkout/route.ts
│           └── webhook/route.ts
├── cli/
│   └── changelog-ai.py       # CLI tool
└── LAUNCH.md                  # Deployment & GTM guide
```

## 💰 Pricing

- **Free:** 3 changelogs/month, public repos
- **Pro:** $9/month, unlimited, private repos, priority support

## 📝 License

MIT — build on it, ship it, make money.

---

*Part of P2-F AI Micro Tools Factory · RT-593*
