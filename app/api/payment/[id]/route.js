import connectMongoDB from "@/libs/mongodb";
import Payment from "@/models/payment";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params; // Extract providerId from params

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch the payment details for the given providerId
    const data = await Payment.findOne({
      _id: id,
    });
    if (!data) {
      // If no payments are found for the provider, return 404
      return NextResponse.json(
        { message: "No payments found for this provider." },
        { status: 404 }
      );
    }

    // Return the service provider payment details
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment data:", error);

    // Return an error response if something goes wrong
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
