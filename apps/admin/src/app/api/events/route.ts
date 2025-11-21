import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CoupleEvent from "@/models/CoupleEvent";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (isActive) {
      query.isActive = isActive === "true";
    }

    const events = await CoupleEvent.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("coupleId")
      .populate("registeredCouples");

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();

    // All events are public by default
    const event = await CoupleEvent.create({
      ...body,
      isPublic: true,
      createdBy: session.user.id,
      registeredCouples: [],
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}