// src/lib/logger.ts

export interface LogEntry {
  timestamp: string;
  ip: string;
  endpoint: string;
  userAgent: string | null;
  status: "allowed" | "blocked" | "error";
  reason?: string;
}

export function logRequest(entry: LogEntry): void {
  // In production, replace with your logging service (e.g., Axiom, Logtail, etc.)
  const emoji = entry.status === "allowed" ? "✅" : entry.status === "blocked" ? "🚫" : "❌";
  console.log(
    `${emoji} [${entry.timestamp}] ${entry.endpoint} | IP: ${entry.ip} | Status: ${entry.status}${
      entry.reason ? ` | Reason: ${entry.reason}` : ""
    } | UA: ${entry.userAgent?.substring(0, 60) ?? "none"}`
  );
}
