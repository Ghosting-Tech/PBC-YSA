"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export function CheckoutSummary({ cartItems }) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const convenienceFee = 18;
  const total = subtotal + convenienceFee;

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Order Summary
      </Typography>
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <motion.div
            key={item._id}
            {...slideIn}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div className="w-20 h-20 relative mr-4">
              <Image
                src={item?.icon?.url}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                {item.name}
              </Typography>
              <Typography variant="small" color="gray">
                Qty: {item.quantity}
              </Typography>
              <Typography
                variant="small"
                color="teal"
                className="font-semibold"
              >
                ₹{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="h-px w-full bg-gray-300 my-4" />
      <div className="space-y-2">
        <PriceRow label="Subtotal" value={subtotal} />
        <PriceRow label="Convenience Fee" value={convenienceFee} />
        <PriceRow label="Total" value={total} isTotal />
      </div>
    </motion.div>
  );
}

const PriceRow = ({ label, value, isTotal = false }) => (
  <div className="flex justify-between">
    <Typography
      variant={isTotal ? "h6" : "small"}
      color={isTotal ? "blue-gray" : "gray"}
    >
      {label}
    </Typography>
    <Typography
      variant={isTotal ? "h6" : "small"}
      color={isTotal ? "teal" : "blue-gray"}
    >
      ₹{value.toFixed(2)}
    </Typography>
  </div>
);
