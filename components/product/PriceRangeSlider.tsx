'use client';

import React from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
}

export function PriceRangeSlider({
  min,
  max,
  currentMin,
  currentMax,
  onChange,
}: PriceRangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), currentMax - 50);
    onChange(value, currentMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), currentMin + 50);
    onChange(currentMin, value);
  };

  const minPercent = Math.min(100, Math.max(0, ((currentMin - min) / (max - min)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((currentMax - min) / (max - min)) * 100));

  return (
    <div className="space-y-4">
      {/* Visual Track */}
      <div className="relative h-2 bg-slate-200 rounded-full my-4">
        <div
          className="absolute h-full bg-[#006778] rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={currentMin}
          onChange={handleMinChange}
          aria-label="Minimum price"
          className="absolute w-full -top-1 h-2 opacity-0 cursor-pointer pointer-events-auto"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={currentMax}
          onChange={handleMaxChange}
          aria-label="Maximum price"
          className="absolute w-full -top-1 h-2 opacity-0 cursor-pointer pointer-events-auto"
        />

        {/* Visual Knobs */}
        <div
          className="absolute -top-1.5 w-5 h-5 bg-white border-2 border-[#006778] rounded-full shadow-sm pointer-events-none -ml-2.5 transition-all"
          style={{ left: `${minPercent}%` }}
        />
        <div
          className="absolute -top-1.5 w-5 h-5 bg-white border-2 border-[#006778] rounded-full shadow-sm pointer-events-none -ml-2.5 transition-all"
          style={{ left: `${maxPercent}%` }}
        />
      </div>

      {/* Numeric inputs */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex-1 relative">
          <input
            type="number"
            value={currentMin}
            onChange={(e) => onChange(Number(e.target.value), currentMax)}
            className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-center text-slate-800 font-semibold focus:border-teal-500 outline-hidden"
          />
        </div>
        <span className="text-slate-400 font-medium">-</span>
        <div className="flex-1 relative">
          <input
            type="number"
            value={currentMax}
            onChange={(e) => onChange(currentMin, Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-center text-slate-800 font-semibold focus:border-teal-500 outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}
