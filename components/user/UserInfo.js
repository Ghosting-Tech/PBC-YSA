"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  FaMapMarkerAlt,
  FaVenusMars,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";

const UserInfo = ({ user }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const infoItems = [
    { icon: PhoneIcon, label: "Phone Number", value: user?.phoneNumber },
    { icon: EnvelopeIcon, label: "Email", value: user?.email },
    { icon: FaMapMarkerAlt, label: "Location", value: user?.city },
    { icon: FaVenusMars, label: "Gender", value: user?.gender },
    {
      icon: FaCalendarAlt,
      label: "Joined",
      value: formatDate(user?.createdAt),
    },
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            User Information
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="rounded-full bg-blue-50 p-2">
                  <item.icon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {item.label}
                  </Typography>
                  <Typography color="gray">{item.value}</Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default UserInfo;
