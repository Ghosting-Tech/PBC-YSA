import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import Sub from "@/models/subService";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Check if service ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Service ID not found" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Check user login status and role
    const user = await isLoggedIn(request);
    let query = { _id: id };

    // Restrict to active services if user is not an admin
    if (user?.user?.role !== "admin") {
      query.status = "active";
    }

    // Fetch the service and populate sub-services
    let service = await Service.findOne(query).populate("subServices");

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    // Filter active sub-services for non-admin users
    if (user?.user?.role !== "admin") {
      service.subServices = service.subServices.filter(
        (subService) => subService.status === "active"
      );
    }

    return NextResponse.json(
      { success: true, service, message: "Service fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch the service",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if the ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Service ID is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Find the service by ID
    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    // Delete all associated sub-services concurrently
    if (service.subServices.length > 0) {
      await Promise.all(
        service.subServices.map((subId) => Sub.findByIdAndDelete(subId))
      );
    }

    // Delete the service itself
    await Service.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Successfully deleted the service and associated sub-services",
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle any unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete the service",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Service ID not provided" },
        { status: 400 }
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided for update" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if the service exists
    const serviceExists = await Service.findById(id);
    if (serviceExists === null) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    // Update the service
    const updatedService = await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("subServices");

    if (!updatedService) {
      return NextResponse.json(
        { success: false, message: "Failed to update the service" },
        { status: 500 }
      );
    }

    console.log("Updated Service:", updatedService);

    return NextResponse.json(
      {
        success: true,
        message: "Successfully updated the service",
        data: updatedService,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating service:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update the service",
        error: error.message || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
