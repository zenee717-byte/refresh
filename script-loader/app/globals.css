@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --accent: #7c6dfa;
  --accent-dim: rgba(124,109,250,0.12);
  --accent-glow: rgba(124,109,250,0.3);
}

* { box-sizing: border-box; }

html, body {
  margin: 0; padding: 0;
  font-family: 'Inter', system-ui, sans-serif;
  background: #080808;
  color: #e2e2e2;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }

/* Glass card base */
.glass {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.07);
}

/* Noise overlay */
.noise::before {
  content: '';
  position: fixed; inset: 0; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  pointer-events: none;
}

/* Glow blob */
.glow-blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

/* Toast animation */
@keyframes toastIn {
  from { opacity: 0; transform: translateY(8px) scale(0.95); }
  to   { opacity: 1; transform: none; }
}
@keyframes toastOut {
  from { opacity: 1; }
  to   { opacity: 0; transform: translateY(-4px); }
}
.toast-enter { animation: toastIn 0.25s cubic-bezier(0.16,1,0.3,1) both; }
.toast-exit  { animation: toastOut 0.2s ease both; }

/* Fade animations */
@keyframes fadeUpCard {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
.animate-card { animation: fadeUpCard 0.55s cubic-bezier(0.16,1,0.3,1) both; }

/* Status blink */
@keyframes statusBlink {
  0%,100% { opacity: 1; box-shadow: 0 0 6px #3dd68c; }
  50%      { opacity: 0.3; box-shadow: none; }
}
.status-dot { animation: statusBlink 2.5s ease infinite; }
