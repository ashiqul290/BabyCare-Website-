'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Tag, User, ShoppingBag, LogOut, LayoutDashboard, PackageCheck } from 'lucide-react';
import { BabyCareLogo } from '@/components/decorative/BabyCareLogo';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <BabyCareLogo />
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Product, Brand or Category"
                className="w-full bg-[#f1f5f9] text-slate-800 placeholder-slate-400 pl-5 pr-12 py-2.5 rounded-full text-sm outline-hidden border border-transparent focus:border-teal-400 focus:bg-white transition-all shadow-inner/10"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-transparent hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Special Deal Button */}
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Tag className="w-3.5 h-3.5 fill-white/20" />
              <span className="hidden md:inline">Special Deal</span>
            </Link>

            {/* Account / Login Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                    aria-label="Account Menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#e6eff5] text-[#0f766e] font-bold text-xs flex items-center justify-center border border-teal-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-slate-500 truncate">{user.email || user.phone}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-bold text-[10px]">
                            ADMINISTRATOR
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <PackageCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>My Orders & Profile</span>
                      </Link>

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors"
                  aria-label="Login"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Shopping Cart Icon with badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center text-slate-700 hover:text-[#006778] transition-colors cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#006778] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 sm:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Product, Brand or Category"
              className="w-full bg-[#f1f5f9] text-slate-800 placeholder-slate-400 pl-4 pr-10 py-2 rounded-full text-xs outline-hidden"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-500"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
