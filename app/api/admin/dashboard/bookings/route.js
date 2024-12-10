import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const bookings = await Booking.find(
      {},
      {
        fullname: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}
