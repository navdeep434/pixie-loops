"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-96 bg-gray-50">

      {/* Soft radial glow behind the mark */}
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          animation: "pulse-glow 2.4s ease-in-out infinite",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">

        {/* Monogram mark */}
        <div className="relative">
          {/* Outer ring — draws itself */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40" cy="40" r="36"
              stroke="url(#ring-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: 226,
                strokeDashoffset: 226,
                animation: "draw-ring 1.6s cubic-bezier(0.4,0,0.2,1) forwards",
              }}
            />
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>

          {/* PL monogram — fades in after ring */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: "fade-up 0.5s ease forwards 1.2s", opacity: 0 }}
          >
            <span
              className="text-xl font-bold tracking-tight select-none"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
              }}
            >
              PL
            </span>
          </div>

          {/* Orbiting dot */}
          <div
            className="absolute inset-0"
            style={{ animation: "orbit 1.6s linear infinite" }}
          >
            <div
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: "2px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                boxShadow: "0 0 6px rgba(168,85,247,0.8)",
              }}
            />
          </div>
        </div>

        {/* Text + bar */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: "fade-up 0.6s ease forwards 0.8s", opacity: 0 }}
        >
          <p
            className="text-sm font-medium tracking-widest uppercase text-gray-400"
            style={{ letterSpacing: "0.2em" }}
          >
            Loading
          </p>

          {/* Progress bar */}
          <div className="w-32 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #a855f7, #ec4899, #f43f5e)",
                animation: "progress 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes draw-ring {
          to { stroke-dashoffset: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes progress {
          0%   { width: 0%;    margin-left: 0%; }
          50%  { width: 60%;   margin-left: 20%; }
          100% { width: 0%;    margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}