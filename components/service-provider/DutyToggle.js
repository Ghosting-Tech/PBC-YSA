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

  useEffect(() => {
    setIsOnline(user?.available);
  }, [user]);

  return (
    <Switch
      checked={isOnline}
      onChange={handleToggle}
      color="green"
      label={isOnline ? "Available for work" : "Not available"}
      className="h-full w-full"
      containerProps={{
        className: "w-9 h-5",
      }}
      circleProps={{
        className: "before:hidden left-0.5 border-none w-4 h-4",
      }}
    />
  );
};

export default React.memo(DutyToggle);
