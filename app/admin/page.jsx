"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import HorizontalBarChart from "@/components/admin/dashboard/HorizontalBarChart";
import PieChart from "@/components/admin/dashboard/PieChart";
import BookingChart from "@/components/admin/dashboard/BookingChart";
import MostBookedServicesChart from "@/components/admin/dashboard/MostBookedServicesChart";

const Admin = () => {
  const [data, setData] = useState({
    totalServices: 0,
    inactiveServices: 0,
    activeServices: 0,
    totalSubServices: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalServiceProviders: 0,
    activeServiceProviders: 0,
    totalBookings: 0,
    canceledBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    onGoingBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [mostBookedServices, setMostBookedServices] = useState([]);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const response = await fetch("/api/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setData(data);
      setDashboardLoading(false);

      const bookingsResponse = await fetch("/api/admin/dashboard/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const bookingsData = await bookingsResponse.json();
      setBookings(bookingsData.bookings);
      setBookingsLoading(false);

      const mostBookedServicesResponse = await fetch(
        "/api/admin/dashboard/most-booked-services"
      );
      const mostBookedServicesData = await mostBookedServicesResponse.json();
      setMostBookedServices(mostBookedServicesData);
      setServicesLoading(false);
    } catch {
      console.error("Failed to get dashboard data");
    } finally {
      setDashboardLoading(false);
      setBookingsLoading(false);
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="w-full flex flex-col h-full items-start gap-6 px-8 my-4">
      <DashboardCard data={data} loading={dashboardLoading} />
      <div className="w-full flex flex-col md:flex-row gap-6">
        <MostBookedServicesChart
          data={mostBookedServices}
          loading={servicesLoading}
        />
        <BookingChart
          bookingData={bookings}
          bookingCount={data.totalBookings}
          loading={bookingsLoading}
        />
      </div>
    </div>
  );
};

export default Admin;
