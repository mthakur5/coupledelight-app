import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { auth } from '@/lib/auth';

// GET - Fetch a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await auth();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const { id } = await params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (session?.user?.id) {
      // If user is logged in, check if order belongs to them
      if (order.userId?.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    } else if (email) {
      // If no session but email provided, check if email matches
      if (order.shippingAddress.email !== email) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized. Please login or provide email.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - Update order (for cancellation)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await auth();
    const body = await request.json();
    const { action, cancelReason } = body;

    const { id } = await params;
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (session?.user?.id) {
      if (order.userId?.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Handle order cancellation
    if (action === 'cancel') {
      // Only allow cancellation for pending, confirmed, or processing orders
      if (!['pending', 'confirmed', 'processing'].includes(order.orderStatus)) {
        return NextResponse.json(
          { error: 'This order cannot be cancelled' },
          { status: 400 }
        );
      }

      order.orderStatus = 'cancelled';
      order.cancelReason = cancelReason || 'Cancelled by customer';
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        order: {
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}