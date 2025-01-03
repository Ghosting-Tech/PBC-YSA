import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import SubService from "@/models/subService"; // Make sure this is the model for subservices
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 100);

    // let data = await request.json();
    let data = {
      city: "Patna",
    };
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

    // Fetch the services with a standard `find` query
    const services = await Service.find(matchQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "subServices",
        match: user?.user?.role !== "admin" ? { status: "active" } : {}, // Filters subservices only if user is not admin
      })
      .lean();

    return NextResponse.json(
      { success: true, data: services },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching services:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching services." },
      { status: 500 }
    );
  }
}
