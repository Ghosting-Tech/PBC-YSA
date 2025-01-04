"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import { motion, useInView, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { Button, Typography } from "@material-tailwind/react";
import ServiceCard from "./ServiceCard";
import { useSelector } from "react-redux";

const NextArrow = ({ onClick }) => {
  return (
    <motion.div
      className="absolute hover:scale-110 transition-all duration-300 top-40 transform -translate-y-1/2 right-0 bg-white text-[#6E4BB2] rounded-full p-3 cursor-pointer z-10 shadow-lg"
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
      className="absolute hover:scale-110 transition-all duration-300 top-40 transform -translate-y-1/2 left-0 bg-white text-[#6E4BB2] rounded-full p-3 cursor-pointer z-10 shadow-lg"
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
  slidesToShow: 4,
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

const RecommendedServices = ({ recommendedServices }) => {
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
      className="py-20 bg-transparent"
    >
      <motion.div variants={itemVariants} className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <Typography
            variant="h1"
            color="purple-gray"
            className="mb-2 font-['Arial'] text-3xl sm:text-5xl font-semibold text-[#6E4BB2]"
          >
            Recommended Services
          </Typography>
        </div>
        <div className="mb-10 px-6 flex items-center justify-center">
          <Typography
            variant="paragraph"
            className="text-gray-600 max-w-2xl font-poppins text-center"
          >
            Discover our most popular services, loved by users for their
            convenience and quality. Connect with trusted professionals in just
            a few clicks.
          </Typography>
        </div>

        <motion.div
          variants={itemVariants}
          className="relative container mx-auto px-4 md:px-8 gap-2 items-center w-full"
        >
          {recommendedServices?.length <= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {recommendedServices.map((service) => (
                  <motion.div
                    key={service._id}
                    className="px-2 hover:scale-105 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: 30 }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Slider {...settings}>
              {recommendedServices?.map((service) => (
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
    </motion.div>
  );
};

export default RecommendedServices;
