import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import User from "@/models/users";

export async function POST(request) {
  try {
    const { bookingId, serviceProviderId, assignedServiceProvider } =
      await request.json();
    await connectMongoDB();

    const booking = await Booking.findById(bookingId)
      .populate("availableServiceProviders")
      .populate("user");
    const serviceProvider = await User.findById(serviceProviderId);

    if (!booking || !serviceProvider) {
      return NextResponse.json(
        { success: false, message: "Booking or service provider not found" },
        { status: 404 }
      );
    }

    booking.availableServiceProviders =
      booking.availableServiceProviders.filter(
        (sp) => sp._id.toString() !== serviceProviderId
      );

    booking.access = booking.access.filter(
      (sp) => sp.toString() !== serviceProviderId
    );

    if (assignedServiceProvider === serviceProviderId) {
      booking.assignedServiceProviders = {};
    }
    await booking.save();
    serviceProvider.bookings = serviceProvider.bookings.filter(
      (b) => b.toString() !== bookingId
    );
    await serviceProvider.save();
    return NextResponse.json({
      success: true,
      message: "Provider terminated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
