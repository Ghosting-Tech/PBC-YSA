import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Notification from "@/models/notification";

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 25;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    await connectMongoDB();

    // Get total count of notifications for pagination
    const totalCount = await Notification.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated notifications
    const notifications = await Notification.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Return paginated data with metadata
    return NextResponse.json({
      success: true,
      notifications,
      meta: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, image, from, category, url } = body;

    // Validate required fields
    if (!title || !description || !from || !category || !url) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required!",
        },
        {
          status: 400,
        }
      );
    }

    // Connect to the database
    await connectMongoDB();

    // Create a new notification
    const notification = new Notification({
      title,
      description,
      image,
      from,
      category,
      link: url,
      createdAt: new Date(), // Add creation timestamp
    });

    // Save the notification to the database
    await notification.save();

    return NextResponse.json(
      {
        notification,
        success: true,
        message: "Notification created successfully!",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
