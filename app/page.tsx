'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryIcon } from '@/components/decorative/CategoryIcons';
import { IProduct, ICategory } from '@/lib/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [diaperingProducts, setDiaperingProducts] = useState<IProduct[]>([]);
  const [babyFoodsProducts, setBabyFoodsProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsRes, featRes, diapRes, foodsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?homepageSection=featured&limit=8'),
          fetch('/api/products?categorySlug=diapering&limit=12'),
          fetch('/api/products?categorySlug=baby-foods&limit=8'),
        ]);

        const [catsData, featData, diapData, foodsData] = await Promise.all([
          catsRes.json(),
          featRes.json(),
          diapRes.json(),
          foodsRes.json(),
        ]);

        if (catsData.categories) setCategories(catsData.categories);
        if (featData.products) setFeaturedProducts(featData.products);
        if (diapData.products) setDiaperingProducts(diapData.products);
        if (foodsData.products) setBabyFoodsProducts(foodsData.products);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const featuredCategoryCircles = [
    { name: 'Diapers', count: '253 Items', type: 'diapers', slug: 'diapering' },
    { name: 'Milks', count: '120 Items', type: 'milks', slug: 'baby-foods' },
    { name: 'Baby Shampoo', count: '17 Items', type: 'shampoo', slug: 'grooming-care' },
    { name: 'Baby Lotion', count: '11 Items', type: 'lotion', slug: 'grooming-care' },
    { name: 'Feeder Bottle', count: '80 Items', type: 'feeder', slug: 'feeding' },
    { name: 'Cereals', count: '95 Items', type: 'cereals', slug: 'baby-foods' },
  ];

  const topBrands = [
    { name: 'Aptamil', logo: '/images/brands/aptamil.svg' },
    { name: 'Avonee pants', logo: '/images/brands/avonee.svg' },
    { name: 'Huggies', logo: '/images/brands/huggies.svg' },
    { name: 'Kodomo', logo: '/images/brands/kodomo.svg' },
    { name: 'Molfix', logo: '/images/brands/molfix.svg' },
    { name: 'Nestlé', logo: '/images/brands/nestle.svg' },
    { name: 'Mothercare', logo: '/images/brands/mothercare.svg' },
    { name: 'Pampers', logo: '/images/brands/pampers.svg' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 w-full">
        {/* Section 2: Promotional Side-by-Side Banners */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            href="/category/grooming-care"
            className="group block relative overflow-hidden rounded-2xl bg-[#fefce8] border border-amber-100 shadow-2xs hover:shadow-md transition-shadow"
          >
            <div className="aspect-16/9 w-full relative">
              <img
                src="/images/promo_baby_shampoo.jpg"
                alt="Baby extra care shampoo banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </Link>

          <Link
            href="/category/school"
            className="group block relative overflow-hidden rounded-2xl bg-[#0d5964] border border-teal-900 shadow-2xs hover:shadow-md transition-shadow"
          >
            <div className="aspect-16/9 w-full relative">
              <img
                src="/images/promo_school_essentials.jpg"
                alt="School essentials collection banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </Link>
        </section>

        {/* Section 3: Featured Category Circles */}
        <section className="text-center pt-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Featured Category
          </h2>
          <p className="text-xs text-slate-400 mt-1 mb-8">
            Buy Your Desired Products From Featured Categories
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
            {featuredCategoryCircles.map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1"
              >
                <div className="mb-3 transition-transform duration-200 group-hover:scale-110">
                  <CategoryIcon type={cat.type} className="w-20 h-20 sm:w-24 sm:h-24" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#006778] transition-colors">
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Featured Products */}
        <section className="pt-4">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Check & Get Your Desired Product
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Section 5: Diapering Products */}
        <section className="pt-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Diapering
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {diaperingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/category/diapering"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#006778] hover:bg-[#09545f] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Show All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Section 6: Baby Foods Products */}
        <section className="pt-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Baby Foods
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {babyFoodsProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/category/baby-foods"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#006778] hover:bg-[#09545f] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Show All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Section 7: Top Brands */}
        <section className="pt-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Top Brands
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Shop by world&apos;s famous brands
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topBrands.map((brand, idx) => (
              <Link
                key={idx}
                href={`/category/all?brand=${encodeURIComponent(brand.name)}`}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center justify-center h-24 hover:shadow-md hover:border-teal-200 transition-all group"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  className="max-h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Section 8: SEO-Friendly Content Section */}
        <section className="pt-10 pb-6 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Ultimate Destination for Baby Essentials in Bangladesh!
          </h2>
          <p>
            Discover a world of comfort and care for your little one at Babycare. From keeping them dry with our diverse range of diapers to nourishing their growth with curated baby foods, we offer everything you need. Explore high-quality feeding, safety, school, skincare, mother care, fashion, and accessories collections, ensuring your journey through parenthood is filled with joy and ease. Shop conveniently, knowing that at Babycare, we understand the unique needs of parents and babies, providing a one-stop solution for all your baby care essentials.
          </p>

          <h3 className="text-sm font-bold text-slate-800 pt-2">Why Choose Us?</h3>
          <ul className="space-y-2 list-none pl-0">
            <li>
              <strong>Extensive Range:</strong> Explore our comprehensive collection of baby essentials, hand-picked from trusted brands, covering all your needs from infancy to school years.
            </li>
            <li>
              <strong>Quality Assurance:</strong> We prioritize your baby&apos;s safety. Our products adhere to the highest standards, providing you with peace of mind.
            </li>
            <li>
              <strong>Trusted Partners:</strong> Join our community of parents and caregivers who trust babycare.com.bd for expert advice, reliable products, and a supportive network.
            </li>
            <li>
              <strong>User-Friendly Experience:</strong> Enjoy a seamless shopping experience with our easy-to-navigate platform, ensuring you find what you need quickly and effortlessly.
            </li>
            <li>
              <strong>Nationwide Delivery:</strong> We deliver smiles across Bangladesh! Benefit from our reliable nationwide delivery service, bringing the best baby care products to your doorstep.
            </li>
          </ul>

          <h3 className="text-sm font-bold text-slate-800 pt-2">Your Journey, Our Priority:</h3>
          <p>
            At Babycare, we understand that every parenting journey is unique. Our commitment is to be your companion, providing not just products but a community that shares the joys and challenges of raising happy, healthy children.
          </p>
          <p className="font-semibold text-slate-700">
            Shop with confidence, explore with joy, and nurture every precious moment with babycare.com.bd - Your Partner in Parenthood.
          </p>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
