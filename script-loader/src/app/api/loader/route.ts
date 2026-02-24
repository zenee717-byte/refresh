// src/app/api/loader/route.ts
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, validateLoaderKey, isAbusePattern } from "@/lib/rateLimit";
import { logRequest } from "@/lib/logger";
import { getObfuscatedScript } from "@/lib/script";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");
  const timestamp = new Date().toISOString();

  // 1. Anti-abuse check
  if (isAbusePattern(userAgent, ip)) {
    logRequest({ timestamp, ip, endpoint: "/api/loader", userAgent, status: "blocked", reason: "Abuse pattern detected" });
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. Rate limit check
  const rl = rateLimit(ip);
  if (!rl.allowed) {
    logRequest({ timestamp, ip, endpoint: "/api/loader", userAgent, status: "blocked", reason: "Rate limit exceeded" });
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  // 3. Optional key validation
  if (!validateLoaderKey(request)) {
    logRequest({ timestamp, ip, endpoint: "/api/loader", userAgent, status: "blocked", reason: "Invalid loader key" });
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 4. Serve the protected script
  logRequest({ timestamp, ip, endpoint: "/api/loader", userAgent, status: "allowed" });

  const script = getObfuscatedScript();

  return new NextResponse(script, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "X-RateLimit-Remaining": String(rl.remaining),
    },
  });
}
