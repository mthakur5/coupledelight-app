import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Couple from '@/models/Couple';
import mongoose from 'mongoose';

// POST - Approve user
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
          accountStatus: 'approved',
          accountStatusNote: note || 'Approved by admin',
          approvedAt: new Date(),
          approvedBy: new mongoose.Types.ObjectId(session.user.id),
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

    // Create couple entry if not already exists
    try {
      const existingCouple = await Couple.findOne({
        $or: [
          { user1Id: user._id },
          { user2Id: user._id }
        ]
      });

      if (!existingCouple) {
        // Create a default couple entry with the user as user1
        // user2 will be set when a partner is linked
        await Couple.create({
          user1Id: user._id,
          user2Id: user._id, // Placeholder, can be updated later
          relationshipStartDate: new Date(),
          status: 'active',
        });
      }
    } catch (coupleError) {
      console.log('Could not create couple entry:', coupleError);
      // Continue even if couple creation fails
    }

    return NextResponse.json({
      message: 'User approved successfully',
      user: {
        ...user.toObject(),
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        approvedAt: user.approvedAt?.toISOString(),
        approvedBy: user.approvedBy?.toString(),
      },
    });
  } catch (error) {
    console.error('Error approving user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}