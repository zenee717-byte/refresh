"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Config (from env or defaults) ──────────────────────────────────
// These are PUBLIC values — set them in .env as NEXT_PUBLIC_*
const HUB_NAME     = process.env.NEXT_PUBLIC_HUB_NAME     ?? "Script Loader";
const HUB_SUB      = process.env.NEXT_PUBLIC_HUB_SUB      ?? "Script Loader";
const HUB_EMOJI    = process.env.NEXT_PUBLIC_HUB_EMOJI    ?? "⚡";
const WEBSITE_URL  = process.env.NEXT_PUBLIC_WEBSITE_URL  ?? "#";
const DISCORD_URL  = process.env.NEXT_PUBLIC_DISCORD_URL  ?? "#";
const LOADER_URL   = process.env.NEXT_PUBLIC_LOADER_URL   ?? "/api/loader";

// The loadstring shown to the user
const LOADSTRING = `loadstring(game:HttpGet("${LOADER_URL}"))()`;

// ─── Icons ───────────────────────────────────────────────────────────
const IconGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconDiscord = () => (
  <svg width="16" height="13" viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
  </svg>
);

const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── Toast ───────────────────────────────────────────────────────────
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2.5 px-4 py-3
        rounded-xl border border-white/10
        text-sm font-medium text-white
        transition-all duration-300
        ${visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }
      `}
      style={{ background: "rgba(20,20,20,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
    >
      <span className="text-[#3dd68c]"><IconCheck /></span>
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function Home() {
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [online, setOnline] = useState(true);

  // Ping status endpoint
  useEffect(() => {
    fetch("/api/status")
      .then(r => r.json())
      .then(d => setOnline(d.online === true))
      .catch(() => setOnline(false));
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(LOADSTRING).then(() => {
      setCopied(true);
      setToastVisible(true);
      setTimeout(() => {
        setCopied(false);
        setToastVisible(false);
      }, 2200);
    });
  }, []);

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,109,250,0.08) 0%, transparent 70%), #080808" }} />

      {/* Glow blobs */}
      <div className="glow-blob" style={{ width: 600, height: 400, top: "-15%", left: "50%", transform: "translateX(-50%)", background: "rgba(124,109,250,0.055)", zIndex: 0 }} />
      <div className="glow-blob" style={{ width: 300, height: 300, bottom: "5%", right: "5%", background: "rgba(61,214,140,0.03)", zIndex: 0 }} />

      {/* Center layout */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] animate-card">

          {/* ── CARD ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(16,16,16,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 40px 80px rgba(0,0,0,0.7), 0 0 80px rgba(124,109,250,0.05)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Top accent line */}
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(124,109,250,0.5), rgba(61,214,140,0.3), transparent)" }} />

            <div className="p-8">

              {/* ── HEADER ── */}
              <div className="flex flex-col items-center text-center mb-7">
                {/* Logo */}
                <div
                  className="w-16 h-16 rounded-[18px] flex items-center justify-center mb-4 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, #1c1c1c, #141414)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(124,109,250,0.18) 0%, transparent 60%)" }} />
                  <span className="text-3xl relative" style={{ filter: "drop-shadow(0 0 10px rgba(124,109,250,0.7))" }}>
                    {HUB_EMOJI}
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-[22px] font-semibold tracking-tight mb-1" style={{ color: "#ebebeb", letterSpacing: "-0.3px" }}>
                  {HUB_NAME}
                </h1>
                <p className="text-[13px] mb-4" style={{ color: "#777" }}>{HUB_SUB}</p>

                {/* Status badge */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(61,214,140,0.08)", border: "1px solid rgba(61,214,140,0.2)", color: "#3dd68c" }}
                >
                  <span
                    className="status-dot"
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#3dd68c", display: "block", flexShrink: 0 }}
                  />
                  {online ? "Online" : "Checking..."}
                </div>
              </div>

              {/* ── HOW TO EXECUTE ── */}
              <div
                className="rounded-xl p-4 mb-3"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">🔒</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#f5c542" }}>
                    How to Execute
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "#777" }}>
                  This script can only be executed from a Roblox executor.
                  Copy the code below and paste it into your executor&apos;s script box.
                </p>
              </div>

              {/* ── CODE BOX ── */}
              <div
                className="rounded-xl flex items-center gap-3 mb-6 group transition-colors duration-200"
                style={{
                  background: "rgba(10,10,10,0.9)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "13px 14px",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              >
                <code
                  className="flex-1 min-w-0 overflow-hidden font-mono text-[12px] leading-relaxed"
                  style={{
                    color: "#a0d4a0",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    display: "block",
                    overflow: "hidden",
                    userSelect: "all",
                  }}
                  title={LOADSTRING}
                >
                  {LOADSTRING}
                </code>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 w-[34px] h-[34px] rounded-[8px] flex items-center justify-center transition-all duration-150 cursor-pointer"
                  style={{
                    background: copied ? "rgba(61,214,140,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copied ? "rgba(61,214,140,0.3)" : "rgba(255,255,255,0.09)"}`,
                    color: copied ? "#3dd68c" : "#888",
                  }}
                  title="Copy"
                >
                  {copied ? <IconCheck /> : <IconCopy />}
                </button>
              </div>

              {/* ── BUTTONS ── */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-[11px] rounded-xl text-[13.5px] font-medium transition-all duration-150 hover:scale-[1.01] active:scale-[0.98]"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "#ccc",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#212121"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                >
                  <IconGlobe /> Website
                </a>

                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-[11px] rounded-xl text-[13.5px] font-medium text-white transition-all duration-150 hover:scale-[1.01] active:scale-[0.98]"
                  style={{
                    background: "#5865f2",
                    boxShadow: "0 4px 16px rgba(88,101,242,0.3)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#6674f3"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(88,101,242,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#5865f2"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(88,101,242,0.3)"; }}
                >
                  <IconDiscord /> Join Discord
                </a>
              </div>

            </div>

            {/* Bottom line */}
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />
          </div>

          {/* Footer */}
          <p className="text-center mt-5 text-[11.5px]" style={{ color: "#3a3a3a" }}>
            Secured by LuaShield
          </p>
        </div>
      </main>

      {/* Toast */}
      <Toast message="Copied to clipboard!" visible={toastVisible} />
    </>
  );
}
