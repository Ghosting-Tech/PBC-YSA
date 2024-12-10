"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FaShoppingCart, FaComments } from "react-icons/fa";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

const UserStats = ({ user }) => {
  const stats = [
    {
      icon: CalendarDaysIcon,
      label: "Orders",
      value: user?.bookings.length || 0,
    },
    { icon: FaComments, label: "Reviews", value: user?.reviews.length || 0 },
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="rounded-full flex gap-1 items-center bg-blue-50 px-3 py-1">
              <stat.icon className="h-6 w-6 text-blue-500" />

              <Typography variant="paragraph" color="blue-gray">
                {stat.value}
              </Typography>
              <Typography variant="small" color="gray">
                {stat.label}
              </Typography>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserStats;
