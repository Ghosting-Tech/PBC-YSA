"use client";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
import React from "react";
import RescheduleBooking from "./RescheduleBooking";
import { Typography } from "@material-tailwind/react";
import { Link } from "lucide-react";
import { IoMdOpen } from "react-icons/io";

const BookingDetails = ({ booking, forAdmin = false, setBooking }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Booking Information</h3>
        {forAdmin && (
          <RescheduleBooking booking={booking} setBooking={setBooking} />
        )}
      </div>
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500">Booking Date</p>
          <p className="text-lg font-semibold text-gray-700">{booking.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Booking Time</p>
          <p className="text-lg font-semibold text-gray-700">{booking.time}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500">Reaching OTP</p>
          <p className="text-lg font-semibold text-gray-700">{booking.otp}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-full font-medium text-sm ${
            booking.otpVerified
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {booking.otpVerified ? "Verified" : "Not Verified"}
        </span>
      </div>
      {booking.serviceCompletedOtp && (
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm text-gray-500">Completed OTP</p>
            <p className="text-lg font-semibold text-gray-700">
              {booking.serviceCompletedOtp}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              booking.status === "Service is Completed"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {booking.status === "Service is Completed"
              ? "Verified"
              : "Not Verified"}
          </span>
        </div>
      )}
      <div>
        <div className="text-lg font-semibold text-gray-700">
          Patient&apos;s Condition
        </div>
        <p className="text-sm text-gray-500">{booking.patientCondition}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            Service Verification Image
          </p>
          {booking.verificationImage?.url ? (
            <a
              href={
                booking.verificationImage?.url || "https://placehold.co/400"
              }
              className="no-underline"
              target="_blank"
            >
              <Button
                variant="outlined"
                size="sm"
                className="flex items-center gap-1"
              >
                View Image
                <IoMdOpen />
              </Button>
            </a>
          ) : (
            <p className="text-sm text-gray-500">No verification image</p>
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            Prescription Image
          </p>
          {booking.prescription?.url ? (
            <a
              href={booking.prescription?.url || "https://placehold.co/400"}
              target="_blank"
              className="no-underline"
            >
              <Button
                variant="outlined"
                size="sm"
                className="flex items-center gap-1"
              >
                View Image
                <IoMdOpen />
              </Button>
            </a>
          ) : (
            <p className="text-sm text-gray-500">No prescription image</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
