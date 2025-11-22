import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// POST - Suspend user
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const { note } = body;
    const { id } = await params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          accountStatus: 'suspended',
          accountStatusNote: note || 'Suspended by admin',
        },
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'User suspended successfully',
      user: {
        ...user.toObject(),
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}