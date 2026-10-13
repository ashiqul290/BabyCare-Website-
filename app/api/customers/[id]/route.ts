import { NextRequest, NextResponse } from 'next/server';
import { findUserById, updateUser, getOrders } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await requireAdmin(req);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const customer = await findUserById(id);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customerOrders = await getOrders(customer._id);

    return NextResponse.json({
      success: true,
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        isActive: customer.isActive,
        addresses: customer.addresses || [],
        createdAt: customer.createdAt,
      },
      orders: customerOrders,
    });
  } catch (error) {
    console.error('Get customer details error:', error);
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
    const { isActive } = await req.json();

    const updated = await updateUser(id, { isActive: Boolean(isActive) });
    if (!updated) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      customer: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error('Update customer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
