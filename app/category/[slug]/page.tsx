'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { PriceRangeSlider } from '@/components/product/PriceRangeSlider';
import { IProduct, ICategory, ISubcategory } from '@/lib/types';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const subcategoryParam = searchParams.get('subcategory') || '';
  const searchParam = searchParams.get('search') || '';
  const brandParam = searchParams.get('brand') || '';

  const [category, setCategory] = useState<ICategory | null>(null);
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);

  useEffect(() => {
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
  }, [subcategoryParam]);

  // Fetch category details
  useEffect(() => {
    async function fetchCategoryInfo() {
      if (slug === 'all') {
        setCategory({
          _id: 'all',
          name: 'All Products',
          slug: 'all',
          description: 'Explore the complete range of baby care essentials, from diapers and nutritious foods to school supplies and toys in Bangladesh.',
          displayOrder: 0,
          isActive: true,
          itemCount: 208,
          createdAt: '',
          updatedAt: '',
        });
        return;
      }
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          const found = data.categories.find((c: ICategory) => c.slug === slug);
          if (found) {
            setCategory(found);
            // fetch subcategories
            const subRes = await fetch(`/api/subcategories?categoryId=${found._id}`);
            const subData = await subRes.json();
            if (subData.subcategories) setSubcategories(subData.subcategories);
          }
        }
      } catch (e) {
        console.error('Error fetching category info', e);
      }
    }
    fetchCategoryInfo();
  }, [slug]);

  // Fetch products matching filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (slug !== 'all') query.set('categorySlug', slug);
        if (selectedSubcategory) query.set('subcategorySlug', selectedSubcategory);
        if (searchParam) query.set('search', searchParam);
        if (brandParam) query.set('brand', brandParam);
        if (minPrice > 0) query.set('minPrice', minPrice.toString());
        if (maxPrice < 4500) query.set('maxPrice', maxPrice.toString());
        if (inStockOnly) query.set('inStock', 'true');
        if (sortBy !== 'default') query.set('sortBy', sortBy);
        query.set('limit', itemsPerPage.toString());
        query.set('page', currentPage.toString());

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
          setTotalProducts(data.total);
          setTotalPages(data.totalPages || 1);
        }
      } catch (e) {
        console.error('Error fetching products', e);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [slug, selectedSubcategory, searchParam, brandParam, minPrice, maxPrice, inStockOnly, sortBy, itemsPerPage, currentPage]);

  const categoryTitle = category?.name || (slug === 'all' ? 'All Products' : slug.replace('-', ' '));

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-700 capitalize">{categoryTitle}</span>
          {selectedSubcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-teal-700 font-bold capitalize">{selectedSubcategory.replace('-', ' ')}</span>
            </>
          )}
        </nav>

        {/* Short SEO Description Header Banner */}
        <div className="mb-6 text-xs text-slate-600 leading-relaxed max-w-5xl">
          <p>
            {category?.description ||
              "Choosing the right baby food is essential for your child's growth, health, and development. In Bangladesh, parents are increasingly seeking safe, nutritious, and high-quality products. Including milk, cereals, and purees, to support every stage of their baby's journey."}
          </p>
        </div>

        {/* Subcategory Pills / Quick Filter Bar */}
        {subcategories.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedSubcategory('')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                !selectedSubcategory
                  ? 'bg-[#006778] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All {categoryTitle}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => setSelectedSubcategory(sub.slug === selectedSubcategory ? '' : sub.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSubcategory === sub.slug
                    ? 'bg-[#006778] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Layout with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 bg-white">
            <div className="border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Price Range
              </h3>
              <PriceRangeSlider
                min={0}
                max={4500}
                currentMin={minPrice}
                currentMax={maxPrice}
                onChange={(newMin, newMax) => {
                  setMinPrice(newMin);
                  setMaxPrice(newMax);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Availability Collapsible Box */}
            <div className="border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <button
                onClick={() => setAvailabilityOpen(!availabilityOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider cursor-pointer"
              >
                <span>Availability</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${availabilityOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {availabilityOpen && (
                <div className="mt-3 space-y-2.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        setCurrentPage(1);
                      }}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-400">
                    <input type="checkbox" disabled className="rounded text-slate-300 w-4 h-4" />
                    <span>Pre Order</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-400">
                    <input type="checkbox" disabled className="rounded text-slate-300 w-4 h-4" />
                    <span>Upcoming</span>
                  </label>
                </div>
              )}
            </div>

            {/* Reset Filters affordance */}
            {(minPrice > 0 || maxPrice < 4500 || inStockOnly || selectedSubcategory) && (
              <button
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(4500);
                  setInStockOnly(false);
                  setSelectedSubcategory('');
                  setCurrentPage(1);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </aside>

          {/* Right Product Grid & Controls */}
          <section className="lg:col-span-9">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900 capitalize">{categoryTitle}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {products.length}/{totalProducts} Products Found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-semibold focus:border-teal-500 outline-hidden"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popularity">Popularity</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Show items per page */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 font-semibold focus:border-teal-500 outline-hidden"
                  >
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards (3 columns on desktop as shown in Screenshot 2) */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-100 p-8">
                <p className="text-base font-bold text-slate-700 mb-1">No products match your filter</p>
                <p className="text-xs text-slate-400 mb-4">Try adjusting price range or removing subcategory filters.</p>
                <button
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(4500);
                    setInStockOnly(false);
                    setSelectedSubcategory('');
                  }}
                  className="px-4 py-2 bg-[#006778] text-white text-xs font-bold rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls matching Screenshot 2 */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-md font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    PREV
                  </button>

                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-md font-bold transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#006778] text-white'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-md font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    NEXT
                  </button>
                </div>

                <div className="text-slate-400 font-medium">
                  Showing {Math.min(1, totalProducts)} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} items
                </div>
              </div>
            )}

            {/* Rich SEO Content Section below Product Grid matching Screenshot 2 */}
            <article className="mt-14 pt-8 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Baby Food in Bangladesh: Healthy Nutrition for Growing Babies
              </h2>
              <p>
                Choosing the right baby food is one of the most important steps in ensuring your child&apos;s growth, health, and overall development. In Bangladesh, parents are looking for trusted, high-quality products that provide essential nutrition for infants and toddlers. From breastfeeding supplements to ready-to-eat cereals, baby food plays a vital role in supporting your little one&apos;s immunity, energy, and cognitive development.
              </p>
              <p>
                A balanced diet for babies includes protein, vitamins, minerals, and healthy fats. Introducing age-appropriate foods at the right time helps in establishing healthy eating habits that last a lifetime. Whether you are a new parent or looking to upgrade your baby&apos;s diet, understanding your options and choosing reliable brands is key.
              </p>

              <h3 className="text-sm font-bold text-slate-800 pt-2">Milk &amp; Formula for Healthy Growth</h3>
              <p>
                High-quality infant milk formula provides essential nutrients for babies who are not exclusively breastfed. From DHA for brain development to calcium for strong bones, milk products ensure your child receives the required nourishment daily. Trusted brands in Bangladesh offer formula for different age groups, including 0-6 months, 6-12 months, and toddlers, making it easier for parents to support each stage of growth.
              </p>
              <p>
                Parents can also choose fortified milk options that combine probiotics, vitamins, and minerals to boost immunity and digestive health. Ensuring your baby gets the right amount of milk is crucial for their energy levels, cognitive development, and overall well-being.
              </p>

              <h3 className="text-sm font-bold text-slate-800 pt-2">Nutritious Baby Food &amp; Purees</h3>
              <p>
                Introducing solid foods and purees is a key step in your baby&apos;s nutritional journey. Nutrient-rich baby foods like fruit and vegetable purees, protein-rich snacks, and fortified cereals help meet your child&apos;s daily requirements. In Bangladesh, parents prefer products that are safe, hygienically prepared, and free from artificial additives.
              </p>

              <h3 className="text-sm font-bold text-slate-800 pt-2">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-3 pt-1">
                <div>
                  <h4 className="font-bold text-slate-800">What types of baby food are available in Bangladesh?</h4>
                  <p className="text-slate-500">
                    In Bangladesh, parents can find a variety of baby foods including infant milk formula, fortified cereals, fruit and vegetable purees, and protein-rich snacks. Trusted brands ensure hygiene and proper nutrition for every stage of your baby&apos;s growth.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">Where can I buy safe and high-quality baby food in Bangladesh?</h4>
                  <p className="text-slate-500">
                    Parents can buy a wide range of fresh, 100% authentic baby foods from BabyCare Bangladesh, ensuring safety, nutrition, and timely nationwide delivery for their little ones.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
