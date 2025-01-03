"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { VscLoading } from "react-icons/vsc";
import BookingLoader from "@/components/bookings/user/BookingLoader";
import OnGoingBooking from "@/components/bookings/user/OnGoingBooking";
import UserInvoiceDialog from "@/components/bookings/user/UserInvoiceDialog";
import ExpiredBooking from "@/components/bookings/user/ExpiredBooking";

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setBooking(data.booking);
      } catch (error) {
        toast.error(`Error fetching booking!`);
        console.log("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Invoice Code
  const router = useRouter();
  const [redirectingLoading, setRedirectingLoading] = useState(false);
  const handleInvoicePayment = async () => {
    try {
      setRedirectingLoading(true);
      const initiatePayment = await axios.post(
        `/api/payments/initiate-payment`,
        {
          bookingId: booking._id,
          amount: booking.invoices.total,
          userId: user._id,
          userPhoneNumber: booking.phoneNumber,
          invoice: true,
          remainingAmount: false,
        }
      );
      if (initiatePayment.data.success) {
        const phonePeRedirectUrl =
          initiatePayment.data.data.instrumentResponse.redirectInfo.url;
        router.push(phonePeRedirectUrl);
      } else {
        toast.error(initiatePayment.data);
      }
    } catch (err) {
      console.error("Invoice payment error", err);
      toast.error("Error on initializing payment!");
    } finally {
      setRedirectingLoading(false);
    }
  };
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const handleInvoiceDialog = () => setInvoiceDialogOpen((prev) => !prev);

  useEffect(() => {
    const openInvoiceDialog = () => {
      const invoiceStatus = booking?.invoices?.status;
      const invoiceTitle = booking?.invoices?.title;

      if (invoiceTitle && invoiceStatus == "Not Accepted Yet!") {
        setInvoiceDialogOpen(true);
      }
    };
    openInvoiceDialog();
  }, [booking]);

  //   Booking Cancellation [PLEASE DON'T TOUCH IT WITHOUT KNOWLEDGE]

  const [cancellationReasonDialog, setCancellationReasonDialog] =
    useState(false);
  const handleCancellationReasonDialog = () =>
    setCancellationReasonDialog(!cancellationReasonDialog);

  const [disableCancelBookingButton, setDisableCancelBookingButton] =
    useState(true);

  useEffect(() => {
    const updateBookingExpired = async (status) => {
      try {
        const response = await axios.put(`/api/bookings/${booking._id}`, {
          status: status,
          expired: true,
        });
        if (response.status === 201) {
          setBooking(response.data);
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error("Error updating booking status! to expired");
        console.log("Error updating booking status:", error);
      }
    };

    const checkBetweenTimeAndDate = () => {
      if (booking?.otpVerified) {
        setDisableCancelBookingButton(true);
        return;
      }
      if (booking?.expired) {
        setDisableCancelBookingButton(true);
        return;
      }
      const cancelValidationValueInMinutes = 120; // minutes

      const getCurrentDateTime = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}${month}${day}${hours}${minutes}`;
      };

      const getFormattedScheduleDateTime = () => {
        if (booking?.date && booking?.time) {
          const [day, month, year] = booking.date.split("-"); // e.g., 29-06-2024
          const [hours, minutes] = booking.time.split(":"); // e.g., 20:16
          return `${year}${month}${day}${hours}${minutes}`;
        }
        return null;
      };

      const currentDateTime = Number(getCurrentDateTime());
      const formattedScheduleDateTime = getFormattedScheduleDateTime();

      if (formattedScheduleDateTime) {
        const scheduleDateTime = Number(formattedScheduleDateTime);
        const cancellationValidationDateTime =
          scheduleDateTime - cancelValidationValueInMinutes;

        // console.log("booking time", formattedScheduleDateTime);
        // console.log("current time", currentDateTime);
        // console.log("cancellation time", cancellationValidationDateTime);

        if (currentDateTime < cancellationValidationDateTime) {
          setDisableCancelBookingButton(false);
        } else if (
          currentDateTime >= cancellationValidationDateTime &&
          currentDateTime < scheduleDateTime
        ) {
          setDisableCancelBookingButton(true);
        } else {
          // Update the booking status to expired
          updateBookingExpired("Booking Expired");
        }
      } else {
        // Handle the case where the booking date or time is not available
        console.error("Booking date or time is not available");
        setDisableCancelBookingButton(true);
      }
    };

    checkBetweenTimeAndDate();
  }, [booking]);

  return (
    <div>
      <UserInvoiceDialog
        booking={booking}
        handleInvoiceDialog={handleInvoiceDialog}
        invoiceDialogOpen={invoiceDialogOpen}
        setBooking={setBooking}
        redirectingLoading={redirectingLoading}
        handleInvoicePayment={handleInvoicePayment}
      />

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-lg font-semibold animate-spin my-56">
            <VscLoading size={50} />
          </div>
        </div>
      ) : booking.canceledByCustomer ? (
        <OnGoingBooking
          booking={booking}
          disableCancelBookingButton={disableCancelBookingButton}
          handleCancellationReasonDialog={handleCancellationReasonDialog}
          cancellationReasonDialog={cancellationReasonDialog}
          handleInvoiceDialog={handleInvoiceDialog}
          redirectingLoading={redirectingLoading}
          handleInvoicePayment={handleInvoicePayment}
          cancelled={true}
        />
      ) : booking?.acceptedByServiceProvider ? (
        <OnGoingBooking
          booking={booking}
          disableCancelBookingButton={disableCancelBookingButton}
          handleCancellationReasonDialog={handleCancellationReasonDialog}
          cancellationReasonDialog={cancellationReasonDialog}
          handleInvoiceDialog={handleInvoiceDialog}
          redirectingLoading={redirectingLoading}
          handleInvoicePayment={handleInvoicePayment}
          cancelled={false}
        />
      ) : booking?.expired ? (
        <ExpiredBooking booking={booking} />
      ) : (
        <BookingLoader
          booking={booking}
          disableCancelBookingButton={disableCancelBookingButton}
          cancellationReasonDialog={cancellationReasonDialog}
          handleCancellationReasonDialog={handleCancellationReasonDialog}
        />
      )}
    </div>
  );
};

export default Page;
