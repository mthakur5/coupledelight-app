import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order, { IOrderItem } from '@/models/Order';
import { auth } from '@/lib/auth';

// GET - Fetch all orders (for logged in user) or by email
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let orders;

    if (session?.user?.id) {
      // If user is logged in, get their orders
      orders = await Order.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean();
    } else if (email) {
      // If no session but email provided, get orders by email
      orders = await Order.find({ 'shippingAddress.email': email })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      return NextResponse.json(
        { error: 'Unauthorized. Please login or provide email.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    const body = await request.json();

    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
      notes,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email || 
        !shippingAddress.phone || !shippingAddress.address) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['card', 'upi', 'cod'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Valid payment method is required' },
        { status: 400 }
      );
    }

    // Create order data
    const orderData: Partial<typeof Order.prototype> = {
      items: items.map((item: IOrderItem & { _id: string }) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
      })),
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'pending',
      subtotal: subtotal || 0,
      tax: tax || 0,
      shippingCost: shippingCost || 0,
      total: total || 0,
      notes: notes || '',
    };

    // Add userId if user is logged in
    if (session?.user?.id) {
      orderData.userId = session.user.id;
    }

    // Create the order
    const order = await Order.create(orderData);

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully',
        order: {
          orderNumber: order.orderNumber,
          total: order.total,
          orderStatus: order.orderStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}