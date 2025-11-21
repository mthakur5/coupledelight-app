import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CoupleEvent from "@/models/CoupleEvent";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const isPublic = searchParams.get("isPublic");
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};

    // Only show public events and upcoming/planned events
    if (isPublic === "true") {
      query.isPublic = true;
      query.status = { $in: ['upcoming', 'planned'] };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const events = await CoupleEvent.find(query)
      .sort({ date: 1 })
      .populate("registeredCouples");

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching couple events:", error);
    return NextResponse.json(
      { error: "Failed to fetch couple events" },
      { status: 500 }
    );
  }
}