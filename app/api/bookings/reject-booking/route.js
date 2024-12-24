import { NextResponse } from "next/server";
import Booking from "@/models/booking";
import User from "@/models/users";

export async function POST(request) {
  try {
    const { bookingId, serviceProviderId } = await request.json();
    console.log({ bookingId, serviceProviderId });

    // Get the booking and service provider
    const booking = await Booking.findById(bookingId);
    const serviceProvider = await User.findById(serviceProviderId);
    console.log({ booking, serviceProvider });

    // Remove booking from service provider's bookings
    serviceProvider.bookings = serviceProvider.bookings.filter(
      (id) => id.toString() !== bookingId
    );
    await serviceProvider.save();

    // Remove service provider from booking's availableServiceProviders and access
    booking.availableServiceProviders =
      booking.availableServiceProviders.filter(
        (sp) => sp.toString() !== serviceProviderId
      );
    booking.access = booking.access.filter(
      (id) => id.toString() !== serviceProviderId
    );

    // Check if no service providers left
    if (booking.availableServiceProviders.length === 0) {
      booking.noServiceProviderAvailable = true;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate("availableServiceProviders")
      .populate("user");

    const updatedUser = await User.findById(serviceProviderId).populate(
      "bookings"
    );

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      user: updatedUser,
      message: "Booking rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    return NextResponse.json(
      { error: "Failed to reject booking" },
      { status: 500 }
    );
  }
}
