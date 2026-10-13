import { NextRequest, NextResponse } from 'next/server';
import { getCustomers } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireAdmin(req);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();

    let customers = await getCustomers();

    if (search) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          c.email.toLowerCase().includes(search)
      );
    }

    // Never return passwords!
    const sanitized = customers.map((c) => ({
      _id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      role: c.role,
      isActive: c.isActive,
      addresses: c.addresses || [],
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ success: true, customers: sanitized });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
