// app/api/status/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      online: true,
      version: process.env.LOADER_VERSION ?? "1.0.0",
      name: process.env.LOADER_NAME ?? "Script Loader",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
