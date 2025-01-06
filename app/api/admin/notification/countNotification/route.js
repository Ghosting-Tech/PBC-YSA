import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Notification from "@/models/notification";

export async function GET(request) {
  try {
    await connectMongoDB();

    // Fetch all unread notifications
    const notifications = await Notification.find({ isRead: false });

    // Return data
    return NextResponse.json({
      success: true,
      notifications,
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
