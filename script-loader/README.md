# ⚡ Script Loader

> Secure, premium Lua script distribution platform built with Next.js 14 + Vercel.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?logo=tailwindcss)

---

## 📁 Project Structure

```
script-loader/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── loader/
│   │   │   │   └── route.ts          ← GET /api/loader (serves Lua script)
│   │   │   └── status/
│   │   │       └── route.ts          ← GET /api/status (health check)
│   │   ├── globals.css               ← Global styles + animations
│   │   ├── layout.tsx                ← Root layout
│   │   └── page.tsx                  ← Main frontend UI
│   └── lib/
│       ├── rateLimit.ts              ← Rate limiter + IP logging + anti-abuse
│       ├── logger.ts                 ← Request logger
│       └── script.ts                 ← Your protected Lua script (NEVER public)
├── public/
├── .env.example                      ← Environment variables template
├── vercel.json                       ← Vercel configuration
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Clone or Download the Project
```bash
git clone https://github.com/yourusername/script-loader.git
cd script-loader
```

### Step 2 — Install Dependencies (local test)
```bash
npm install
```

### Step 3 — Set Up Environment Variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your values (see Environment Variables section below).

### Step 4 — Test Locally
```bash
npm run dev
```
Visit `http://localhost:3000` — check that the card loads and `/api/status` returns `{"online":true}`.

### Step 5 — Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial script loader"
git branch -M main
git remote add origin https://github.com/yourusername/script-loader.git
git push -u origin main
```

### Step 6 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Click **Environment Variables** and add all variables from the table below
5. Click **Deploy** ✅

### Step 7 — Set Your App URL
After first deploy, copy your Vercel URL (e.g. `https://your-app.vercel.app`) and add it:
- `NEXT_PUBLIC_APP_URL` → `https://your-app.vercel.app`

Redeploy once to apply.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | ✅ | Your Vercel deployment URL |
| `API_SECRET_KEY` | ✅ | Secret key (32 hex chars) for internal signing |
| `LOADER_KEY` | Optional | Key required in Lua `x-loader-key` header |
| `NEXT_PUBLIC_DISCORD_URL` | Optional | Discord invite link |
| `NEXT_PUBLIC_WEBSITE_URL` | Optional | Your website URL |
| `RATE_LIMIT_MAX` | Optional | Max requests per IP per window (default: 10) |
| `RATE_LIMIT_WINDOW_MS` | Optional | Rate limit window in ms (default: 60000) |

Generate a secure key:
```bash
openssl rand -hex 32
```

---

## 🌙 Lua Script Configuration

### Edit Your Script
Open `src/lib/script.ts` and replace the `rawScript` content with your actual Lua code.

For production obfuscation, use tools like:
- **[Luraph](https://luraph.net/)** — Premium Lua obfuscator
- **[Moonsec](https://moonsec.com/)** — Anti-cheat grade obfuscation  
- **[Ironbrew 2](https://github.com/Trollicus/ironbrew-2)** — Open source obfuscator

Once obfuscated, replace the `rawScript` variable with your pre-obfuscated string and set `btoa_node` to return it directly.

### Loadstring Examples

**Basic (no key)**:
```lua
loadstring(game:HttpGet("https://your-app.vercel.app/api/loader"))()
```

**With loader key validation**:
```lua
-- Method 1: URL parameter
loadstring(game:HttpGet("https://your-app.vercel.app/api/loader?key=YOUR_KEY"))()

-- Method 2: Header (executor-dependent)
local HttpService = game:GetService("HttpService")
local response = HttpService:RequestAsync({
    Url = "https://your-app.vercel.app/api/loader",
    Method = "GET",
    Headers = {
        ["x-loader-key"] = "YOUR_LOADER_KEY"
    }
})
if response.Success then
    loadstring(response.Body)()
end
```

**With error handling**:
```lua
local ok, err = pcall(function()
    loadstring(game:HttpGet("https://your-app.vercel.app/api/loader"))()
end)
if not ok then
    warn("[Loader] Failed: " .. tostring(err))
end
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---|---|
| **Rate Limiting** | 10 req/min per IP (configurable) |
| **IP Logging** | Every request logged with timestamp |
| **Anti-Abuse** | Blocks curl, wget, python-requests etc. |
| **Key Validation** | Optional `LOADER_KEY` env var |
| **No Hardcoded Script** | Script lives in server-only `src/lib/script.ts` |
| **Security Headers** | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` |
| **No Caching** | `Cache-Control: no-store` prevents CDN caching of scripts |

### Upgrade to Redis Rate Limiting (Production Scale)
For high traffic, replace the in-memory store in `src/lib/rateLimit.ts` with [Upstash Redis](https://upstash.com/):
```bash
npm install @upstash/ratelimit @upstash/redis
```

---

## 🎨 Customization

- **Colors**: Edit CSS variables in `globals.css` (`:root`)
- **Script Name**: Edit `<title>` in `layout.tsx` and card header in `page.tsx`
- **Steps**: Edit the "How to Execute" steps array in `page.tsx`
- **Branding**: Replace the ⚡ emoji logo with an `<Image>` component

---

## 📄 License

MIT — Use freely, don't sell as your own.
