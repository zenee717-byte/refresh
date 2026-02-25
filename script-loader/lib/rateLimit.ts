// lib/rateLimit.ts
// In-memory rate limiter (per Vercel serverless instance)
// For production, replace with Redis / Upstash

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /** Max requests in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(ip: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + config.windowMs;
    store.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: config.limit - 1, resetAt };
  }

  if (entry.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
}

/** Get client IP from Next.js request headers */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP.trim();
  return "unknown";
}

/** Lightweight IP log — replace with DB/external service in production */
export function logAccess(ip: string, endpoint: string, keyUsed?: string) {
  const timestamp = new Date().toISOString();
  console.log(
    JSON.stringify({ timestamp, ip, endpoint, key: keyUsed ?? "none" })
  );
}
