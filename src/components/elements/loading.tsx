"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="relative w-64 h-64">
        
        {/* Yarn Ball */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-32 h-32">
            {/* Main Ball */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 shadow-2xl animate-pulse-slow">
              {/* Yarn Texture Lines */}
              <div className="absolute inset-2 rounded-full border-4 border-white/30 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-4 border-white/20 animate-spin-reverse"></div>
              <div className="absolute inset-6 rounded-full border-4 border-white/10 animate-spin-slow"></div>
              
              {/* Shine Effect */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/40 blur-md"></div>
            </div>
            
            {/* Loose Yarn Thread */}
            <svg className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64" viewBox="0 0 200 200">
              <path
                d="M100,80 Q110,60 120,50 T140,35 Q150,30 160,28"
                fill="none"
                stroke="url(#yarn-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-draw"
              />
              <defs>
                <linearGradient id="yarn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Knitting Needles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 animate-needles">
          {/* Left Needle */}
          <div className="absolute top-8 left-12 w-2 h-32 bg-gradient-to-b from-amber-300 to-amber-600 rounded-full transform -rotate-45 origin-bottom shadow-lg">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400"></div>
          </div>
          
          {/* Right Needle */}
          <div className="absolute top-8 right-12 w-2 h-32 bg-gradient-to-b from-amber-300 to-amber-600 rounded-full transform rotate-45 origin-bottom shadow-lg">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400"></div>
          </div>
          
          {/* Yarn Loop on Needles */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200">
            <path
              d="M60,80 Q80,70 100,70 T140,80"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-loop"
            />
          </svg>
        </div>

        {/* Floating Yarn Bits */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 animate-float"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Crochet Hook */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-hook">
          <div className="relative">
            {/* Hook Handle */}
            <div className="w-24 h-3 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
            {/* Hook Point */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-2 bg-teal-500 rounded-r-full">
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-teal-500 border-l-0 rounded-r-full"></div>
            </div>
            {/* Yarn on Hook */}
            <div className="absolute -top-2 right-0 w-1 h-6 bg-pink-400 rounded-full animate-bounce-slow"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
            Loading...
          </p>
          <div className="flex gap-1 justify-center mt-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes draw {
          0%, 100% {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100;
            stroke-dashoffset: 50;
          }
        }

        @keyframes needles {
          0%, 100% {
            transform: translateX(-50%) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) rotate(5deg);
          }
        }

        @keyframes loop {
          0%, 100% {
            d: path("M60,80 Q80,70 100,70 T140,80");
          }
          50% {
            d: path("M60,85 Q80,75 100,75 T140,85");
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes hook {
          0%, 100% {
            transform: translateX(-50%) rotate(0deg);
          }
          25% {
            transform: translateX(-50%) rotate(-5deg);
          }
          75% {
            transform: translateX(-50%) rotate(5deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }

        .animate-draw {
          animation: draw 2s ease-in-out infinite;
        }

        .animate-needles {
          animation: needles 2s ease-in-out infinite;
        }

        .animate-loop {
          animation: loop 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-hook {
          animation: hook 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}