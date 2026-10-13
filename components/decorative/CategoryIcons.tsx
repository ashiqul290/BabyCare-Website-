import React from 'react';

interface CategoryIconProps {
  type: string;
  className?: string;
}

export function CategoryIcon({ type, className = 'w-16 h-16' }: CategoryIconProps) {
  switch (type.toLowerCase()) {
    case 'diaper':
    case 'diapers':
    case 'diapering':
      return (
        <div className={`rounded-full bg-[#e0f7f6] flex items-center justify-center p-3 text-[#0d9488] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14H40V22C40 33.0457 31.0457 38 24 38C16.9543 38 8 33.0457 8 22V14Z" fill="#2dd4bf" stroke="#0f766e" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M12 14V19C12 21 16 23 18 24" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M36 14V19C36 21 32 23 30 24" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="27" r="2.5" fill="#ffffff"/>
          </svg>
        </div>
      );
    case 'milk':
    case 'milks':
    case 'baby foods':
    case 'baby-foods':
      return (
        <div className={`rounded-full bg-[#fef3c7] flex items-center justify-center p-3 text-[#b45309] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="10" width="24" height="30" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="2.5"/>
            <ellipse cx="24" cy="10" rx="12" ry="3" fill="#fef08a" stroke="#d97706" strokeWidth="2.5"/>
            <rect x="15" y="18" width="18" height="12" rx="2" fill="#ffffff" stroke="#d97706" strokeWidth="1.5"/>
            <text x="24" y="27" font-size="8" font-weight="bold" fill="#b45309" textAnchor="middle">NAN</text>
          </svg>
        </div>
      );
    case 'shampoo':
    case 'baby shampoo':
      return (
        <div className={`rounded-full bg-[#dcfce7] flex items-center justify-center p-3 text-[#15803d] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="18" width="18" height="24" rx="8" fill="#86efac" stroke="#16a34a" strokeWidth="2.5"/>
            <rect x="21" y="12" width="6" height="6" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2"/>
            <path d="M19 8H29V12H19Z" fill="#16a34a"/>
            <path d="M24 8V4M24 4H31" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="30" r="3" fill="#ffffff"/>
          </svg>
        </div>
      );
    case 'lotion':
    case 'baby lotion':
    case 'grooming & care':
    case 'grooming-care':
      return (
        <div className={`rounded-full bg-[#fce7f3] flex items-center justify-center p-3 text-[#be185d] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="16" width="20" height="26" rx="6" fill="#f472b6" stroke="#db2777" strokeWidth="2.5"/>
            <path d="M21 16V10H27V16" stroke="#db2777" strokeWidth="2.5"/>
            <path d="M19 10H29" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="28" r="4" fill="#ffffff" opacity="0.8"/>
          </svg>
        </div>
      );
    case 'feeder':
    case 'feeder bottle':
    case 'feeding':
      return (
        <div className={`rounded-full bg-[#f3e8ff] flex items-center justify-center p-3 text-[#7e22ce] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="18" width="18" height="24" rx="5" fill="#d8b4fe" stroke="#9333ea" strokeWidth="2.5"/>
            <rect x="17" y="14" width="14" height="4" fill="#c084fc" stroke="#9333ea" strokeWidth="2"/>
            <path d="M20 14L22 6C23 4 25 4 26 6L28 14" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2"/>
            <line x1="18" y1="24" x2="23" y2="24" stroke="#9333ea" strokeWidth="2"/>
            <line x1="18" y1="30" x2="23" y2="30" stroke="#9333ea" strokeWidth="2"/>
          </svg>
        </div>
      );
    case 'cereal':
    case 'cereals':
      return (
        <div className={`rounded-full bg-[#ffedd5] flex items-center justify-center p-3 text-[#c2410c] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="13" y="12" width="22" height="28" rx="3" fill="#fdba74" stroke="#ea580c" strokeWidth="2.5"/>
            <path d="M18 20L24 28L30 20" stroke="#c2410c" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="24" cy="22" r="3" fill="#ffffff"/>
            <path d="M18 12L24 6L30 12" fill="#fed7aa" stroke="#ea580c" strokeWidth="2"/>
          </svg>
        </div>
      );
    case 'backpack':
    case 'school':
      return (
        <div className={`rounded-full bg-[#e0f2fe] flex items-center justify-center p-3 text-[#0369a1] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="16" width="20" height="26" rx="8" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2.5"/>
            <path d="M20 16V10C20 8 28 8 28 10V16" stroke="#0284c7" strokeWidth="2.5"/>
            <rect x="18" y="26" width="12" height="10" rx="3" fill="#ffffff" stroke="#0284c7" strokeWidth="2"/>
          </svg>
        </div>
      );
    default:
      return (
        <div className={`rounded-full bg-[#f1f5f9] flex items-center justify-center p-3 text-[#475569] shadow-xs ${className}`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="16" fill="#cbd5e1" stroke="#64748b" strokeWidth="2.5"/>
            <path d="M24 16V32M16 24H32" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      );
  }
}
