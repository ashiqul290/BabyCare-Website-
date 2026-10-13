'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { IProduct } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

export function ProductCard({ product }: { product: IProduct }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-teal-200">
      <Link href={`/product/${product.slug || product._id}`} className="block">
        {/* Diaper Size & Variant Badge if present */}
        {product.badge && (
          <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-bold tracking-tight">
            <span>{product.badge}</span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full aspect-square bg-slate-50/60 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform duration-200">
          <img
            src={product.images[0] || '/images/products/feeder-brush.svg'}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] mb-2 leading-snug group-hover:text-[#006778] transition-colors">
          {product.name}
        </h3>
      </Link>

      <div>
        {/* Pricing & Discount */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span className="text-base font-extrabold text-slate-900">
            ৳ {product.currentPrice.toLocaleString()}
          </span>

          {product.originalPrice && product.originalPrice > product.currentPrice && (
            <span className="text-xs text-slate-400 line-through">
              ৳ {product.originalPrice.toLocaleString()}
            </span>
          )}

          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#f59e0b] text-white">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-[#006778] text-slate-700 hover:text-white rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
