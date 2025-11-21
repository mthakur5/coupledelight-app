import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Couple from "@/models/Couple";

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
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    const couples = await Couple.find(query)
      .populate("user1Id", "email name")
      .populate("user2Id", "email name")
      .sort({ createdAt: -1 });

    return NextResponse.json(couples);
  } catch (error) {
    console.error("Error fetching couples:", error);
    return NextResponse.json(
      { error: "Failed to fetch couples" },
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

    const couple = await Couple.create(body);

    return NextResponse.json(couple, { status: 201 });
  } catch (error) {
    console.error("Error creating couple:", error);
    return NextResponse.json(
      { error: "Failed to create couple" },
      { status: 500 }
    );
  }
}