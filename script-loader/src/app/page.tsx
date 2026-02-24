"use client";

import { useState, useEffect, useCallback } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "#";
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "#";

const LOADSTRING_CODE = `loadstring(game:HttpGet("${APP_URL || "https://your-app.vercel.app"}/api/loader"))()`;

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

function ToastNotification({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  const colors = {
    success: "border-emerald-500/40 bg-emerald-950/80 text-emerald-300",
    error: "border-red-500/40 bg-red-950/80 text-red-300",
    info: "border-purple-500/40 bg-purple-950/80 text-purple-300",
  };
  const icons = { success: "✓", error: "✕", info: "i" };

  return (
    <div
      className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl text-sm font-medium shadow-2xl ${colors[toast.type]}`}
    >
      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current/20 text-xs font-bold">
        {icons[toast.type]}
      </span>
      {toast.message}
    </div>
  );
}

function StatusBadge({ online }: { online: boolean | null }) {
  if (online === null) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
        Checking...
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${online ? "text-emerald-400" : "text-red-400"}`}>
      <div className="relative w-2 h-2">
        <div className={`absolute inset-0 rounded-full ${online ? "bg-emerald-400" : "bg-red-400"}`} />
        {online && (
          <div className="absolute inset-0 rounded-full bg-emerald-400 ping opacity-75" />
        )}
      </div>
      {online ? "ONLINE" : "OFFLINE"}
    </div>
  );
}

export default function Home() {
  const [online, setOnline] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = toastId + 1;
    setToastId(id);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, [toastId]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => setOnline(d.online === true))
      .catch(() => setOnline(false));
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(LOADSTRING_CODE);
      setCopied(true);
      addToast("Loadstring copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Failed to copy. Please copy manually.", "error");
    }
  };

  return (
    <main className="min-h-screen bg-grid relative flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.03) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full opacity-30 pointer-events-none"
          style={{
            background: i % 2 === 0 ? "#a855f7" : "#3b82f6",
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      {/* Main card */}
      <div className="glass rounded-2xl w-full max-w-lg float relative overflow-hidden animated-border">
        {/* Scan line */}
        <div className="scanline" />

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-start justify-between mb-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))",
                  border: "1px solid rgba(168,85,247,0.3)",
                }}
              >
                ⚡
              </div>
              <div>
                <h1
                  className="text-lg font-bold tracking-wide"
                  style={{
                    background: "linear-gradient(135deg, #e2e8f0 0%, #a855f7 50%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Script Loader
                </h1>
                <p className="text-[10px] text-slate-500 tracking-widest uppercase">v2.0 — Secure</p>
              </div>
            </div>

            {/* Status */}
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <StatusBadge online={online} />
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            Secure, obfuscated Lua script distribution. Copy the loadstring below and execute it in your preferred executor.
          </p>
        </div>

        {/* Loadstring section */}
        <div className="px-8 py-6 border-b border-white/5">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">
            Execute Script
          </label>

          <div className="relative group">
            <input
              readOnly
              value={LOADSTRING_CODE}
              className="code-input w-full px-4 py-3 pr-12 rounded-xl text-sm text-purple-300 overflow-hidden"
              style={{ textOverflow: "ellipsis" }}
              onFocus={(e) => e.target.select()}
            />

            {/* Copy button inside input */}
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
              style={{
                background: copied
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(168, 85, 247, 0.15)",
                border: copied
                  ? "1px solid rgba(16, 185, 129, 0.4)"
                  : "1px solid rgba(168, 85, 247, 0.3)",
              }}
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="glow-btn mt-3 w-full py-3 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
            }}
          >
            {copied ? "✓ Copied!" : "Copy Loadstring"}
          </button>
        </div>

        {/* How to Execute */}
        <div className="px-8 py-6 border-b border-white/5">
          <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
            How to Execute
          </h2>

          <div className="space-y-3">
            {[
              { step: "01", title: "Open Executor", desc: "Launch your preferred Lua executor (e.g. Delta, Hydrogen, Celery)" },
              { step: "02", title: "Copy Loadstring", desc: "Click the copy button above to copy the loadstring command" },
              { step: "03", title: "Paste & Execute", desc: "Paste the loadstring into the executor console and press Execute" },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
                style={{ border: "1px solid transparent" }}
              >
                <div className="flex-shrink-0">
                  <span className="step-num text-2xl font-black leading-none">{step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-0.5">{title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-300 transition-all duration-200 hover:text-white hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
              Website
            </a>

            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-indigo-300 transition-all duration-200 hover:text-white hover:bg-indigo-500/10"
              style={{ border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
            </a>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-600 mt-4 tracking-wide">
            PROTECTED BY SCRIPT LOADER API · {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </main>
  );
}
