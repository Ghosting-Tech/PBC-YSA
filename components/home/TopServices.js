"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import { motion, useInView, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Typography } from "@material-tailwind/react";
import ServiceCard from "./ServiceCard";

const NextArrow = ({ onClick }) => {
  return (
    <motion.div
      className="absolute hover:scale-110 transition-all duration-300 top-1/2 transform -translate-y-1/2 right-4 bg-white text-blue-500 rounded-full p-3 cursor-pointer z-10 shadow-lg"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MdChevronRight className="w-8 h-8" />
    </motion.div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <motion.div
      className="absolute hover:scale-110 transition-all duration-300 top-1/2 transform -translate-y-1/2 left-4 bg-white text-blue-500 rounded-full p-3 cursor-pointer z-10 shadow-lg"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MdChevronLeft className="w-8 h-8" />
    </motion.div>
  );
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const TopServices = ({ topServices }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200 overflow-hidden"
    >
      <motion.div variants={itemVariants} className="text-center mb-16">
        <Typography
          variant="h1"
          color="blue-gray"
          className="mb-4 font-sans text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
        >
          For All Your Needs
        </Typography>
        <motion.div
          className="text-blue-600 font-serif text-5xl md:text-6xl lg:text-7xl font-medium inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
            transition: {
              y: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              },
              scale: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              },
            },
          }}
        >
          We Provide the Best Services
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative container mx-auto px-4 md:px-8 gap-2 items-center w-full"
      >
        {topServices?.length <= 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {topServices.map((service) => (
                <motion.div
                  key={service._id}
                  className="px-2 hover:scale-105 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 30 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Slider {...settings}>
            {topServices?.map((service) => (
              <motion.div
                key={service._id}
                className="px-4 py-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </Slider>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TopServices;
