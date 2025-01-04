"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, Button } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import UserStats from "./UserStats";

const UserHeader = ({ user, onEditClick }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center flex-col lg:flex-row gap-4">
        <Avatar
          size="xxl"
          src={
            user?.image?.url ||
            `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user?.name}`
          }
          alt={user?.name}
          className="border-4 border-purple-500 p-0.5"
        />
        <div className="flex flex-col gap-2">
          <div className="text-5xl text-purple-gray-700 font-bold">
            {user?.name}
          </div>
          <UserStats user={user} />
        </div>
      </div>
      <motion.div className="mt-4 md:mt-0">
        <Button
          onClick={onEditClick}
          className="flex items-center gap-2"
          color="purple"
          size="lg"
        >
          <FaEdit className="h-5 w-5" /> Edit Profile
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default UserHeader;
