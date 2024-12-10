"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import UserHeader from "./UserHeader";
import UserInfo from "./UserInfo";
import EditProfileDialog from "./EditProfileDialog";
import ErrorBoundary from "./ErrorBoundary";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/check-authorization");
        if (!response.data.success) {
          toast.error(response.data.message);
          router.push("/login");
        } else {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleOpen = () => setOpen(!open);

  const handleUpdate = async (updatedUser) => {
    try {
      const response = await fetch("/api/users/update", {
        method: "POST",
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUser(data);
        setOpen(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          <UserHeader user={user} onEditClick={handleOpen} />
          <UserInfo user={user} />
          <AnimatePresence>
            <EditProfileDialog
              open={open}
              handleOpen={handleOpen}
              user={user}
              onUpdate={handleUpdate}
            />
          </AnimatePresence>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default UserProfile;
