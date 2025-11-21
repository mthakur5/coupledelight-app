import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const wishlistItems = await Wishlist.find({ userId: session.user.id })
      .populate("productId")
      .sort({ addedAt: -1 });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { productId, notes } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      userId: session.user.id,
      productId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 400 }
      );
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: session.user.id,
      productId,
      notes: notes || "",
    });

    // Populate product details for response
    await wishlistItem.populate("productId");

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await Wishlist.findOneAndDelete({
      userId: session.user.id,
      productId,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}