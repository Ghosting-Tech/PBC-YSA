import React from "react";
import Image from "next/image";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

export function CheckoutSummary({ cartItems }) {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const convenienceFee = 18;
  const total = subtotal + convenienceFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
      <div className="h-px w-full bg-gray-300 my-4"></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Typography variant="small" color="gray">
            Subtotal
          </Typography>
          <Typography variant="small" color="blue-gray">
            ₹{subtotal.toFixed(2)}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="small" color="gray">
            Convenience Fee
          </Typography>
          <Typography variant="small" color="blue-gray">
            ₹{convenienceFee.toFixed(2)}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="h6" color="blue-gray">
            Total
          </Typography>
          <Typography variant="h6" color="teal">
            ₹{total.toFixed(2)}
          </Typography>
        </div>
      </div>
    </motion.div>
  );
}
