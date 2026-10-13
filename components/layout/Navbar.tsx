'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavItem {
  name: string;
  slug: string;
  subcategories: { name: string; slug: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Diapering',
    slug: 'diapering',
    subcategories: [
      { name: 'Diaper Pants', slug: 'diaper-pants' },
      { name: 'Tape & Belt Diapers', slug: 'diaper-belt' },
      { name: 'Rash Creams & Care', slug: 'rash-creams' },
    ],
  },
  {
    name: 'Baby Foods',
    slug: 'baby-foods',
    subcategories: [
      { name: 'Milks', slug: 'milks' },
      { name: 'Cereals', slug: 'cereals' },
      { name: 'Nutrition', slug: 'nutrition' },
      { name: 'Cheese', slug: 'cheese' },
      { name: 'Noodles & Snacks', slug: 'noodles' },
    ],
  },
  {
    name: 'Feeding',
    slug: 'feeding',
    subcategories: [
      { name: 'Feeder Bottles', slug: 'feeder-bottles' },
      { name: 'Bottle Brushes & Sets', slug: 'bottle-brushes' },
    ],
  },
  {
    name: 'School',
    slug: 'school',
    subcategories: [
      { name: 'School Backpacks', slug: 'backpacks' },
      { name: 'Water Bottles', slug: 'water-bottles' },
    ],
  },
  {
    name: 'Grooming & Care',
    slug: 'grooming-care',
    subcategories: [
      { name: 'Baby Shampoo', slug: 'baby-shampoo' },
      { name: 'Baby Lotion', slug: 'baby-lotion' },
    ],
  },
  {
    name: 'Toys',
    slug: 'toys',
    subcategories: [{ name: 'Sensory & Fidget Toys', slug: 'sensory-toys' }],
  },
];

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#e4eff5] border-b border-slate-200/60 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.slug}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/category/${item.slug}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#006778] py-2.5 transition-colors"
                >
                  <span>{item.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Link>

                {/* Dropdown Menu */}
                {activeDropdown === item.slug && (
                  <div className="absolute left-0 top-full w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      {item.name} Subcategories
                    </div>
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${item.slug}?subcategory=${sub.slug}`}
                        className="block px-4 py-2 text-xs text-slate-600 hover:bg-[#e4eff5]/50 hover:text-[#006778] font-medium transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <Link
                        href={`/category/${item.slug}`}
                        className="block px-4 py-1.5 text-[11px] text-[#006778] font-bold hover:underline"
                        onClick={() => setActiveDropdown(null)}
                      >
                        View All {item.name} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick link on the right of nav bar */}
          <div className="hidden lg:flex items-center text-[11px] text-slate-500 font-medium">
            <span>Fast Nationwide Delivery Across Bangladesh 🚚</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center justify-between w-full">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              All Categories
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200/60 bg-white px-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.slug} className="py-1">
                <Link
                  href={`/category/${item.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs font-bold text-slate-800 hover:text-[#006778]"
                >
                  {item.name}
                </Link>
                <div className="pl-6 space-y-1 mt-1">
                  {item.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/category/${item.slug}?subcategory=${sub.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 text-xs text-slate-500 hover:text-[#006778]"
                    >
                      • {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
