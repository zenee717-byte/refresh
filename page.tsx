// app/api/loader/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { rateLimit, getClientIP, logAccess } from "@/lib/rateLimit";

export const runtime = "nodejs"; // must be nodejs to access fs

// ─── Config ───────────────────────────────────────────────────────
const RATE_LIMIT = {
  limit: 10,       // max requests
  windowMs: 60_000 // per 60 seconds per IP
};

// ─── Helper: validate key if KEY_REQUIRED is set ──────────────────
function validateKey(request: NextRequest): boolean {
  const required = process.env.LOADER_KEY;
  if (!required) return true; // key system disabled

  const key =
    request.nextUrl.searchParams.get("key") ??
    request.headers.get("x-loader-key");

  return key === required;
}

// ─── Helper: load script from file or env var ─────────────────────
function getScript(): string {
  // Priority 1: SCRIPT_CONTENT env var (for Vercel — paste obfuscated script here)
  if (process.env.SCRIPT_CONTENT) {
    return process.env.SCRIPT_CONTENT;
  }

  // Priority 2: data/script.lua file (bundled with deployment)
  try {
    const filePath = join(process.cwd(), "data", "script.lua");
    return readFileSync(filePath, "utf-8");
  } catch {
    return '-- Script not configured. Set SCRIPT_CONTENT env var.\nprint("No script loaded")';
  }
}

// ─── GET /api/loader ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  // 1. Rate limiting
  const limit = rateLimit(ip, RATE_LIMIT);
  if (!limit.allowed) {
    logAccess(ip, "/api/loader", "rate-limited");
    return new NextResponse(
      '-- Rate limit exceeded. Try again later.\nerror("[Loader] Rate limited")',
      {
        status: 429,
        headers: {
          "Content-Type": "text/plain",
          "X-RateLimit-Limit": String(RATE_LIMIT.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(limit.resetAt),
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  // 2. Key validation (optional)
  if (!validateKey(request)) {
    logAccess(ip, "/api/loader", "invalid-key");
    return new NextResponse(
      '-- Invalid or missing key.\nerror("[Loader] Unauthorized")',
      { status: 403, headers: { "Content-Type": "text/plain" } }
    );
  }

  // 3. Log access
  const keyUsed = request.nextUrl.searchParams.get("key") ?? undefined;
  logAccess(ip, "/api/loader", keyUsed);

  // 4. Serve script
  const script = getScript();

  return new NextResponse(script, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      "X-RateLimit-Limit": String(RATE_LIMIT.limit),
      "X-RateLimit-Remaining": String(limit.remaining),
      "X-RateLimit-Reset": String(limit.resetAt),
      // Block direct browser access (soft)
      "X-Frame-Options": "DENY",
    },
  });
}
