import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Typography, Button } from "@material-tailwind/react";
import { motion } from "framer-motion";

export function CheckoutSummary({ cartItems, onPaymentMethodSelect }) {
  const [paymentMethod, setPaymentMethod] = useState("full");

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const convenienceFee = 18;
  const total = subtotal + convenienceFee;

  // Calculate half payment amount
  const halfPaymentAmount = total / 2;

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);

    // Prepare payment details for parent component
    const paymentDetails = {
      method,
      totalAmount: total,
      paidAmount: method === "full" ? total : halfPaymentAmount,
      convenienceFee,
      subtotal,
    };

    // Notify parent component about payment method selection
    onPaymentMethodSelect(paymentDetails);
  };

  // Trigger initial payment method selection on component mount
  useEffect(() => {
    handlePaymentMethodChange("full");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <Typography variant="h4" color="purple-gray" className="mb-4">
        Order Summary
      </Typography>

      {/* Payment Method Selection */}
      <div className="flex justify-between mb-4">
        <Button
          variant={paymentMethod === "full" ? "filled" : "outlined"}
          color="teal"
          onClick={() => handlePaymentMethodChange("full")}
          className="mr-2"
        >
          Full Payment
        </Button>
        <Button
          variant={paymentMethod === "half" ? "filled" : "outlined"}
          color="teal"
          onClick={() => handlePaymentMethodChange("half")}
        >
          Half Payment
        </Button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <Image
              src={item?.icon?.url}
              alt={item.name}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg mr-4"
            />
            <div>
              <Typography variant="h6" color="purple-gray">
                {item.name}
              </Typography>
              <Typography variant="small" color="gray">
                Qty: {item.quantity}
              </Typography>
              <Typography
                variant="small"
                className="font-semibold text-[var(--color)]"
              >
                ₹{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="h-px w-full bg-gray-300 my-4"></div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Typography variant="small" color="gray">
            Subtotal
          </Typography>
          <Typography variant="small" color="purple-gray">
            ₹{subtotal.toFixed(2)}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="small" color="gray">
            Convenience Fee
          </Typography>
          <Typography variant="small" color="purple-gray">
            ₹{convenienceFee.toFixed(2)}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="h6" color="purple-gray">
            Total
          </Typography>
          <Typography variant="h6" className="text-[var(--color)]">
            ₹{total.toFixed(2)}
          </Typography>
        </div>
        {paymentMethod === "half" && (
          <div className="flex justify-between mt-2">
            <Typography variant="small" color="gray">
              Half Payment Amount
            </Typography>
            <Typography variant="small" color="teal" className="font-bold">
              ₹{halfPaymentAmount.toFixed(2)}
            </Typography>
          </div>
        )}
      </div>
    </motion.div>
  );
}
