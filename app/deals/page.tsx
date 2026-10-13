'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { IProduct } from '@/lib/types';

export default function DealsPage() {
  const [deals, setDeals] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/products?limit=24');
        const data = await res.json();
        if (data.products) {
          // Filter products with discounts
          setDeals(data.products.filter((p: IProduct) => p.discountPercentage && p.discountPercentage > 10));
        }
      } catch (e) {
        console.error('Failed to load deals', e);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full space-y-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-700">Special Deals</span>
        </nav>

        <div className="bg-gradient-to-r from-teal-500 to-[#006778] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Limited Time Offers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Exclusive Baby Deals &amp; Discounts
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-lg">
              Save up to 41% on diapers, baby food nutrition, toys, and grooming essentials in Bangladesh.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {deals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
