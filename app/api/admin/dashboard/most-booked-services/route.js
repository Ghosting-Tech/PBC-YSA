import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import Service from "@/models/service-model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const services = await Service.find({});

    const servicesWithBookings = services.map((service) => {
      return {
        name: service.name,
        bookings: service.bookings.length || 0,
      };
    });

    return NextResponse.json(servicesWithBookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch most booked services" },
      { status: 500 }
    );
  }
}
