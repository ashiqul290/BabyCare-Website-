import React from 'react';
import Link from 'next/link';

export function BabyCareLogo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`} aria-label="BabyCare Home">
      <div className="flex flex-col items-start leading-none">
        {/* Cute pastel rainbow arch with hearts */}
        <svg viewBox="0 0 100 24" className="w-20 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20C15 8 35 4 50 4C65 4 85 8 90 20" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M18 20C22 10 38 7 50 7C62 7 78 10 82 20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="50" cy="4" r="3" fill="#fbbf24" />
        </svg>
        <div className="flex items-baseline tracking-tight font-extrabold text-2xl font-sans">
          <span className="text-[#f97316]">B</span>
          <span className="text-[#06b6d4]">A</span>
          <span className="text-[#ec4899]">B</span>
          <span className="text-[#84cc16]">Y</span>
          <span className="text-[#0f766e] tracking-normal font-black text-2xl ml-0.5">CARE</span>
        </div>
      </div>
    </Link>
  );
}
