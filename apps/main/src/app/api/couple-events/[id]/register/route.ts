import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CoupleEvent from "@/models/CoupleEvent";
import User from "@/models/User";
import mongoose from "mongoose";

interface UserWithCouple {
  _id: mongoose.Types.ObjectId;
  coupleId?: mongoose.Types.ObjectId | string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user's couple ID from database
    const user = await User.findById(session.user.id) as UserWithCouple | null;
    
    if (!user || !user.coupleId) {
      return NextResponse.json(
        { error: "You must be part of a couple to register for events" },
        { status: 400 }
      );
    }

    const { id: eventId } = await params;
    const coupleId = user.coupleId;

    // Find the event
    const event = await CoupleEvent.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if event is public
    if (!event.isPublic) {
      return NextResponse.json(
        { error: "This event is not open for registration" },
        { status: 400 }
      );
    }

    // Check if event is still accepting registrations
    if (event.status === 'completed' || event.status === 'cancelled') {
      return NextResponse.json(
        { error: "This event is no longer accepting registrations" },
        { status: 400 }
      );
    }

    // Check if already registered
    const coupleObjectId = new mongoose.Types.ObjectId(coupleId);
    if (event.registeredCouples.some((id: mongoose.Types.ObjectId) => 
      id.toString() === coupleObjectId.toString()
    )) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.maxRegistrations && event.registeredCouples.length >= event.maxRegistrations) {
      return NextResponse.json(
        { error: "This event is full" },
        { status: 400 }
      );
    }

    // Register the couple
    event.registeredCouples.push(coupleObjectId);
    await event.save();

    return NextResponse.json({
      message: "Successfully registered for the event",
      event
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user's couple ID from database
    const user = await User.findById(session.user.id) as UserWithCouple | null;
    
    if (!user || !user.coupleId) {
      return NextResponse.json(
        { error: "You must be part of a couple" },
        { status: 400 }
      );
    }

    const { id: eventId } = await params;
    const coupleId = user.coupleId;

    // Find the event
    const event = await CoupleEvent.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Remove the couple from registered list
    const coupleObjectId = new mongoose.Types.ObjectId(coupleId);
    event.registeredCouples = event.registeredCouples.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== coupleObjectId.toString()
    );
    await event.save();

    return NextResponse.json({
      message: "Successfully unregistered from the event",
      event
    });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    return NextResponse.json(
      { error: "Failed to unregister from event" },
      { status: 500 }
    );
  }
}