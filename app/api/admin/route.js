import connectMongoDB from "@/libs/mongodb";
import Booking from "@/models/booking";
import Service from "@/models/service-model";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  // Use MongoDB aggregation to get counts directly from the database
  const usersAggregation = User.aggregate([
    {
      $facet: {
        totalUsers: [{ $match: { role: "user" } }, { $count: "count" }],
        activeUsers: [
          { $match: { role: "user", active: true } },
          { $count: "count" },
        ],
        totalServiceProviders: [
          { $match: { role: "service-provider" } },
          { $count: "count" },
        ],
        activeServiceProviders: [
          { $match: { role: "service-provider", active: true } },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        totalUsers: { $arrayElemAt: ["$totalUsers.count", 0] },
        activeUsers: { $arrayElemAt: ["$activeUsers.count", 0] },
        totalServiceProviders: {
          $arrayElemAt: ["$totalServiceProviders.count", 0],
        },
        activeServiceProviders: {
          $arrayElemAt: ["$activeServiceProviders.count", 0],
        },
      },
    },
  ]);

  const servicesAggregation = Service.aggregate([
    {
      $facet: {
        totalServices: [{ $count: "count" }],
        activeServices: [{ $match: { status: "active" } }, { $count: "count" }],
        inactiveServices: [
          { $match: { status: "inActive" } },
          { $count: "count" },
        ],
        totalSubServices: [{ $unwind: "$subServices" }, { $count: "count" }],
      },
    },
    {
      $project: {
        totalServices: { $arrayElemAt: ["$totalServices.count", 0] },
        activeServices: { $arrayElemAt: ["$activeServices.count", 0] },
        inactiveServices: { $arrayElemAt: ["$inactiveServices.count", 0] },
        totalSubServices: { $arrayElemAt: ["$totalSubServices.count", 0] },
      },
    },
  ]);

  // Combining all booking related aggregations into one pipeline
  const bookingsAggregation = Booking.aggregate([
    {
      $facet: {
        totalBookings: [{ $count: "count" }],
        canceledBookings: [
          { $match: { canceledByCustomer: { $ne: "" } } },
          { $count: "count" },
        ],
        pendingBookings: [
          { $match: { acceptedByServiceProvider: false, completed: false } },
          { $count: "count" },
        ],
        onGoingBookings: [
          { $match: { acceptedByServiceProvider: true, completed: false } },
          { $count: "count" },
        ],
        completedBookings: [
          { $match: { completed: true } },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        totalBookings: { $arrayElemAt: ["$totalBookings.count", 0] },
        canceledBookings: { $arrayElemAt: ["$canceledBookings.count", 0] },
        pendingBookings: { $arrayElemAt: ["$pendingBookings.count", 0] },
        onGoingBookings: { $arrayElemAt: ["$onGoingBookings.count", 0] },
        completedBookings: { $arrayElemAt: ["$completedBookings.count", 0] },
      },
    },
  ]);

  // Execute all aggregations in parallel
  const [userStats, serviceStats, bookingStats] = await Promise.all([
    usersAggregation,
    servicesAggregation,
    bookingsAggregation,
  ]);

  const data = {
    totalServices: serviceStats[0].totalServices || 0,
    activeServices: serviceStats[0].activeServices || 0,
    inactiveServices: serviceStats[0].inactiveServices || 0,
    totalSubServices: serviceStats[0].totalSubServices || 0,
    totalUsers: userStats[0].totalUsers || 0,
    activeUsers: userStats[0].activeUsers || 0,
    totalServiceProviders: userStats[0].totalServiceProviders || 0,
    activeServiceProviders: userStats[0].activeServiceProviders || 0,
    totalBookings: bookingStats[0].totalBookings || 0,
    canceledBookings: bookingStats[0].canceledBookings || 0,
    pendingBookings: bookingStats[0].pendingBookings || 0,
    onGoingBookings: bookingStats[0].onGoingBookings || 0,
    completedBookings: bookingStats[0].completedBookings || 0,
  };

  return NextResponse.json(data, { status: 201 });
}
