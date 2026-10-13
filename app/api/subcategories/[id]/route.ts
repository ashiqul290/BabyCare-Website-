import { NextRequest, NextResponse } from 'next/server';
import { findSubcategoryById, updateSubcategory, deleteSubcategory, findCategoryById } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const subcategory = await findSubcategoryById(id);
    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, subcategory });
  } catch (error) {
    console.error('Get subcategory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin(req);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    if (updates.categoryId) {
      const parentCat = await findCategoryById(updates.categoryId);
      if (parentCat) {
        updates.categoryName = parentCat.name;
      }
    }

    const updated = await updateSubcategory(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, subcategory: updated });
  } catch (error) {
    console.error('Update subcategory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin(req);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const result = await deleteSubcategory(id);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
