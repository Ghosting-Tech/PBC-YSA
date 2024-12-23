import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Notification from "@/models/notification";

export async function PUT(request, { params }) {
  try {
    console.log({ params });
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the current notification to get its `isRead` status
    const currentNotification = await Notification.findById(id);

    if (!currentNotification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    // Toggle the `isRead` value
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { isRead: !currentNotification.isRead }, // Toggle the value
      { new: true } // Returns the updated document
    );

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
