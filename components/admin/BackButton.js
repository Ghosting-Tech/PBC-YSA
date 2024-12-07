"use client";
import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <div
      className="w-fit rounded-md mb-4 flex items-center gap-2   text-gray-500 hover:text-gray-900 cursor-pointer"
      onClick={() => router.back()}
    >
      <IoArrowBackOutline size={25} />
    </div>
  );
};

export default BackButton;
