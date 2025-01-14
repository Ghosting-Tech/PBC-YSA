import { isLoggedIn } from "@/libs/isLoggedIn";
import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";
import Service from "@/models/service-model";
import { getDistance } from "@/utils/distance";
import User from "@/models/users";
import shortUrl from "@/utils/shortUrl";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Ensure the MongoDB connection is established
    await connectMongoDB();

    // Check if the user is logged in
    const user = await isLoggedIn(request);
    if (!user.success) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract page and limit from the request query, with default values
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the bookings using the $in operator with pagination
    const services = await Booking.find({ _id: { $in: user.user.bookings } })
      .sort({ createdAt: -1 })
      .skip(skip) // Skip the specified number of documents
      .limit(limit) // Limit the number of documents returned
      .lean(); // Return plain JavaScript objects for faster performance

    // Get the total count for pagination
    const totalBookings = await Booking.countDocuments({
      _id: { $in: user.user.bookings },
    });
    const totalPages = Math.ceil(totalBookings / limit);

    return NextResponse.json(
      {
        success: true,
        data: services,
        meta: {
          currentPage: page,
          totalPages,
          totalBookings,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

function generateOTP() {
  // Generate a random number between 1000 and 9999
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
}

// Create new service

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Parse the request body
    const { formData, location, cartItems, user, paymentStatus } =
      await request.json();
    const otp = generateOTP();
    const { lat, lng } = location;

    // Fetch all service providers and filter based on proximity (within 15 km)
    const serviceProviders = await User.find({
      role: "service-provider",
      active: true,
      available: true,
      gender: user.gender,
    }).populate("services");

    if (serviceProviders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No service providers found",
        },
        { status: 303 }
      );
    }

    const uniqueServiceProviders = new Set();

    serviceProviders.forEach((sp) => {
      sp.locations.forEach((s) => {
        const distance = getDistance(lat, lng, s.lat, s.lng);
        if(sp.profession === "ambulance-driver")
        {
          if (distance <= 10 && !uniqueServiceProviders.has(sp._id.toString())) {
            uniqueServiceProviders.add(sp._id.toString());
          }
        }
        else{
          if (distance <= 25 && !uniqueServiceProviders.has(sp._id.toString())) {
            uniqueServiceProviders.add(sp._id.toString());
          }
        }
       
      });
    });

    // Convert Set to array to use .map()
    let nearestServiceProvidersArray = Array.from(uniqueServiceProviders);

    // If no nearby service providers found
    if (nearestServiceProvidersArray.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No service providers found within the specified range",
        },
        { status: 303 }
      );
    }

    const availableServiceProviders = [];

    for (const cartItem of cartItems) {
      for (const spId of nearestServiceProvidersArray) {
        // Await the service provider query and population

        const sp = await User.findById(spId).populate("services");

        // Ensure services are populated and defined before iterating
        if (sp?.services) {
          sp.services.forEach((service) => {
            if (service._id == cartItem.serviceId) {
              console.log(service);
              availableServiceProviders.push(spId);
            }
          });
        }
      }
    }

    if (availableServiceProviders.length <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No service providers found for the service",
        },
        { status: 303 }
      );
    }

    const bookingData = {
      ...formData,
      location,
      paymentStatus,
      cartItems,
      availableServiceProviders,
      access: availableServiceProviders,
      otp,
      user: user._id,
      noServiceProviderAvailable: availableServiceProviders.length <= 0,
    };

    const booking = await Booking.create(bookingData);

    // Update user's booking data in parallel
    const updateUserPromise = User.findByIdAndUpdate(
      user._id,
      {
        $push: { bookings: booking._id },
      },
      { new: true }
    );

    // Update service providers' bookings in parallel
    const updateServiceProvidersPromises = availableServiceProviders.map(
      (spId) =>
        User.findByIdAndUpdate(spId, {
          $push: { bookings: booking._id },
        })
    );

    // Update services with the new booking in parallel
    const updateServicesPromises = cartItems.map((cartItem) =>
      Service.findByIdAndUpdate(cartItem.serviceId, {
        $push: { bookings: booking._id },
      })
    );

    // Wait for all updates to finish
    const [updatedUser] = await Promise.all([
      updateUserPromise,
      ...updateServiceProvidersPromises,
      ...updateServicesPromises,
    ]);
    const baseURL = process.env.PHONEPE_REDIRECT_URL || "http://localhost:3000";

    const handleSendNotification = async (token, link) => {
      await fetch(`${baseURL}/api/send-notification`, {
        method: "POST",
        body: JSON.stringify({
          token: token,
          title: "New Service Request!",
          message: "You have get a new service request.",
          link,
        }),
      });
    };

    const newBooking = await Booking.findById(booking._id).populate(
      "availableServiceProviders"
    );

    newBooking.availableServiceProviders.map(async (provider) => {
      if (provider.notificationToken) {
        await handleSendNotification(
          provider.notificationToken,
          `/service-provider/booking/${booking._id}`
        );
      }
    });

    //Sending SMS to the service providers

    newBooking.availableServiceProviders.map(async (provider) => {
      const cleanUrl = await shortUrl(
        `${process.env.PRODUCTION_URL}/service-provider/booking/${booking._id}`
      );

      const itemNames = booking.cartItems.map((item) => item.name).join(", ");
      const truncatedItemNames =
        itemNames.length > 30 ? `${itemNames.slice(0, 27)}...` : itemNames;

      const message = `You've received a booking request for ${truncatedItemNames}, scheduled on ${booking.date} ${cleanUrl}. Please log in to your dashboard to accept or decline the service request. -- GHOSTING WEBTECH PRIVATE LIMITED`;

      await fetch(`${process.env.PHONEPE_REDIRECT_URL}/api/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: provider.phoneNumber,
          message,
          templateid: "1707172966908046231",
        }),
      });
    });

    // Sending SMS to User on creating booking

    const cleanUrl = await shortUrl(
      `${process.env.PRODUCTION_URL}/user/bookings/${booking._id}`
    );

    const message = `Thank you, ${booking.fullname}. Your booked reservation ID: ${booking.bookingId} scheduled on ${booking.date} was successful! Track booking: ${cleanUrl} -- GHOSTING WEBTECH PRIVATE LIMITED`;

    await fetch(`${process.env.PHONEPE_REDIRECT_URL}/api/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: booking.phoneNumber,
        message,
        templateid: "1707172959504931343",
      }),
    });

    return NextResponse.json(
      {
        booking,
        updatedUser,
        success: true,
        message: "Booking created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error handling booking:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the booking",
        error,
      },
      { status: 500 }
    );
  }
}
