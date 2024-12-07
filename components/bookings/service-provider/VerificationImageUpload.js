"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineCloudUpload, MdCheckCircle, MdError } from "react-icons/md";
import { toast } from "sonner";
import uploadImage from "@/utils/uploadImage";
import axios from "axios";
import Image from "next/image";

const VerificationImageUpload = ({ booking, setBooking }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const inputRef = useRef(null);

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
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = async (file) => {
    if (booking.completed) {
      toast.error("Service already completed!");
      return;
    }

    // if (!file.type.startsWith("image/")) {
    //   toast.error("Please upload an image file");
    //   return;
    // }

    setUploading(true);
    setUploadProgress(0);

    // Create a preview of the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result);
    };

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const uploadedImage = await uploadImage(file, "verification-image");

      const { data } = await axios.post(
        "/api/service-providers/upload-verification-image",
        { bookingId: booking._id, uploadedImage }
      );

      if (data.success) {
        setUploadProgress(100);
        setBooking(data.booking);
        toast.success(data.message);
      } else {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      clearInterval(interval);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-full">
      {/* <h2 className="text-xl text-gray-700 font-semibold mb-4">
        Upload Verification Image
      </h2> */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        } transition-all duration-300 ease-in-out`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={booking.completed || uploading}
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          {booking?.verificationImage?.url ? (
            <Image
              src={booking.verificationImage.url || previewImage}
              alt="Preview"
              width={500}
              height={500}
              className="w-48 aspect-square object-cover rounded-lg"
            />
          ) : (
            <div>
              <MdOutlineCloudUpload className="w-16 h-16 text-gray-400" />
              <p className="text-gray-600 text-center flex gap-1 flex-col ">
                Drag and drop your image here, or click to
                <div className="font-semibold">
                  {" "}
                  upload a verification image
                </div>
              </p>
            </div>
          )}
          <motion.button
            className={`px-4 py-2 rounded-full hover:scale-105 transition-all duration-300 text-white font-medium ${
              booking.completed || uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={onButtonClick}
            disabled={booking.completed || uploading}
          >
            {uploading ? "Uploading..." : "Select Image"}
          </motion.button>
        </div>
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80"
            >
              <div className="w-3/4">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">
                    Uploading...
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-2 bg-blue-200 rounded-full">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {booking.completed && (
        <div className="mt-4 flex items-center justify-center text-green-600">
          <MdCheckCircle className="w-5 h-5 mr-2" />
          <span>Service completed - Image upload disabled</span>
        </div>
      )}
    </div>
  );
};

export default VerificationImageUpload;
