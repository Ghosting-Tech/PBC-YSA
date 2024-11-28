import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { FaHeadset, FaCalendarPlus } from "react-icons/fa";
import BookingHeader from "@/components/admin/bookings/single-booking/BookingHeader";
import ServiceDetails from "@/components/admin/bookings/single-booking/ServiceDetails";
import BookingDetails from "@/components/admin/bookings/single-booking/BookingDetails";
import UserServiceProviderDetail from "@/components/admin/bookings/single-booking/UserServiceProviderDetail";
import LocationDetails from "@/components/admin/bookings/single-booking/LocationDetails";

const ExpiredBooking = ({ booking }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BookingHeader booking={booking} />

      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <Typography variant="h6" color="red" className="mb-2">
          Booking Expired
        </Typography>
        <Typography color="red" className="text-sm">
          This booking has expired. You can contact support for any queries or
          book a new service.
        </Typography>
      </div>

      <ServiceDetails booking={booking} />
      <BookingDetails booking={booking} />
      <UserServiceProviderDetail booking={booking} forUser={true} />
      <LocationDetails booking={booking} />

      <section className="w-full mt-8 flex justify-end items-center gap-4 flex-col sm:flex-row">
        <Link href="/support" passHref className="no-underline">
          <Button
            variant="outlined"
            color="blue"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FaHeadset className="text-lg" />
            Contact Support
          </Button>
        </Link>
        <Link href="/services" passHref className="no-underline">
          <Button
            variant="gradient"
            color="teal"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FaCalendarPlus className="text-lg" />
            Book New Service
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default ExpiredBooking;
