import {
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { IoMdMailOpen, IoMdOpen } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { PiGenderIntersexFill } from "react-icons/pi";
import CancelBookingDialog from "./CancelBookingDialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import BookingDetails from "@/components/admin/bookings/single-booking/BookingDetails";
import InvoiceDetail from "@/components/admin/bookings/single-booking/InvoiceDetail";
import ShowPricing from "@/components/ShowPricing";
import ServiceDetails from "@/components/admin/bookings/single-booking/ServiceDetails";
import UserServiceProviderDetail from "@/components/admin/bookings/single-booking/UserServiceProviderDetail";
import BookingHeader from "@/components/admin/bookings/single-booking/BookingHeader";
import LocationDetails from "@/components/admin/bookings/single-booking/LocationDetails";
import ContactQuery from "../ContactQuery";
import Review from "@/components/services/review/Review";
import BookAgain from "./BookAgain";

const OnGoingBooking = ({
  booking,
  disableCancelBookingButton,
  handleCancellationReasonDialog,
  cancellationReasonDialog,
  handleInvoiceDialog,
  redirectingLoading,
  handleInvoicePayment,
  cancelled,
}) => {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const amount = (
    booking.cartItems.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    ) + 18
  ).toFixed(2);

  const handlePayment = async () => {
    try {
      const initiatePayment = await axios.post(
        `/api/payments/initiate-payment`,
        {
          bookingId: booking._id,
          amount,
          userId: user._id,
          userPhoneNumber: booking.phoneNumber,
          invoice: false,
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
      console.error("Invoice payment error");
      toast.error("Error on initializing payment!");
    }
  };

  // Review
  const [rating, setRating] = useState(0);
  const [service, setService] = useState({});

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (booking.completed) {
          const response = await fetch(
            `/api/services/${booking.cartItems[0].serviceId}`
          );
          const data = await response.json();
          console.log(data.service);
          if (!data.success) {
            toast.error(data.message);
            return;
          }
          setService(data.service);
        }
      } catch (error) {
        toast.error(`Error fetching service!`);
        console.log("Error fetching service:", error);
      }
    };
    fetchService();
  }, [booking]);
  return (
    <div key={booking._id} className="p-6 max-w-5xl mx-auto">
      <BookingHeader booking={booking} />
      <ServiceDetails booking={booking} />
      <BookingDetails booking={booking} />
      {booking.invoices?.title && (
        <>
          <InvoiceDetail booking={booking} forUser={true} />
          {booking.invoices?.status === "Invoice Accepted" &&
            !booking.invoices.paid && (
              <Button
                variant="gradient"
                color="teal"
                className="mb-6 w-full flex justify-center"
                loading={redirectingLoading}
                onClick={handleInvoicePayment}
              >
                Pay ₹{booking.invoices.total}
              </Button>
            )}
        </>
      )}
      <UserServiceProviderDetail booking={booking} forUser={true} />
      <LocationDetails booking={booking} />
      <div className="flex items-center justify-between">
        <ContactQuery booking={booking} />
        {booking.canceledByCustomer && (
          <Link href={`/support/refund/${booking._id}`}>
            <Button variant="outlined" color="red">
              Get Refund
            </Button>
          </Link>
        )}
      </div>
      {booking.completed && service._id && (
        <Review
          service={service}
          serviceId={service._id}
          rating={rating}
          setRating={setRating}
          setService={setService}
        />
      )}
      {!booking.completed && (
        <section className="w-full mt-4 flex justify-between items-center flex-col lg:flex-row gap-4">
          {!booking.canceledByCustomer && (
            <p className="font-medium text-red-600 text-sm">
              Note: Your booking has been cancelled by the service provider.
            </p>
          )}
          <div className="flex items-center justify-end gap-2 w-fit whitespace-nowrap">
            {!cancelled && !booking.otpVerified && (
              <Button
                variant="outlined"
                color="red"
                disabled={disableCancelBookingButton}
                onClick={handleCancellationReasonDialog}
              >
                Cancel Booking
              </Button>
            )}

            <CancelBookingDialog
              booking={booking}
              cancellationReasonDialog={cancellationReasonDialog}
              handleCancellationReasonDialog={handleCancellationReasonDialog}
            />
            {booking.transactionId == undefined && (
              <Button
                variant="gradient"
                color="teal"
                className="rounded"
                onClick={handlePayment}
              >
                Pay {amount}
              </Button>
            )}
            {booking.invoices?.title && (
              <div className="flex gap-2">
                <Button
                  variant="gradient"
                  color="purple"
                  className="rounded"
                  onClick={handleInvoiceDialog}
                >
                  View invoice
                </Button>
                {booking.invoices?.status === "Invoice Accepted" &&
                  !booking.invoices.paid && (
                    <Button
                      variant="gradient"
                      color="teal"
                      className="rounded"
                      loading={redirectingLoading}
                      onClick={handleInvoicePayment}
                    >
                      Pay ₹{booking.invoices.total}
                    </Button>
                  )}
              </div>
            )}
          </div>
        </section>
      )}
      {/* Book again */}
      <BookAgain booking={booking} />
    </div>
  );
};

export default OnGoingBooking;
