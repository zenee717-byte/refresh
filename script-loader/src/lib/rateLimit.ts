// src/lib/rateLimit.ts
// In-memory rate limiter (for Vercel serverless — resets per cold start)
// For production scale, replace with Redis/Upstash

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "10");
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000");

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    store.set(ip, newRecord);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  store.set(ip, record);
  return { allowed: true, remaining: MAX_REQUESTS - record.count, resetAt: record.resetAt };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIp) return realIp;
  return "unknown";
}

export function validateLoaderKey(request: Request): boolean {
  const loaderKey = process.env.LOADER_KEY;
  // If no key is configured, skip validation
  if (!loaderKey) return true;
  const providedKey = request.headers.get("x-loader-key") || new URL(request.url).searchParams.get("key");
  return providedKey === loaderKey;
}

export function isAbusePattern(userAgent: string | null, ip: string): boolean {
  if (!userAgent) return true; // Block requests with no user agent
  const blockedAgents = ["curl", "wget", "python-requests", "axios", "httpclient"];
  const ua = userAgent.toLowerCase();
  // Allow Roblox HTTP service but block generic scrapers
  if (ua.includes("roblox")) return false;
  for (const agent of blockedAgents) {
    if (ua.includes(agent)) return true;
  }
  return false;
}
