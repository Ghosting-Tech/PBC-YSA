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
      className="absolute top-1/2 transform -translate-y-1/2 right-2 bg-gray-700 text-white rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MdChevronRight className="w-6 h-6" />
    </motion.div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <motion.div
      className="absolute top-1/2 transform -translate-y-1/2 left-2 bg-gray-700 text-white rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MdChevronLeft className="w-6 h-6" />
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      style={{
        backgroundImage: "url(/image/shape-3-2.png)",
        backgroundRepeat: "no-repeat",
      }}
      className="py-12"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <Typography
          variant="h1"
          color="blue-gray"
          className="mb-4 font-julius font-bold"
        >
          For All Your Needs we provide
        </Typography>
        <motion.span
          className="text-blue-500 font-cookie font-medium text-7xl inline-block"
          animate={{
            y: [0, -10, 0],
            transition: {
              y: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              },
            },
          }}
        >
          Best Services
        </motion.span>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative container mx-auto px-4 md:px-0 gap-2 items-center w-full"
      >
        {topServices.length <= 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {topServices.map((service) => (
                <motion.div
                  key={service._id}
                  className="px-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Slider {...settings}>
            {topServices.map((service) => (
              <motion.div
                key={service._id}
                className="px-2"
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
