import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();
    const user = await User.findById(id).populate("bookings");

    if (!user) {
      return NextResponse.status(404).json({
        success: false,
        message: "User not found",
      }); // Return 404 Not Found if user not found.  //
    }

    console.log(user);
    return NextResponse.json(
      { success: true, user, message: "Bookings fetched" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
