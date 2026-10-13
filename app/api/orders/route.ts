import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, findProductById } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to view orders' }, { status: 401 });
    }

    // Admins see all orders, customers see only their own
    const orders = user.role === 'admin' ? await getOrders() : await getOrders(user._id);

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();

    const { customer, shippingAddress, items, paymentMethod, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cannot create order with an empty cart' }, { status: 400 });
    }

    if (!customer?.name || !customer?.phone) {
      return NextResponse.json({ error: 'Customer name and phone number are required' }, { status: 400 });
    }

    if (!shippingAddress?.address || !shippingAddress?.city) {
      return NextResponse.json({ error: 'Full delivery address and delivery city area are required' }, { status: 400 });
    }

    // Verify all prices and stock server-side
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const dbProduct = await findProductById(item.productId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product "${item.name}" is no longer available` }, { status: 400 });
      }

      if (dbProduct.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stockQuantity} remaining.` },
          { status: 400 }
        );
      }

      const itemSubtotal = dbProduct.currentPrice * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.images[0] || '/images/products/feeder-brush.svg',
        price: dbProduct.currentPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // Inside Dhaka: ৳60, Outside Dhaka: ৳120
    const shippingFee = shippingAddress.city === 'Outside Dhaka' ? 120 : 60;
    const discount = 0;
    const total = subtotal + shippingFee - discount;

    const newOrder = await createOrder({
      customer: {
        userId: user?._id || customer.userId || undefined,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || undefined,
      },
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city,
        notes: notes || shippingAddress.notes || '',
      },
      items: validatedItems,
      subtotal,
      shippingFee,
      discount,
      total,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'unpaid',
      orderStatus: 'pending',
      notes: notes || '',
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
