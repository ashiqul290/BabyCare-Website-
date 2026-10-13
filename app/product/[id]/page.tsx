'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  ShoppingCart,
  Share2,
  Star,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { useCart } from '@/lib/cart-context';
import { IProduct, IReview } from '@/lib/types';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [copiedShare, setCopiedShare] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewPhone, setReviewPhone] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0] || '/images/products/feeder-brush.svg');

          // Fetch related products in the same category
          const relRes = await fetch(
            `/api/products?categoryId=${data.product.categoryId}&limit=5`
          );
          const relData = await relRes.json();
          if (relData.products) {
            setRelatedProducts(
              relData.products.filter((p: IProduct) => p._id !== data.product._id).slice(0, 4)
            );
          }

          // Fetch reviews
          const revRes = await fetch(`/api/reviews?productId=${data.product._id}`);
          const revData = await revRes.json();
          if (revData.reviews) {
            setReviews(revData.reviews);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          rating: reviewRating,
          comment: reviewComment,
          userName: reviewName,
          userPhone: reviewPhone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewSuccessMsg('Review submitted successfully! It will appear once verified.');
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewSuccessMsg('');
          setReviewComment('');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
        <Header />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#006778] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
        <Header />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 flex-1 w-full text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">
            The requested product may have been updated or moved.
          </p>
          <Link
            href="/category/all"
            className="px-5 py-2.5 bg-[#006778] text-white rounded-xl text-xs font-bold"
          >
            Browse All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full space-y-10">
        {/* Breadcrumb Navigation matching Screenshot 3 */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href={`/category/${product.categorySlug || 'all'}`} className="hover:text-slate-800 capitalize">
            {product.categorySlug ? product.categorySlug.replace('-', ' ') : 'Category'}
          </Link>
          {product.subcategorySlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <Link
                href={`/category/${product.categorySlug}?subcategory=${product.subcategorySlug}`}
                className="hover:text-slate-800 capitalize"
              >
                {product.subcategorySlug.replace('-', ' ')}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-700 line-clamp-1">{product.name}</span>
        </nav>

        {/* Top Product Split: Large Image Gallery Left + Product Buy Info Right */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Image & Gallery */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-square w-full bg-slate-50/80 rounded-2xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden shadow-2xs">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[380px]"
              />
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-slate-50 overflow-hidden cursor-pointer ${
                      selectedImage === img ? 'border-[#006778] ring-2 ring-teal-100' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Pricing, Features & Actions */}
          <div className="md:col-span-7 space-y-5">
            {/* Stock status */}
            <div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Pricing Row matching Screenshot 3 */}
            <div className="flex items-center gap-3.5 py-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#006778]">
                ৳ {product.currentPrice.toLocaleString()}
              </span>

              {product.originalPrice && product.originalPrice > product.currentPrice && (
                <span className="text-sm sm:text-base text-slate-400 line-through">
                  ৳ {product.originalPrice.toLocaleString()}
                </span>
              )}

              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#f59e0b] text-white">
                  Save: -{product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Summary bullet points matching Screenshot 3 */}
            <div className="space-y-2 py-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Summary:</h3>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feat, i) => <li key={i}>{feat}</li>)
                ) : (
                  <>
                    <li>Suitable for Babies Aged 6 Months+</li>
                    <li>Creamy and Lumpy Texture for Weaning</li>
                    <li>Nutritious Multigrain Cereals</li>
                    <li>Contains Milk and Yogurt, No Added Sugar</li>
                    <li>Enriched with Iron, Calcium, Vitamins, and Minerals</li>
                    <li>Apple, Banana, Blueberry, Raspberry, and Blackcurrant Flavors</li>
                    <li>Easy to Prepare for Everyday Feeding</li>
                  </>
                )}
              </ul>
            </div>

            {/* Quantity Stepper matching Screenshot 3 */}
            <div className="flex items-center gap-4 py-2">
              <span className="text-xs font-bold text-slate-700">Quantity</span>
              <div className="flex items-center border border-slate-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Buy Now, Add to Cart, Share */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 px-7 py-3 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Now</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Copy product link"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedShare ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Lower Split: Description & Reviews on Left, Related Products on Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-100">
          {/* Left Column: Description, Ingredients, Pricing Guide & Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description Box */}
            <div className="border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                Description
              </h2>

              <h3 className="text-sm font-bold text-slate-800">{product.name}</h3>

              <div className="text-xs text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
                {product.fullDescription || product.shortDescription}
              </div>

              {product.ingredients && (
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800">Ingredients</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{product.ingredients}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1">
                  Buy {product.name} from BabyCare.
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In Bangladesh, you can get original <strong>{product.name}</strong> from BabyCare.
                  We have a large collection of authentic baby products to purchase. Order Online
                  and get fastest Delivery with the best price from BabyCare.
                </p>
              </div>
            </div>

            {/* Price Information Section matching Screenshot 3 */}
            <div className="border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                What is the price of {product.name} in Bangladesh?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The latest price of {product.name} in Bangladesh is ৳{' '}
                {product.currentPrice.toLocaleString()}. You can buy the authentic product at best
                price from our website with genuine brand seal.
              </p>
            </div>

            {/* Customer Reviews Section matching Screenshot 3 */}
            <div className="border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reviews</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {reviews.length > 0 ? `${reviews.length} Verified Reviews` : 'No Reviews Found'}
                  </p>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Write Your Review
                </button>
              </div>

              {/* Reviews List or Empty state */}
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">
                    This product has no reviews yet. Be the first one to write a review.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="pt-4 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-teal-50 text-teal-700 rounded font-semibold">
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Related Products sidebar matching Screenshot 3 */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
                Related Product
              </h3>

              <div className="space-y-4">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/product/${rel.slug || rel._id}`}
                    className="flex items-center gap-3.5 group"
                  >
                    <div className="w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={rel.images[0] || '/images/products/feeder-brush.svg'}
                        alt={rel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#006778] transition-colors">
                        {rel.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-900">
                          ৳ {rel.currentPrice.toLocaleString()}
                        </span>
                        {rel.discountPercentage && rel.discountPercentage > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#f59e0b] text-white">
                            -{rel.discountPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Write a Review</h3>
            <p className="text-xs text-slate-400 mb-4">{product.name}</p>

            {reviewSuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{reviewSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Farhana Ahmed"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number (Optional)</label>
                  <input
                    type="text"
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this baby product..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-hidden focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-2.5 bg-[#006778] hover:bg-[#09545f] text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
      <CartDrawer />
    </div>
  );
}
