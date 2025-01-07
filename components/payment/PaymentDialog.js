"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";
import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiUploadCloud, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentDialog({
  isOpen,
  onClose,
  onConfirm,
  actionType,
}) {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async () => {
    if (!file) return null;

    setUploading(true);
    const storageRef = ref(storage, `Payment-screenshots/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setUploading(false);
    return url;
  };

  const handleSubmit = async () => {
    let dataToSend = { timestamp: new Date() }; // Common data

    if (actionType === "Paid") {
      // Handle screenshot upload
      if (file) {
        const screenshotUrl = await handleFileUpload();
        dataToSend.screenshot = screenshotUrl; // Add screenshot URL if available
      }
    } else {
      // Handle reason submission
      if (reason.trim()) {
        dataToSend.reason = reason.trim(); // Add reason if provided
      }
    }

    // Send the prepared data
    onConfirm(dataToSend);

    // Reset state and close dialog
    setReason("");
    setFile(null);
    onClose();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          handler={onClose}
          animate={{
            mount: { scale: 1, opacity: 1 },
            unmount: { scale: 0.9, opacity: 0 },
          }}
          size="sm"
          className="bg-white rounded-xl shadow-xl"
        >
          <DialogHeader className="border-b border-purple-gray-100 px-6 py-4">
            <Typography
              variant="h5"
              color="purple-gray"
              className="flex items-center gap-2"
            >
              {actionType === "Paid" ? (
                <>
                  <FiCheck className="h-5 w-5 text-green-500" />
                  Confirm Payment
                </>
              ) : (
                <>
                  <FiAlertCircle className="h-5 w-5 text-amber-500" />
                  Change Status to Unpaid
                </>
              )}
            </Typography>
          </DialogHeader>
          <DialogBody className="px-6 py-8">
            {actionType === "Paid" ? (
              <div className="space-y-4">
                <Typography
                  variant="paragraph"
                  color="purple-gray"
                  className="mb-2"
                >
                  Upload the payment screenshot
                </Typography>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                      ? "border-purple-500 bg-[var(--color)]"
                      : "border-purple-gray-200"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="text-center">
                    <FiUploadCloud className="mx-auto h-12 w-12 text-purple-gray-300" />
                    <Typography
                      variant="h6"
                      color="purple-gray"
                      className="mt-2"
                    >
                      {file ? file.name : "Drop files here or click to upload"}
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                      PNG, JPG up to 10MB
                    </Typography>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Typography
                  variant="paragraph"
                  color="purple-gray"
                  className="mb-2"
                >
                  Enter the reason for status change
                </Typography>
                <Input
                  label="Reason"
                  value={reason}
                  color="purple"
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            )}
          </DialogBody>
          <DialogFooter className="border-t border-purple-gray-100 px-6 py-4">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="text"
                onClick={onClose}
                disabled={uploading}
                className="flex items-center gap-2 bg-red-300 hover:bg-red-100 text-white  hover:text-red-600"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                variant="filled"
                color="purple"
                onClick={handleSubmit}
                disabled={
                  uploading ||
                  (actionType === "Paid" && !file) ||
                  (actionType !== "Paid" && reason.trim() === "")
                }
                className="flex items-center gap-2"
              >
                {uploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <FiCheck className="h-4 w-4" />
                )}
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
