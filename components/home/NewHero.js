"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainNav from "@/components/nav/MainNav";
import Link from "next/link";
import { Button } from "@material-tailwind/react";

const HeroSection = () => {
  const allImages = [
    "/image/hero1.jpg",
    "/image/hero2.jpg",
    "/image/hero3.jpg",
    "/image/hero4.jpg",
    "/image/hero5.jpg",
    "/image/hero1.jpg",
  ];

  const [displayedImages, setDisplayedImages] = useState([]);

  useEffect(() => {
    const initialImages = allImages.slice(0, 3);
    setDisplayedImages(initialImages);

    const intervals = initialImages.map((_, index) => {
      return setInterval(() => {
        setDisplayedImages((prevImages) => {
          const newImages = [...prevImages];
          const availableImages = allImages.filter(
            (img) => !prevImages.includes(img)
          );
          newImages[index] =
            availableImages[Math.floor(Math.random() * availableImages.length)];
          return newImages;
        });
      }, 20000 + index * 5000); // Stagger the intervals
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background DNA Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100 z-[-1]"
        style={{
          backgroundImage: "url(/bgImage.png)",
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      />

      {/* Navigation */}
      <div className="mt-5">
        <MainNav />
      </div>

      {/* Hero Content */}
      <div className="px-5 lg:pl-20 lg:pr-2 pt-20 flex flex-col gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Arial'] text-[var(--color)] mb-4">
            Healthcare at your Doorstep
          </h1>
          <p className="text-lg text-black md:text-gray-600 mb-8 font-poppins">
            From ambulance support to professional nursing and physiotherapy
            services, we&apos;ve got you covered 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <Button
                variant="default"
                className="px-6 py-3 bg-[var(--color)] text-white font-semibold rounded-md 
                hover:bg-[var(--hover)] transition-colors"
              >
                EXPLORE SERVICES
              </Button>
            </Link>
            <Link href="/become-service-provider">
              <Button
                variant="outlined"
                style={{ color: "#6e4bb2", borderColor: "#6e4bb2" }}
                className="px-6 py-3"
              >
                BECOME A PROVIDER
              </Button>
            </Link>
          </div>
        </div>

        {/* Slowly transitioning Images */}
        <div className="w-full flex justify-center items-end lg:justify-end">
          <div className="w-full lg:w-1/2 mt-8 flex flex-col sm:flex-row gap-6 justify-end items-end">
            {displayedImages.map((image, index) => (
              <div
                key={index}
                className="w-full sm:w-1/3 h-[220px] relative overflow-hidden rounded-lg"
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={image}
                    src={image}
                    alt={`Healthcare service ${index + 1}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 3 }, // Very slow fade transition
                    }}
                  />
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
