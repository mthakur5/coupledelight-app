import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Event from "@/models/Event";

export async function GET(request: NextRequest) {
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
    const status = searchParams.get("status");

    const query: { userId: string; status?: string } = {
      userId: session.user.id,
    };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("eventId")
      .sort({ bookingDate: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
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
    const {
      eventId,
      bookingDate,
      bookingTime,
      numberOfPeople,
      contactDetails,
      specialRequests,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!eventId || !bookingDate || !bookingTime || !contactDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get event details
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Calculate total amount
    const totalAmount = event.price * (numberOfPeople || 2);

    // Create booking
    const booking = await Booking.create({
      userId: session.user.id,
      eventId,
      eventDetails: {
        title: event.title,
        location: event.location.address,
        price: event.price,
      },
      bookingDate: new Date(bookingDate),
      bookingTime,
      numberOfPeople: numberOfPeople || 2,
      totalAmount,
      contactDetails,
      specialRequests: specialRequests || "",
      paymentMethod: paymentMethod || "COD",
      status: "pending",
      paymentStatus: "pending",
    });

    // Populate event details for response
    await booking.populate("eventId");

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}