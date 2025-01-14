import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import SubService from "@/models/subService"; // Make sure this is the model for subservices
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 100);

    const data = await request.json();

    await connectMongoDB();

    const user = await isLoggedIn(request);

    // Define the base match query for services
    let matchQuery = {};
    if (user?.user?.role !== "admin") {
      if (!data.city) {
        return NextResponse.json(
          { success: false, message: "City is required for non-admin users." },
          { status: 400 }
        );
      }
      matchQuery = { status: "active", cities: data.city };
    }

    // Fetch the services with a standard find query
    const services = await Service.aggregate([
      {
        $match: matchQuery, // Filter documents based on matchQuery
      },
      {
        $addFields: {
          bookingsCount: { $size: "$bookings" }, // Calculate the length of the bookings array
        },
      },
      {
        $sort: { bookingsCount: -1 }, // Sort by the calculated field
      },
      {
        $limit: limit, // Apply the limit
      },
      {
        $lookup: {
          from: "subs", // The collection name for subServices
          localField: "subServices",
          foreignField: "_id",
          as: "subServices",
          pipeline:
            user?.user?.role !== "admin"
              ? [{ $match: { status: "active" } }]
              : [],
        },
      },
      {
        $project: {
          bookingsCount: 0, // Remove the temporary field if not needed in the response
        },
      },
    ]);

    return NextResponse.json(
      { success: true, data: services },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching top booked services:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching services." },
      { status: 500 }
    );
  }
}
