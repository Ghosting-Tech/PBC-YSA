"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Switch, Tooltip } from "@material-tailwind/react";
import { BriefcaseIcon, BeakerIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/slice/userSlice";

const DutyToggle = () => {
  const { user } = useSelector((state) => state.user);
  const [isOnline, setIsOnline] = useState(user?.available);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();

  const updateUserAvailability = useCallback(
    async (available) => {
      if (isUpdating) return;

      setIsUpdating(true);
      try {
        const response = await axios.post("/api/users/update", {
          ...user,
          available,
        });

        dispatch(setUser(response.data));
        toast.success("Availability updated successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update availability"
        );
        setIsOnline(!available); // Revert state on error
      } finally {
        setIsUpdating(false);
      }
    },
    [user, dispatch, isUpdating]
  );

  const handleToggle = useCallback(() => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    updateUserAvailability(newStatus);
  }, [isOnline, updateUserAvailability]);

  // Motion variants for reusability
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  };

  useEffect(() => {
    setIsOnline(user?.available);
  }, [user]);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50 p-4 backdrop-blur-md bg-white/30 rounded-full shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ rotate: isOnline ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            isOnline ? "bg-green-400" : "bg-gray-400"
          }`}
        >
          {isOnline ? (
            <Tooltip content="Available for work" className="bg-green-400">
              <BriefcaseIcon className="h-5 w-5 text-white" />
            </Tooltip>
          ) : (
            <Tooltip content="Not available" className="bg-red-500">
              <BeakerIcon className="h-5 w-5 text-white" />
            </Tooltip>
          )}
        </motion.div>
        <Switch
          checked={isOnline}
          onChange={handleToggle}
          color="green"
          label={
            <span className="sr-only">
              {isOnline ? "Available for work" : "Not available"}
            </span>
          }
          className="h-full w-full"
          containerProps={{
            className: "w-12 h-7",
          }}
          circleProps={{
            className: "before:hidden left-0.5 border-none w-5 h-5",
          }}
        />
      </div>
    </motion.div>
  );
};

export default React.memo(DutyToggle);
