import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, findCategoryById } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const subcategorySlug = searchParams.get('subcategorySlug') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStock = searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined;
    const isFeatured = searchParams.get('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined;
    const homepageSection = searchParams.get('homepageSection') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

    const result = await getProducts({
      search,
      categorySlug,
      categoryId,
      subcategorySlug,
      brand,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      homepageSection,
      sortBy,
      limit,
      page,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireAdmin(req);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      sku,
      shortDescription,
      fullDescription,
      images,
      categoryId,
      subcategoryId,
      brand,
      currentPrice,
      originalPrice,
      stockQuantity,
      inStock,
      isFeatured,
      homepageSection,
      tags,
      badge,
      features,
      ingredients,
      seoTitle,
      seoDescription,
      isActive,
    } = body;

    if (!name || !categoryId || currentPrice === undefined) {
      return NextResponse.json({ error: 'Product name, category, and price are required' }, { status: 400 });
    }

    if (Number(currentPrice) < 0 || (originalPrice !== undefined && Number(originalPrice) < 0)) {
      return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
    }

    if (stockQuantity !== undefined && Number(stockQuantity) < 0) {
      return NextResponse.json({ error: 'Stock quantity cannot be negative' }, { status: 400 });
    }

    const cat = await findCategoryById(categoryId);

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    const generatedSku = sku || `BC-${Date.now().toString().slice(-6)}`;

    const newProduct = await createProduct({
      name: name.trim(),
      slug: generatedSlug,
      sku: generatedSku,
      shortDescription: shortDescription || '',
      fullDescription: fullDescription || '',
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/products/feeder-brush.svg'],
      categoryId,
      categorySlug: cat?.slug || '',
      subcategoryId: subcategoryId || undefined,
      brand: brand || 'BabyCare',
      currentPrice: Number(currentPrice),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 50,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      homepageSection: homepageSection || 'none',
      tags: Array.isArray(tags) ? tags : [],
      badge: badge || undefined,
      features: Array.isArray(features) ? features : [],
      ingredients: ingredients || '',
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || shortDescription || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      rating: 5.0,
      reviewCount: 0,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
