"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@material-tailwind/react";

const ApplyDress = () => {
  return (
    <div className="mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="absolute opacity-50">
            
        </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-1">
          Get a Dress Today!
        </h2>
        <p className="text-white/90 mb-4">
          Request a dress today and get it delivered to your doorstep
        </p>
        <Button
          size="sm"
          className="bg-white text-purple-500 hover:bg-white/90 font-medium"
        >
          Apply Now
        </Button>
      </div>
      <div className="relative w-32 h-32">
        <Image
          src="/feature/dress/dress1.png"
          alt="Dress illustration"
          width={128}
          height={128}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default ApplyDress;
