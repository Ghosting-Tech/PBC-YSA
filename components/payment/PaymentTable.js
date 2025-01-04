"use client";
import { Avatar, Button, IconButton } from "@material-tailwind/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import formatDate from "@/utils/formatDate";
import Link from "next/link";
import PaymentDialog from "./PaymentDialog";
import { useState } from "react";
import PaymentTimelineDialog from "./PaymentTimelineDialog";

export default function PaymentTable({
  serviceProvider = false,
  payments,
  updatePayment,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [actionType, setActionType] = useState("");
  const [selectedPaymentData, setSelectedPaymentData] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const handleView = (payment) => {
    setSelectedPaymentData(payment);
    setStatusDialogOpen(true);
  };

  const handleOpenDialog = (payment, action) => {
    setSelectedPayment(payment);
    setActionType(action);
    setDialogOpen(true);
  };
  const handleConfirm = async (data) => {
    const updatedPayment = {
      ...selectedPayment,
      paid: actionType === "Paid",
      screenshot: data.screenshot || null,
      reason: data.reason || "",
      timestamp: data.timestamp || null,
    };
    updatePayment(updatedPayment);
  };
  return (
    <div className="overflow-x-auto p-4 shadow-lg bg-white rounded-lg">
      <div className="min-w-full text-left text-sm">
        <div className="bg-purple-50 hidden md:flex rounded-lg">
          <div className="p-4 font-semibold text-purple-700 w-1/5">
            Service Provider
          </div>
          <div className="p-4 font-semibold text-purple-700 w-1/6 text-center">
            Date
          </div>
          <div className="p-4 font-semibold text-purple-700 w-1/6 text-center">
            Status
          </div>
          <div className="p-4 font-semibold text-purple-700 w-1/6 text-center">
            Total Amount
          </div>
          <div className="p-4 font-semibold text-purple-700 w-1/6 text-center">
            Pay Amount
          </div>
          <div className="p-4 font-semibold text-purple-700 w-1/6 text-center">
            Pay History
          </div>
          <div className="p-4 font-semibold text-purple-700 w-1/6 text-center">
            Action
          </div>
        </div>

        {payments.map((payment, index) => (
          <div
            key={payment._id}
            className={`flex flex-col md:flex-row bg-white ${
              index === payments.length - 1 ? "" : "border-b border-gray-300"
            }`}
          >
            <div className="p-4 w-full md:w-1/4 flex items-center gap-2">
              <span className="font-semibold md:hidden">Booked By: </span>
              {payment.service_provider.image?.url ? (
                <Avatar src={payment.service_provider.image.url} size="sm" />
              ) : (
                <div className="w-10 h-10 text-xl text-black rounded-full flex justify-center items-center font-junge bg-gray-400">
                  {payment.service_provider?.name[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-sm">
                  {payment.service_provider.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {payment.service_provider.phoneNumber}
                </p>
              </div>
            </div>

            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Date: </span>
              <span className="truncate text-xs">
                {formatDate(payment.createdAt)}
              </span>
            </div>

            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Status: </span>
              <span
                className={`flex justify-center items-center px-2 py-1 text-xs font-medium rounded-full w-20 ${
                  payment.paid
                    ? "bg-teal-100 text-teal-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {payment.paid ? "Paid" : "Not Paid"}
              </span>
            </div>

            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center font-semibold text-gray-600">
              <span className="md:hidden">Total Amount: </span>
              <span className="truncate text-xs">₹{payment.total_amount}</span>
            </div>

            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center font-semibold text-teal-500">
              <span className="md:hidden">Pay Amount: </span>₹{payment?.amount}
            </div>
            {/* Pay History */}
            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Pay History: </span>
              <Button
                variant="outlined"
                color="purple"
                size="sm"
                onClick={() => handleView(payment)}
              >
                View
              </Button>
            </div>

            {/* Action */}
            <div className="p-4 w-full md:w-1/6 flex items-center justify-between md:justify-center">
              <span className="font-semibold md:hidden">Action: </span>
              <div className="flex justify-center gap-2 items-center">
                {!serviceProvider && (
                  <Button
                    className="w-20"
                    variant="gradient"
                    color="purple"
                    size="sm"
                    onClick={() =>
                      handleOpenDialog(
                        payment,
                        payment.paid ? "Not Paid" : "Paid"
                      )
                    }
                  >
                    {payment.paid ? "Unpaid" : "Paid"}
                  </Button>
                )}
                {serviceProvider ? (
                  <Link href={`/service-provider/booking/${payment.booking}`}>
                    <IconButton variant="text" color="purple-gray">
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    </IconButton>
                  </Link>
                ) : (
                  <Link href={`/admin/bookings/${payment.booking}`}>
                    <IconButton variant="text" color="purple-gray">
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    </IconButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <PaymentDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
        actionType={actionType}
      />
      <PaymentTimelineDialog
        paymentData={selectedPaymentData}
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      />
    </div>
  );
}
