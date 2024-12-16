import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");
  const MTID = searchParams.get("MTID");

  if (!MTID)
    return NextResponse.json(
      { success: false, message: "Transaction is not found!" },
      { status: 400 }
    );
  if (!bookingId)
    return NextResponse.json(
      { success: false, message: "Order id is required!" },
      { status: 400 }
    );

  try {
    await connectMongoDB();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Invalid booking id" },
        { status: 500 }
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paid: true,
          transactionId: MTID,
          paymentMethod: "Online",
          status: "Request sended to service provider!",
        },
      },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: updatedBooking, message: "Payment successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during checking payment status:", error);
    return NextResponse.json(
      { success: false, message: "Checking payment status failed" },
      { status: 500 }
    );
  }
}
