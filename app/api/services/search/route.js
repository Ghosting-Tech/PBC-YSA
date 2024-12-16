import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import Sub from "@/models/subService";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = Math.min(parseInt(searchParams.get("limit")) || 100, 100);
    const data = await request.json();

    if (!search) {
      return NextResponse.json(
        { success: false, message: "Search term is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const user = await isLoggedIn(request);

    // Create base match query
    let baseMatchQuery = {};
    if (user?.user?.role !== "admin") {
      if (!data.city) {
        return NextResponse.json(
          { success: false, message: "City is required for non-admin users." },
          { status: 400 }
        );
      }
      baseMatchQuery = { status: "active", cities: data.city };
    }

    // Find subservices matching the search first
    const matchingSubServices = await Sub.find({
      name: { $regex: search, $options: "i" },
      ...(user?.user?.role !== "admin" && { status: "active" } && {
          cities: { $in: [data.city] },
        }),
    })
      .select(["-__v", "-updatedAt", "-bookings"])
      .lean();

    // Create an array to store final results
    const finalResults = [];

    // If subservices are found, add them to results
    if (matchingSubServices.length > 0) {
      finalResults.push(...matchingSubServices);
    }

    // Prepare service search query
    const serviceSearchQuery = {
      ...baseMatchQuery,
      $or: [
        { name: { $regex: search, $options: "i" } },
        ...(matchingSubServices.length > 0
          ? [{ _id: { $in: matchingSubServices.map((sub) => sub.serviceId) } }]
          : []),
      ],
    };

    // Fetch services with matching name
    const matchingServices = await Service.find(serviceSearchQuery)
      .select(["-__v", "-updatedAt", "-bookings"])
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Add services to results if they match or haven't been added yet
    matchingServices.forEach((service) => {
      // Only add if not already in results
      if (
        !finalResults.some(
          (result) => result._id.toString() === service._id.toString()
        )
      ) {
        // Reset subServices to empty array
        service.subServices = [];
        finalResults.push(service);
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Services fetched successfully",
        data: finalResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching services.",
      },
      { status: 500 }
    );
  }
}
