import React from 'react';

export function BabyFooterIllustration() {
  return (
    <div className="w-full overflow-hidden select-none pointer-events-none relative -mb-2">
      <svg
        viewBox="0 0 1440 220"
        className="w-full h-auto min-h-[120px] max-h-[220px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Soft Background Sky Gradient */}
        <defs>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#fef3c7" stop-opacity="0.6" />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde047" />
            <stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Back Cloud Layer */}
        <path
          d="M0 160 C120 140 240 180 380 150 C520 120 640 170 780 140 C920 110 1060 160 1200 130 C1320 110 1390 140 1440 150 L1440 220 L0 220 Z"
          fill="#fef9c3"
          opacity="0.5"
        />

        {/* Front Rolling Fluffy Cloud Hills */}
        <path
          d="M-50 180 C80 140 180 170 280 160 C380 150 480 180 580 165 C680 150 800 180 920 160 C1040 140 1160 175 1280 155 C1380 140 1420 160 1500 180 L1500 220 L-50 220 Z"
          fill="#fffbeb"
        />

        {/* Left Floating Yellow Balloon */}
        <g transform="translate(260, 110)">
          {/* String */}
          <path d="M15 45 Q 12 70 20 95" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          {/* Balloon body */}
          <ellipse cx="15" cy="22" rx="16" ry="22" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Highlight */}
          <ellipse cx="10" cy="15" rx="4" ry="7" fill="#ffffff" opacity="0.6" />
          {/* Balloon knot */}
          <polygon points="12,44 18,44 15,48" fill="#f59e0b" />
        </g>

        {/* Butterfly 1 (Orange/Yellow - Left) */}
        <g transform="translate(450, 105)">
          <path d="M10 12 Q2 4 8 0 Q16 2 12 12" fill="#f97316" />
          <path d="M14 12 Q22 4 16 0 Q8 2 12 12" fill="#f97316" />
          <path d="M10 14 Q4 20 9 22 Q14 20 12 14" fill="#fbbf24" />
          <path d="M14 14 Q20 20 15 22 Q10 20 12 14" fill="#fbbf24" />
          <ellipse cx="12" cy="13" rx="1.5" ry="5" fill="#7c2d12" />
        </g>

        {/* Butterfly 2 (Pink/Red - Center Left) */}
        <g transform="translate(620, 115)">
          <path d="M10 10 Q3 4 8 1 Q14 3 11 10" fill="#f43f5e" />
          <path d="M12 10 Q19 4 14 1 Q8 3 11 10" fill="#f43f5e" />
          <path d="M10 12 Q5 18 9 19 Q13 17 11 12" fill="#fda4af" />
          <path d="M12 12 Q17 18 13 19 Q9 17 11 12" fill="#fda4af" />
          <ellipse cx="11" cy="11" rx="1.2" ry="4" fill="#881337" />
        </g>

        {/* Happy Singing Bird (Center) */}
        <g transform="translate(780, 115)">
          {/* Tail */}
          <path d="M5 28 L-5 22 L0 32 L-4 38 L8 34 Z" fill="#ea580c" />
          {/* Bird Body */}
          <ellipse cx="22" cy="24" rx="16" ry="14" fill="#f97316" />
          {/* Soft Belly */}
          <ellipse cx="25" cy="27" rx="10" ry="9" fill="#fef08a" />
          {/* Wing */}
          <path d="M15 20 Q5 28 20 32 Q26 26 20 20 Z" fill="#c2410c" />
          {/* Head */}
          <circle cx="32" cy="14" r="11" fill="#f97316" />
          {/* Eye */}
          <circle cx="35" cy="12" r="3.5" fill="#ffffff" />
          <circle cx="36" cy="12" r="2" fill="#1e293b" />
          <circle cx="37" cy="11" r="0.8" fill="#ffffff" />
          {/* Beak */}
          <polygon points="41,12 49,15 41,18" fill="#eab308" />
          {/* Little Crown feathers */}
          <path d="M30 4 Q32 0 35 3 Q34 7 32 7" fill="#ea580c" />
          {/* Feet */}
          <path d="M18 36 L15 44 M25 36 L25 44" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Butterfly 3 (Red/Orange - Center Right) */}
        <g transform="translate(860, 75)">
          <path d="M12 12 Q4 2 10 -2 Q18 0 14 12" fill="#ef4444" />
          <path d="M16 12 Q24 2 18 -2 Q10 0 14 12" fill="#ef4444" />
          <path d="M12 14 Q6 22 11 24 Q16 22 14 14" fill="#fb923c" />
          <path d="M16 14 Q22 22 17 24 Q12 22 14 14" fill="#fb923c" />
          <ellipse cx="14" cy="13" rx="1.5" ry="6" fill="#7f1d1d" />
        </g>

        {/* Smiling Big Warm Sun (Right) */}
        <g transform="translate(1080, 70)">
          {/* Sun Rays */}
          <g fill="#f59e0b">
            <path d="M50 0 L58 12 L42 12 Z" />
            <path d="M50 100 L58 88 L42 88 Z" />
            <path d="M0 50 L12 58 L12 42 Z" />
            <path d="M100 50 L88 58 L88 42 Z" />
            <path d="M15 15 L28 20 L20 28 Z" />
            <path d="M85 85 L72 80 L80 72 Z" />
            <path d="M15 85 L20 72 L28 80 Z" />
            <path d="M85 15 L80 28 L72 20 Z" />
            {/* Intermediate rays */}
            <path d="M30 4 L36 14 L24 12 Z" />
            <path d="M70 4 L76 12 L64 14 Z" />
            <path d="M96 30 L86 36 L88 24 Z" />
            <path d="M96 70 L88 76 L86 64 Z" />
            <path d="M4 30 L14 24 L12 36 Z" />
            <path d="M4 70 L12 64 L14 76 Z" />
            <path d="M30 96 L24 88 L36 86 Z" />
            <path d="M70 96 L64 86 L76 88 Z" />
          </g>

          {/* Sun Center Disk */}
          <circle cx="50" cy="50" r="38" fill="url(#sunGrad)" stroke="#f59e0b" strokeWidth="2" />

          {/* Happy Face */}
          {/* Cheerful Eyes */}
          <ellipse cx="38" cy="44" rx="3.5" ry="4" fill="#78350f" />
          <ellipse cx="62" cy="44" rx="3.5" ry="4" fill="#78350f" />
          <circle cx="39" cy="42" r="1.2" fill="#ffffff" />
          <circle cx="63" cy="42" r="1.2" fill="#ffffff" />
          {/* Rosy Cheeks */}
          <circle cx="32" cy="52" r="4.5" fill="#f87171" opacity="0.6" />
          <circle cx="68" cy="52" r="4.5" fill="#f87171" opacity="0.6" />
          {/* Big Grin */}
          <path d="M41 53 Q50 63 59 53" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}
