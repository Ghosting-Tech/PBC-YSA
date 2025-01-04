import formatDate from "@/utils/formatDate";
import sendSmsMessage from "@/utils/sendSmsMessage";
import shortUrl from "@/utils/shortUrl";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const UpdateServiceStatus = ({ selectedNewBooking, setSelectedNewBooking }) => {
  const [completeOtp, setCompleteOtp] = useState(["", "", "", ""]);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChangeCompleteOtp = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...completeOtp];
    newOtp[index] = element.value;
    setCompleteOtp(newOtp);

    // Move to the next input box if the current one is filled
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDownCompleteOtp = (e, index) => {
    if (e.key === "Backspace") {
      if (!completeOtp[index] && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
  }

  const handleGeneratingCompleteOtp = async () => {
    if (selectedNewBooking.completed) {
      toast.error("Service already completed!");
      return;
    }
    if (
      selectedNewBooking.invoices.invoiceAccepted &&
      !selectedNewBooking.invoices.transactionId
    ) {
      toast.error("Invoice accepted but payment is not made!");
      return;
    }
    if (!selectedNewBooking.paymentStatus.paid_full) {
      setIsDialogOpen(true);
    } else {
      const name = selectedNewBooking.fullname;
      const mobile = selectedNewBooking.phoneNumber;
      const otp = generateOTP();

      const message = `Hi ${name}, your service completion OTP is ${otp}. Please share this with your service provider only after you're satisfied with the work. Thank you! - GHOSTING WEBTECH PRIVATE LIMITED`;

      await sendSmsMessage(mobile, message, "1707172966680843543");

      const updatedBooking = {
        ...selectedNewBooking,
        serviceCompletedOtp: otp,
      };
      setSelectedNewBooking(updatedBooking);

      await axios.put(
        `/api/bookings/${selectedNewBooking._id}`,
        updatedBooking
      );
      toast.success("OTP sent successfully!");
      // Disable the OTP button and start the timer
      setIsOtpButtonDisabled(true);
      setTimer(30);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsOtpButtonDisabled(false);
    }
  }, [timer]);

  const handleUpdateServiceStatusByServiceProvider = async () => {
    try {
      if (completeOtp.join("") !== selectedNewBooking.serviceCompletedOtp) {
        toast.error("Invalid OTP!");
        return;
      }

      const updatedStatusBooking = {
        ...selectedNewBooking,
        status: "Service is Completed",
        completed: true,
      };

      setSelectedNewBooking(updatedStatusBooking);

      const res = await axios.put(
        `/api/bookings/${selectedNewBooking._id}`,
        updatedStatusBooking
      );

      if (res.status !== 201) {
        toast.error("Failed to update the status!");
        return;
      }

      const total_amount = (
        selectedNewBooking.cartItems.reduce(
          (acc, product) =>
            acc + (product.price || 0) * (product.quantity || 0),
          0
        ) +
        (18 + Number(selectedNewBooking.invoices?.total || 0))
      ).toFixed(2);

      // Percentage for the amount
      const percentage = 80;

      // Calculate the amount based on the percentage
      const amount = (total_amount * (percentage / 100)).toFixed(2);

      // Send payment request with the calculated amount
      const paymentResponse = await axios.post(`/api/payment`, {
        service_provider: selectedNewBooking.assignedServiceProviders._id,
        bookingId: selectedNewBooking._id,
        total_amount,
        amount,
        booking: selectedNewBooking._id,
      });
      if (!paymentResponse.data.success) {
        toast.error(paymentResponse.data.message);
        return;
      }
      toast.success(paymentResponse.data.message);

      const serviceUrl = `https://demo.yourserviceapp.in/services/${selectedNewBooking.cartItems[0].serviceId}`;
      const urlResponse = await axios.post("/api/short-url", {
        url: serviceUrl,
      });

      const cleanUrl = urlResponse.data.url;

      const message = `Dear ${selectedNewBooking.fullname}, Your booking has been successfully completed by ${selectedNewBooking.assignedServiceProviders.name}. We hope you're satisfied! Please rate your experience here: ${cleanUrl} . -- GHOSTING WEBTECH PRIVATE LIMITED`;

      await sendSmsMessage(
        selectedNewBooking.phoneNumber,
        message,
        "1707172966935296028"
      );

      const currentDateTime = formatDate();

      const serviceProviderMessage = `Hi ${selectedNewBooking.assignedServiceProviders.name}, Thank you for completing the service for ${selectedNewBooking.fullname} on ${currentDateTime}. Please log in and update your dashboard. - GHOSTING WEBTECH PRIVATE LIMITED`;

      await sendSmsMessage(
        selectedNewBooking.assignedServiceProviders.phoneNumber,
        serviceProviderMessage,
        "1707172967160148280"
      );

      // handle sending notification to user after completing the service
      axios.post(`/api/send-notification/by-user-phone`, {
        phoneNumber: selectedNewBooking.phoneNumber,
        title: "Your service has been completed!",
        message: "See details.",
        link: `user/bookings/${selectedNewBooking._id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!selectedNewBooking.completed && (
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-4">
          <div className="md:text-xl sm:text-xl text-lg text-gray-500 font-normal flex justify-center gap-2">
            Complete the Service
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            <div className="flex items-center justify-center gap-4">
              {completeOtp.map((data, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={data}
                    onChange={(e) => handleChangeCompleteOtp(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDownCompleteOtp(e, index)}
                  />
                );
              })}
            </div>
            <Button
              size="sm"
              variant="text"
              color="purple-gray"
              className="underline"
              onClick={handleGeneratingCompleteOtp}
              disabled={isOtpButtonDisabled}
            >
              {isOtpButtonDisabled ? `Resend OTP in ${timer} s` : "Send OTP"}
            </Button>
          </div>

          <Button
            color="purple"
            variant="gradient"
            onClick={handleUpdateServiceStatusByServiceProvider}
          >
            Service Completed
          </Button>
        </div>
      )}
      <Dialog
        open={isDialogOpen}
        handler={setIsDialogOpen}
        size="xs"
        className="max-w-[500px]"
      >
        <DialogHeader className="flex flex-col items-center space-y-2 pb-0">
          <div className="bg-purple-50 rounded-full p-4 mb-2">
            <CreditCardIcon className="h-12 w-12 text-purple-500" />
          </div>
          <Typography variant="h4" color="purple-gray" className="text-center">
            Complete Payment
          </Typography>
        </DialogHeader>

        <DialogBody className="text-center space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <Typography
              variant="paragraph"
              color="purple-gray"
              className="font-medium"
            >
              {selectedNewBooking.fullname}
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              booking payment is pending.
            </Typography>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <Typography variant="h5" color="red" className="font-bold">
              Remaining Amount
            </Typography>
            <Typography variant="h4" color="red" className="font-bold mt-1">
              ₹{" "}
              {selectedNewBooking.paymentStatus.remaining_amount.toLocaleString()}
            </Typography>
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-center pt-0">
          <Button
            variant="outlined"
            color="gray"
            onClick={() => setIsDialogOpen(false)}
            className="flex items-center"
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default UpdateServiceStatus;
