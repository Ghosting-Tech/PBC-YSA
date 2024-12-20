"use client";
import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import BackButton from "../../BackButton";
import { LeaveServiceDialog } from "./LeaveServiceDialog";

const BookingHeader = ({ booking }) => {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const handleDownload = () => {
    window.print();
  };

  const user = useSelector((state) => state.user.user);

  const handleLeave = () => {
    console.log("Leave service request submitted");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <div className="flex gap-3">
        <BackButton />
        <h2 className="text-xl font-semibold">
          Booking ID: {booking.bookingId}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        {user.role === "service-provider" &&
          booking.acceptedByServiceProvider && (
            <Button
              color="red"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setIsLeaveDialogOpen(true)}
            >
              Abandon
            </Button>
          )}
        <div
          className={`text-xs px-4 py-2 rounded-full ${
            booking.status === "Request sended to service provider!"
              ? "bg-orange-500 text-white"
              : booking.status === "Service provider has been reached!"
              ? "bg-lime-600 text-white"
              : booking.status === "Payment failed!"
              ? "bg-red-500 text-white"
              : booking.status === "Invoice Paid!"
              ? "bg-green-500 text-white"
              : booking.completed && "bg-teal-500 text-white"
          }`}
        >
          {booking.status == "Request sended to service provider!" &&
          user.role !== "user"
            ? "New Booking request"
            : booking.status}
        </div>
        <Button color="blue" size="sm" onClick={handleDownload}>
          Print This page
        </Button>
      </div>
      <LeaveServiceDialog
        isOpen={isLeaveDialogOpen}
        onClose={() => setIsLeaveDialogOpen(false)}
        onLeave={handleLeave}
      />
    </div>
  );
};

export default BookingHeader;
