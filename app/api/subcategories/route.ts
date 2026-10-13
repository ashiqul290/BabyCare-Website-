import { NextRequest, NextResponse } from 'next/server';
import { getSubcategories, findCategoryById, createSubcategory } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;

    const subcategories = await getSubcategories(categoryId);
    return NextResponse.json({ success: true, subcategories });
  } catch (error) {
    console.error('Get subcategories error:', error);
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
    const { name, slug, categoryId, description, isActive } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Subcategory name and parent category are required' }, { status: 400 });
    }

    const parentCat = await findCategoryById(categoryId);
    if (!parentCat) {
      return NextResponse.json({ error: 'Selected parent category does not exist' }, { status: 400 });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    const newSubcategory = await createSubcategory({
      name: name.trim(),
      slug: generatedSlug,
      categoryId,
      categoryName: parentCat.name,
      description: description || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json({ success: true, subcategory: newSubcategory }, { status: 201 });
  } catch (error) {
    console.error('Create subcategory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
