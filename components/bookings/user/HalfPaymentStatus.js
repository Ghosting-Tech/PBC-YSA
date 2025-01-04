import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  ReceiptText,
  CreditCard,
} from "lucide-react";

const HalfPaymentStatus = ({ payment, isOpen, setIsOpen }) => {
  const formatTimestamp = (timestamp) => {
    // Ensure timestamp is a number
    const numTimestamp = Number(timestamp);

    // Check if timestamp is valid
    if (isNaN(numTimestamp)) {
      return "Invalid Date";
    }

    // Create Date object from timestamp
    const date = new Date(numTimestamp);

    // Comprehensive date and time formatting
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div>
      <Dialog open={isOpen}>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
          <div className="relative w-full max-w-md max-h-full p-4">
            <div className="relative bg-white rounded-lg shadow-xl">
              {/* Dialog Header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" />
                  Payment Details
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                >
                  ✕
                </button>
              </div>

              {/* Dialog Content */}
              <div className="p-6 space-y-4">
                {/* Amount */}
                <div className="flex items-center gap-3">
                  <DollarSign className="text-green-600" />
                  <div>
                    <p className="font-semibold">Amount Paid</p>
                    <p className="text-gray-600">
                      ${payment.paymentStatus.remaining_amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="flex items-center gap-3">
                  <ReceiptText className="text-purple-600" />
                  <div>
                    <p className="font-semibold">Transaction ID</p>
                    <p className="text-gray-600">
                      {payment.halfPaymentTransactionId}
                    </p>
                  </div>
                </div>

                {/* Payment Time */}
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-600" />
                  <div>
                    <p className="font-semibold">Payment Time</p>
                    <p className="text-gray-600">
                      {formatTimestamp(payment.halfPaymentTime)}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-teal-600" />
                  <div>
                    <p className="font-semibold">Payment Status</p>
                    <p className="text-gray-600 capitalize">Paid</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-3">
                  <CreditCard className="text-indigo-600" />
                  <div>
                    <p className="font-semibold">Payment Method</p>
                    <p className="text-gray-600 capitalize">Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HalfPaymentStatus;
