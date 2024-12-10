"use client";

import React, { useState, useRef } from "react";
import { Card } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Input, Typography } from "@material-tailwind/react";
import { toast } from "sonner";
import Image from "next/image";

export default function MediaUploadWithHeadings() {
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    heading1: "Your One-Stop Solution",
    heading2: "Elevate Your Lifestyle with",
    heading3: "Expert Services",
    heading4:
      "Connect with skilled professionals for all your needs. From home maintenance to personal care, we&apos;ve got you covered.",
    images: [],
    videos: [],
  });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    const newImages = files.map((file) => {
      const preview = URL.createObjectURL(file);
      return Object.assign(file, { preview });
    });

    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...newImages],
    }));
  };

  const handleVideoUpload = async (e) => {
    if (e.target.files[0].size > 10 * 1024 * 1024) {
      toast.error("Please upload video less than 10MB");
      return;
    }
    const files = Array.from(e.target.files || []);

    const newVideos = files.map((file) => {
      const preview = URL.createObjectURL(file);
      return Object.assign(file, { preview });
    });

    setFormData((prevState) => {
      const updatedState = {
        ...prevState,
        videos: [...prevState.videos, ...newVideos],
      };

      return updatedState;
    });
  };

  const removeFile = (type, index) => {
    setFormData((prevState) => {
      const updatedFiles = [...prevState[type]];
      if (updatedFiles[index]?.preview) {
        URL.revokeObjectURL(updatedFiles[index].preview);
      }
      updatedFiles.splice(index, 1);
      return { ...prevState, [type]: updatedFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (formData.images.length < 4) {
      toast.error("Please upload all images");
      return;
    }

    if (formData.videos.length < 6) {
      toast.error("Please upload all videos");
      return;
    }

    try {
      const data = new FormData();

      // Append headings
      data.append("heading1", formData.heading1);
      data.append("heading2", formData.heading2);
      data.append("heading3", formData.heading3);
      data.append("heading4", formData.heading4);

      // Append images
      formData.images.forEach((file) => {
        data.append(`images`, file);
      });

      // Append videos
      formData.videos.forEach((file) => {
        data.append(`videos`, file);
      });

      // Send to API
      const response = await fetch("/api/admin/customize", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Content Create successful");
        console.log({ result });

        // Reset form data after successful submission
        setFormData({
          heading1: "",
          heading2: "",
          heading3: "",
          heading4: "",
          images: [],
          videos: [],
        });

        // Optional: Clear file previews
        formData.images.forEach((file) => URL.revokeObjectURL(file.preview));
        formData.videos.forEach((file) => URL.revokeObjectURL(file.preview));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Upload failed");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred during upload");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <Card className="bg-white p-6 rounded-lg shadow-md">
        <Typography variant="h4" color="blue" className="mb-4 mx-auto">
          Customize Content
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Heading Inputs */}
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <Input
                key={`heading${num}`}
                size="lg"
                label={`Heading ${num}`}
                name={`heading${num}`}
                value={formData[`heading${num}`]}
                onChange={handleInputChange}
                color="blue"
              />
            ))}
          </div>

          {/* Image Upload Section */}
          <div>
            <Typography variant="h6" className="mb-2">
              Images
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card
                  key={`image-${index}`}
                  className="relative aspect-square cursor-pointer group"
                  onClick={() => imageInputRef.current?.click()}
                >
                  {formData.images[index] ? (
                    <div className="relative w-full h-full">
                      <Image
                        width={200}
                        height={200}
                        src={formData.images[index].preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("images", index);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <Typography variant="small" className="mt-2">
              Selected: {formData.images.length} / 4
            </Typography>
          </div>

          {/* Video Upload Section */}
          <div>
            <Typography variant="h6" className="mb-2">
              Videos
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card
                  key={`video-${index}`}
                  className="relative aspect-video cursor-pointer group"
                  onClick={() => videoInputRef.current?.click()}
                >
                  {formData.videos[index] ? (
                    <div className="relative w-full h-full">
                      <video
                        src={formData.videos[index].preview}
                        className="w-full h-full object-cover rounded-lg"
                        controls
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("videos", index);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg">
                      <VideoCameraIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleVideoUpload}
            />
            <Typography variant="small" className="mt-2">
              Selected: {formData.videos.length} / 6
            </Typography>
          </div>

          <Button
            type="submit"
            className="w-full"
            color="blue"
            disabled={isProcessing} // Disable the button during processing
          >
            {isProcessing ? "Processing..." : "Submit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
