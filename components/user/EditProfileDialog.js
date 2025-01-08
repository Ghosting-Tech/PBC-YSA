"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Button,
  Typography,
  Radio,
  IconButton,
} from "@material-tailwind/react";
import {
  FaRegEdit,
  FaCamera,
  FaMars,
  FaVenus,
  FaTransgender,
  FaGenderless,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { RxCross1, RxCross2 } from "react-icons/rx";

const genderOptions = [
  { value: "male", label: "Male", icon: FaMars, color: "purple" },
  { value: "female", label: "Female", icon: FaVenus, color: "pink" },
  { value: "other", label: "Other", icon: FaTransgender, color: "purple" },
  {
    value: "unspecified",
    label: "Unspecified",
    icon: FaGenderless,
    color: "gray",
  },
];

const GenderSelection = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <Typography variant="h6" color="purple-gray" className="mb-2">
        Gender
      </Typography>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {genderOptions.map((option) => (
          <motion.div key={option.value} onClick={() => onChange(option.value)}>
            <motion.div
              className={`cursor-pointer p-4 rounded-xl border-2 ${
                value == option.value
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : "border-gray-200 hover:border-gray-300"
              } transition-colors duration-200 flex flex-col lg:flex-row gap-2`}
              animate={{
                scale: value === option.value ? 1 : 0.95,
              }}
            >
              <div className="flex items-center justify-center">
                <motion.div
                  className={`rounded-full p-3 ${
                    value === option.value
                      ? `bg-${option.color}-500`
                      : "bg-gray-100"
                  }`}
                >
                  <option.icon
                    className={
                      value === option.value
                        ? "text-white"
                        : `text-${option.color}-500`
                    }
                    size={18}
                  />
                </motion.div>
              </div>
              <Typography
                color={value === option.value ? option.color : "gray"}
                className="font-medium text-center mt-2"
              >
                {option.label}
              </Typography>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EditProfileDialog = ({ open, handleOpen, user, onUpdate }) => {
  const [updateUser, setUpdateUser] = useState(user);
  const [emailError, setEmailError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    setUpdateUser(user);
  }, [user]);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUpdateUser({ ...updateUser, email });
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setEmailError(emailPattern.test(email) ? "" : "Please enter a valid email");
  };

  const handleUpdate = () => {
    if (emailError) {
      toast.error("Please enter a valid email address");
      return;
    }
    onUpdate(updateUser);
  };

  const tabVariants = {
    active: { borderBottom: "2px solid #3B82F6", color: "#3B82F6" },
    inactive: { borderBottom: "2px solid transparent", color: "#64748B" },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="bg-white rounded-xl shadow-xl"
      >
        <DialogHeader className="border-b pb-4 flex items-center justify-between">
          <Typography variant="h4" color="purple-gray">
            Edit Profile
          </Typography>
          <IconButton variant="text" onClick={handleOpen}>
            <RxCross2 size={20} />
          </IconButton>
        </DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[70vh]">
          <div className="flex justify-center mb-6">
            <motion.div className="relative">
              <Image
                src={
                  updateUser?.image?.url ||
                  `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user?.name}`
                }
                alt="Profile"
                width={150}
                height={150}
                className="rounded-full w-28 aspect-square object-cover border-4 border-[var(--color)]"
              />
              <label
                htmlFor="profile-image"
                className="absolute bottom-2 right-2 cursor-pointer bg-[var(--color)] p-2 rounded-full shadow-md text-white hover:bg-[var(--hover)] transition-colors"
              >
                <FaCamera size={20} />
              </label>
              <input
                type="file"
                id="profile-image"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setUpdateUser({
                        ...updateUser,
                        image: { url: reader.result, name: file.name },
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </motion.div>
          </div>
          <div className="flex justify-center mb-6">
            <motion.button
              variants={tabVariants}
              animate={activeTab === "personal" ? "active" : "inactive"}
              onClick={() => setActiveTab("personal")}
              className="px-4 py-2 mx-2 focus:outline-none"
            >
              Personal Info
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={activeTab === "account" ? "active" : "inactive"}
              onClick={() => setActiveTab("account")}
              className="px-4 py-2 mx-2 focus:outline-none"
            >
              Account Settings
            </motion.button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div>
                    <Input
                      label="Full Name"
                      value={updateUser?.name}
                      onChange={(e) =>
                        setUpdateUser({ ...updateUser, name: e.target.value })
                      }
                      className="border-b border-gray-300 focus:border-[var(--color)] transition-colors"
                    />
                  </div>
                  <GenderSelection
                    value={updateUser?.gender}
                    onChange={(val) =>
                      setUpdateUser({ ...updateUser, gender: val })
                    }
                  />
                  <div>
                    <Input
                      label="City"
                      value={updateUser?.city}
                      onChange={(e) =>
                        setUpdateUser({ ...updateUser, city: e.target.value })
                      }
                      className="border-b border-gray-300 focus:border-[var(--color)] transition-colors"
                    />
                  </div>
                </div>
              )}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <Input
                      type="email"
                      label="Email"
                      value={updateUser?.email}
                      onChange={handleEmailChange}
                      error={!!emailError}
                      className="border-b border-gray-300 focus:border-[var(--color)] transition-colors"
                    />
                    {emailError && (
                      <Typography color="red" className="mt-1 text-xs">
                        {emailError}
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Input
                      label="Phone Number"
                      disabled
                      value={updateUser?.phoneNumber}
                      onChange={(e) =>
                        setUpdateUser({
                          ...updateUser,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="border-b border-gray-300 focus:border-[var(--color)] transition-colors"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </DialogBody>
        <DialogFooter className="border-t pt-4">
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-2 hover:bg-red-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="bg-[var(--color)] hover:bg-[var(--hover)] transition-colors text-white"
          >
            Update Profile
          </Button>
        </DialogFooter>
      </Dialog>
    </AnimatePresence>
  );
};

export default EditProfileDialog;
