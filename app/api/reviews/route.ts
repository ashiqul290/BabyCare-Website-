import { NextRequest, NextResponse } from 'next/server';
import { getReviews, createReview, findProductById } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const all = searchParams.get('all') === 'true';

    const user = await getUserFromRequest(req);
    const isAdmin = user?.role === 'admin';

    // If requested all and is admin, show pending and rejected too
    const onlyApproved = !(all && isAdmin);
    const reviews = await getReviews(productId, onlyApproved);

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const { productId, rating, comment, userName, userPhone } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Product ID, rating (1-5), and review text are required' }, { status: 400 });
    }

    const product = await findProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newReview = await createReview({
      productId,
      productName: product.name,
      userId: user?._id || undefined,
      userName: user?.name || userName || 'Verified Parent',
      userPhone: user?.phone || userPhone || undefined,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted and is awaiting approval.',
      review: newReview,
    });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
