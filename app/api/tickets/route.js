import connectMongoDB from "@/libs/mongodb";
import Ticket from "@/models/ticket";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, issue, from, user } = await request.json();

    // Validate required fields
    if (!name || !issue || !from || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          data: null,
        },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
          data: null,
        },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const ticket = await Ticket.create({
      name,
      email,
      issue,
      from,
      user,
    });

    const populatedTicket = await ticket.populate("user");

    // Populate user details if needed
    await User.findByIdAndUpdate(user, {
      $push: { tickets: populatedTicket._id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ticket raised successfully",
        data: populatedTicket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ticket creation error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: Object.values(error.errors)
            .map((err) => err.message)
            .join(", "),
          data: null,
        },
        { status: 400 }
      );
    }

    // Handle mongoose cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID format",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create ticket",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch tickets
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId)
      .populate("tickets")
      .sort({ createdAt: -1 });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tickets fetched successfully",
        data: user.tickets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tickets",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    const { status, ticketId } = await request.json();

    if (!["resolved", "unresolved"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Status can only be 'resolved' or 'unresolved'",
        },
        { status: 400 }
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (error) {
    console.log("Error updating ticket:", error);
    return NextResponse.json(
      { success: false, message: "Error updating ticket" },
      { status: 500 }
    );
  }
}
