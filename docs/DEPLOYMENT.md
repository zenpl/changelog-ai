# ChangelogAI — Deployment Guide

## Prerequisites

- Node.js 18+
- Vercel account (free tier is fine)
- Anthropic API key
- Stripe account

---

## Step 1: Local Build Verification

```bash
cd products/P2-F/changelog-ai
npm install
npm run build   # Should show 9 routes, 0 errors
```

---

## Step 2: GitHub Repository

```bash
# From the product directory
git init
git add .
git commit -m "feat: ChangelogAI MVP v0.1.0"
gh repo create changelog-ai --public --source=. --remote=origin --push
```

---

## Step 3: Stripe Setup

1. Go to [dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Create product: **"ChangelogAI Pro"**
   - Price: $9.00 / month (recurring)
   - Copy the **Price ID** → `price_xxxxx`
3. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
4. Add endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`
5. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
6. Copy **Webhook Signing Secret** → `whsec_xxxxx`

---

## Step 4: Vercel Deployment

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `GITHUB_TOKEN` | `ghp_...` (optional) |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRICE_PRO` | `price_...` |
| `NEXT_PUBLIC_APP_URL` | `https://changelog-ai.vercel.app` |

5. Click **Deploy**

### Option B: Vercel CLI

```bash
npm i -g vercel
cd products/P2-F/changelog-ai
vercel --prod
```

---

## Step 5: Post-Deploy Verification

```bash
# Test generation API
curl -X POST https://YOUR_DOMAIN/api/generate \
  -H "Content-Type: application/json" \
  -d '{"repo":"vercel/next.js","fromTag":"v14.0.0","toTag":"v14.1.0"}'

# Should return: {"changelog":"...","stats":{"commits":N,...},"remaining":2}
```

---

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add domain: `changelog.ai` or `changelogai.dev`
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` env var

---

## CLI Tool Distribution

```bash
# Users can install the CLI:
curl -O https://raw.githubusercontent.com/YOUR_ORG/changelog-ai/main/cli/changelog-ai.py
chmod +x changelog-ai.py

# Run:
ANTHROPIC_API_KEY=sk-ant-... python3 changelog-ai.py vercel/next.js --from v14.0.0 --to v14.1.0
```

---

## Monitoring

- Vercel Analytics: enabled by default
- Error tracking: check Vercel function logs
- Stripe revenue: [dashboard.stripe.com](https://dashboard.stripe.com)

---

*ChangelogAI v0.1.0 · RT-593 · P2-F*
