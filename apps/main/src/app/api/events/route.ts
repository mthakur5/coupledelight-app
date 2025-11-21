import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const featured = searchParams.get("featured");

    // Build query
    interface QueryFilter {
      isActive: boolean;
      category?: string;
      "location.city"?: { $regex: string; $options: string };
      price?: { $gte?: number; $lte?: number };
      isFeatured?: boolean;
    }

    const query: QueryFilter = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    const events = await Event.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(50);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}