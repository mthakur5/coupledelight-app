import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET - Fetch a single couple's profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid couple ID' },
        { status: 400 }
      );
    }

    // Fetch the couple
    const couple = await User.findOne({
      _id: id,
      accountStatus: 'approved', // Only show approved profiles
    }).select('-password -accountStatusNote -approvedBy');

    if (!couple) {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ couple });
  } catch (error) {
    console.error('Error fetching couple:', error);
    return NextResponse.json(
      { error: 'Failed to fetch couple' },
      { status: 500 }
    );
  }
}