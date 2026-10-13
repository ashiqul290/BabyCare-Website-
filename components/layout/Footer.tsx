import React from 'react';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { BabyFooterIllustration } from '@/components/decorative/BabyFooterIllustration';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-6">
      {/* Baby Themed Decorative Illustration */}
      <BabyFooterIllustration />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Contact Us Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Contact Us</h4>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Hotline:</p>
                <a href="tel:09614332211" className="text-sm font-bold text-slate-800 hover:text-[#006778]">
                  09614332211
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Support:</p>
                <a href="mailto:info@babycare.com.bd" className="text-sm font-bold text-slate-800 hover:text-[#006778]">
                  info@babycare.com.bd
                </a>
              </div>
            </div>
          </div>

          {/* About Us & Info Columns */}
          <div className="md:col-span-5">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-4">About Us</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2.5">
                <div>
                  <Link href="/about" className="text-slate-600 hover:text-[#006778] transition-colors">
                    About Us
                  </Link>
                </div>
                <div>
                  <Link href="/brands" className="text-slate-600 hover:text-[#006778] transition-colors">
                    Brands
                  </Link>
                </div>
                <div>
                  <Link href="/shipping" className="text-slate-600 hover:text-[#006778] transition-colors">
                    Shipping & Delivery
                  </Link>
                </div>
                <div>
                  <Link href="/privacy" className="text-slate-600 hover:text-[#006778] transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <Link href="/blog" className="text-slate-600 hover:text-[#006778] transition-colors">
                    Blog
                  </Link>
                </div>
                <div>
                  <Link href="/returns" className="text-slate-600 hover:text-[#006778] transition-colors">
                    Return & Refund Policy
                  </Link>
                </div>
                <div>
                  <Link href="/terms" className="text-slate-600 hover:text-[#006778] transition-colors">
                    Terms & Conditions
                  </Link>
                </div>
                <div>
                  <Link href="/cashback" className="text-slate-600 hover:text-[#006778] transition-colors">
                    Cashback Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Us Column */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-4">Connect Us</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#006778] hover:border-[#006778] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#006778] hover:border-[#006778] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#006778] hover:border-[#006778] transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment strip & SSLCommerz Badges */}
        <div className="border-t border-slate-100 pt-6 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-2 py-2 px-3 bg-slate-50/80 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-medium">
            <span className="font-bold text-slate-600 mr-2">Pay With:</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-pink-600 font-bold">bKash</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-orange-600 font-bold">Nagad</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-purple-600 font-bold">Rocket</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-blue-600 font-bold">VISA</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-red-600 font-bold">MasterCard</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-sky-600 font-bold">Amex</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-emerald-600 font-bold">DBBL Nexus</span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-bold">Cash On Delivery</span>
            <span className="px-2 py-0.5 bg-[#006778] text-white rounded font-bold ml-2">SSLCOMMERZ Verified</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-slate-400 font-medium pt-2">
          © 2026 Babycare | All rights reserved
        </div>
      </div>
    </footer>
  );
}
