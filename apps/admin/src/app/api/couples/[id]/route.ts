export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Couple from '@/models/Couple';
import { auth } from '@/lib/auth';

// Get single couple
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const couple = await Couple.findById(id)
      .populate('user1Id', 'email')
      .populate('user2Id', 'email')
      .lean();

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

// Update couple
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const couple = await Couple.findById(id);
    if (!couple) {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      coupleName,
      displayName,
      location,
      city,
      state,
      bio,
      status,
      relationshipType,
      lifestyleType,
      relationshipStartDate,
      anniversaryDate,
      partner1,
      partner2,
    } = body;

    // Update fields
    if (coupleName !== undefined) couple.coupleName = coupleName;
    if (displayName !== undefined) couple.displayName = displayName;
    if (location !== undefined) couple.location = location;
    if (city !== undefined) couple.city = city;
    if (state !== undefined) couple.state = state;
    if (bio !== undefined) couple.bio = bio;
    if (status !== undefined) couple.status = status;
    if (relationshipType !== undefined) couple.relationshipType = relationshipType;
    if (lifestyleType !== undefined) couple.lifestyleType = lifestyleType;
    if (relationshipStartDate !== undefined) couple.relationshipStartDate = new Date(relationshipStartDate);
    if (anniversaryDate !== undefined) couple.anniversaryDate = anniversaryDate ? new Date(anniversaryDate) : undefined;

    // Update partner details
    if (partner1) {
      if (!couple.partner1) couple.partner1 = {};
      if (partner1.name !== undefined) couple.partner1.name = partner1.name;
      if (partner1.age !== undefined) couple.partner1.age = partner1.age;
      if (partner1.occupation !== undefined) couple.partner1.occupation = partner1.occupation;
    }

    if (partner2) {
      if (!couple.partner2) couple.partner2 = {};
      if (partner2.name !== undefined) couple.partner2.name = partner2.name;
      if (partner2.age !== undefined) couple.partner2.age = partner2.age;
      if (partner2.occupation !== undefined) couple.partner2.occupation = partner2.occupation;
    }

    await couple.save();

    return NextResponse.json({
      message: 'Couple updated successfully',
      couple: couple.toObject(),
    });
  } catch (error) {
    console.error('Error updating couple:', error);
    return NextResponse.json(
      { error: 'Failed to update couple' },
      { status: 500 }
    );
  }
}

// Delete couple
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const couple = await Couple.findById(id);
    if (!couple) {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      );
    }

    await Couple.deleteOne({ _id: id });

    return NextResponse.json({
      message: 'Couple deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting couple:', error);
    return NextResponse.json(
      { error: 'Failed to delete couple' },
      { status: 500 }
    );
  }
}