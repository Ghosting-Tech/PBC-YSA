"use client";
import React from "react";
import Image from "next/image";
import HowToBook from "@/components/home/HowToBook";
import WhyChooseUs from "@/components/home/WhyChooseUs";

const About = () => {
  return (
    <div>
      <div className="min-h-screen container mx-auto px-4 py-8 flex flex-col items-center justify-center bg-gray-100">
        <div className="max-w-full w-full bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="font-cookie text-[var(--color)] text-4xl sm:text-5xl md:text-6xl lg:text-6xl">
              About Us
            </h1>
            <h2 className="font-julius text-gray-700 text-3xl sm:text-3xl md:text-4xl lg:text-3xl mb-4">
              Your Trusted Home Service Partner
            </h2>
            <p className="mb-4 text-gray-700">
              At Service Wallah, we understand the importance of a smoothly
              functioning home. With our range of expert services, we ensure
              that your home remains a haven of comfort and convenience.
            </p>
            <p className="mb-4 text-gray-700">
              From air conditioner repairs to fan installations, our skilled
              professionals are adept at handling a variety of household tasks,
              providing you with hassle-free solutions that you can rely on.
            </p>
            <h2 className="font-julius text-gray-700 text-3xl sm:text-3xl md:text-4xl lg:text-3xl mb-4">
              Services We Offer
            </h2>
            <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
              <li>Air Conditioner Repair</li>
              <li>Fan Installation and Repair</li>
              <li>Electrical Services</li>
              <li>Plumbing Solutions</li>
              <li>Appliance Maintenance</li>
              <li>And much more!</li>
            </ul>
            <p className="mt-8 text-gray-600">
              Contact us today to experience the convenience and reliability of
              Service Wallah!
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-full shadow-lg z-10">
              <Image
                src="/image/slider5.webp"
                alt="A person working"
                className="rounded-lg"
                fill
                sizes="100vw"
              />
            </div>
            <div className="absolute top-24 left-8 w-64 h-64 hidden sm:w-80 sm:h-80 md:w-80 md:h-96 shadow-lg z-20">
              <Image
                src="/image/slider6.webp"
                alt="A person working"
                className="rounded-lg"
                fill
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </div>
      <HowToBook />
      <WhyChooseUs />
    </div>
  );
};

export default About;
