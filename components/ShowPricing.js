import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import {
  CreditCardIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IoOpenOutline } from "react-icons/io5";
import HalfPaymentStatus from "./bookings/user/HalfPaymentStatus";

const ShowPricing = ({ cartItems, paymentStatus, booking }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  // Prevent negative or NaN values
  const subtotal = Math.max(paymentStatus?.total_amount - 18, 0);
  const convenienceFee = 18;
  const totalAmount = paymentStatus?.total_amount;
  const paidAmount = paymentStatus?.paid_amount;
  const remainingAmount = paymentStatus?.remaining_amount;

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmPayment = async () => {
    try {
      const initiatePayment = await axios.post(
        `/api/payments/initiate-payment`,
        {
          bookingId: booking._id,
          amount: remainingAmount,
          userId: user._id,
          userPhoneNumber: booking.phoneNumber,
          invoice: false,
          remainingAmount: true,
        }
      );
      if (initiatePayment.data.success) {
        handleCloseDialog();
        const phonePeRedirectUrl =
          initiatePayment.data.data.instrumentResponse.redirectInfo.url;
        router.push(phonePeRedirectUrl);
      } else {
        toast.error(initiatePayment.data);
      }
    } catch (err) {
      console.error("Invoice Remaining Amount error");
      toast.error("Error on initializing payment!");
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Pricing Breakdown */}
      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* Convenience Fee */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="text-gray-600">Convenience Fee</span>
          <span className="font-semibold">₹{convenienceFee.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold text-blue-600">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Paid Amount */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-600">Paid Amount</span>
          <span className="text-lg font-bold text-green-500">
            ₹{paidAmount.toFixed(2)}
          </span>
        </div>

        {/* Remaining Amount */}
        <div className="flex justify-between items-center pb-4">
          <span className="text-lg font-bold text-gray-500">
            Remaining Amount
          </span>
          <div className="flex gap-1">
            <span className="text-lg font-bold text-red-500">
              ₹{remainingAmount.toFixed(2)}
            </span>
            {paymentStatus.paid_full && (
              <span
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${"bg-green-100 text-green-600 cursor-pointer"}`}
              >
                Paid
                <IoOpenOutline />
              </span>
            )}
          </div>
        </div>

        {/* Payment Button (Only show if remaining amount > 0) */}
        {!paymentStatus.paid_full && user.role === "user" && (
          <div className="mt-6">
            <Button
              variant="gradient"
              color="green"
              fullWidth
              onClick={handleOpenDialog}
              className="flex items-center justify-center"
            >
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Pay Remaining Amount
            </Button>
          </div>
        )}
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        handler={handleCloseDialog}
        size="sm"
        className="max-w-[400px]"
      >
        <DialogHeader className="flex flex-col items-center space-y-2">
          <div className="bg-green-50 rounded-full p-4 mb-2">
            <CreditCardIcon className="h-12 w-12 text-green-500" />
          </div>
          <Typography variant="h4" color="blue-gray" className="text-center">
            Confirm Payment
          </Typography>
        </DialogHeader>

        <DialogBody className="text-center space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="font-medium"
            >
              Payment Confirmation
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              Are you sure you want to proceed with the payment?
            </Typography>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <Typography variant="h5" color="red" className="font-bold">
              Remaining Amount
            </Typography>
            <Typography variant="h4" color="red" className="font-bold mt-1">
              ₹{remainingAmount.toFixed(2)}
            </Typography>
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-between gap-3">
          <Button
            variant="outlined"
            color="gray"
            onClick={handleCloseDialog}
            className="flex items-center"
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5 mr-2" />
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleConfirmPayment}
            className="flex items-center"
          >
            <CheckIcon strokeWidth={2} className="h-5 w-5 mr-2" />
            Confirm Payment
          </Button>
        </DialogFooter>
      </Dialog>
      <HalfPaymentStatus
        payment={booking}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default ShowPricing;
