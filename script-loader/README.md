# ⚡ Script Loader — Next.js + Vercel

Secure Lua script loader. Script served via API only — never exposed in frontend source.

## 📁 Structure

```
script-loader/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Loader UI (card)
│   ├── globals.css         # Tailwind + custom styles
│   └── api/
│       ├── loader/route.ts # GET /api/loader → serves Lua script
│       └── status/route.ts # GET /api/status → { online: true }
├── lib/
│   └── rateLimit.ts        # In-memory rate limiter + IP logger
├── data/
│   └── script.lua          # ← Your obfuscated Lua goes here
├── .env.example
├── vercel.json
└── package.json
```

---

## 🚀 Deploy to Vercel (Step by Step)

### Step 1 — Place your script

Put your obfuscated `.lua` file at `data/script.lua`.  
The `g.lua` file from the obfuscator is already there.

### Step 2 — Install deps & test locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
# Visit http://localhost:3000
```

### Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "init: script loader"
git remote add origin https://github.com/yourusername/script-loader.git
git push -u origin main
```

### Step 4 — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Add Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_HUB_NAME` | `Script Loader` |
| `NEXT_PUBLIC_HUB_SUB` | `Script Loader` |
| `NEXT_PUBLIC_HUB_EMOJI` | `⚡` |
| `NEXT_PUBLIC_LOADER_URL` | `https://YOUR-PROJECT.vercel.app/api/loader` |
| `NEXT_PUBLIC_WEBSITE_URL` | `https://yoursite.com` |
| `NEXT_PUBLIC_DISCORD_URL` | `https://discord.gg/...` |
| `LOADER_VERSION` | `1.0.0` |
| `LOADER_KEY` | *(optional)* secret key |

5. Click **Deploy** → Done!

---

## 🔑 Key System (Optional)

Set `LOADER_KEY=mysecretkey` in Vercel env vars.

Users must call the API with `?key=mysecretkey` or header `x-loader-key: mysecretkey`.

**Loadstring with key:**
```lua
loadstring(game:HttpGet("https://your-project.vercel.app/api/loader?key=mysecretkey"))()
```

---

## 📡 API Reference

### `GET /api/loader`

Returns the obfuscated Lua script.

| Query param | Required | Description |
|-------------|----------|-------------|
| `key` | Only if `LOADER_KEY` is set | Validation key |

**Rate limit:** 10 requests / 60 seconds per IP.

**Example Lua loadstring:**
```lua
loadstring(game:HttpGet("https://your-project.vercel.app/api/loader"))()
```

### `GET /api/status`

Returns server status.

```json
{
  "online": true,
  "version": "1.0.0",
  "name": "Script Loader",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## 🔒 Security Features

| Feature | Details |
|---------|---------|
| Script hidden from frontend | Script lives in `data/script.lua` server-side only |
| Rate limiting | 10 req/60s per IP (in-memory; swap for Upstash Redis in prod) |
| IP logging | All requests logged with timestamp + IP |
| Key validation | Optional `LOADER_KEY` env var |
| No-cache headers | `Cache-Control: no-store` on all API responses |
| noindex | `X-Robots-Tag: noindex` prevents search engine indexing |

---

## 🔄 Updating the Script

1. Replace `data/script.lua` with new obfuscated output
2. `git add data/script.lua && git commit -m "update script" && git push`
3. Vercel auto-deploys in ~30 seconds

---

## 📦 Production Upgrade: Redis Rate Limiter

For multi-region / persistent rate limiting, replace `lib/rateLimit.ts` with Upstash Redis:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Add to Vercel env:
```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```
