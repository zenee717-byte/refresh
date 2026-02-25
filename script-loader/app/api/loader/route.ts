// app/api/loader/route.ts
import { NextRequest, NextResponse } from "next/server";
import SCRIPT from "@/lib/script"; // embedded at build time — always works on Vercel
import { rateLimit, getClientIP, logAccess } from "@/lib/rateLimit";

export const runtime = "nodejs";

const RATE_LIMIT = { limit: 10, windowMs: 60_000 };

function validateKey(request: NextRequest): boolean {
  const required = process.env.LOADER_KEY;
  if (!required) return true;
  const key =
    request.nextUrl.searchParams.get("key") ??
    request.headers.get("x-loader-key");
  return key === required;
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);

  // Rate limit
  const limit = rateLimit(ip, RATE_LIMIT);
  if (!limit.allowed) {
    logAccess(ip, "/api/loader", "rate-limited");
    return new NextResponse(
      '-- Rate limit exceeded.\nerror("[Loader] Too many requests")',
      {
        status: 429,
        headers: {
          "Content-Type": "text/plain",
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  // Key check
  if (!validateKey(request)) {
    logAccess(ip, "/api/loader", "invalid-key");
    return new NextResponse('-- Unauthorized.\nerror("[Loader] Invalid key")', {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  logAccess(ip, "/api/loader", request.nextUrl.searchParams.get("key") ?? undefined);

  // Serve script — bundled at build time, guaranteed non-empty
  return new NextResponse(SCRIPT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      "X-RateLimit-Limit": String(RATE_LIMIT.limit),
      "X-RateLimit-Remaining": String(limit.remaining),
    },
  });
}
