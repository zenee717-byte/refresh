// src/app/api/status/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      online: true,
      version: "2.0.0",
      timestamp: new Date().toISOString(),
      message: "Script Loader is operational",
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
