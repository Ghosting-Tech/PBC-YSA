"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Button,
  Typography,
  Card,
  CardBody,
  Carousel,
  IconButton,
} from "@material-tailwind/react";
import { RxDoubleArrowRight } from "react-icons/rx";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaStar, FaUsers } from "react-icons/fa";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Hero = ({ customizeData }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  const carouselVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    (<motion.div
      ref={ref}
      className="overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div className="lg:w-1/2" variants={itemVariants}>
            <motion.div variants={textVariants}>
              <Typography
                variant="small"
                color="blue"
                className="mb-2 font-semibold uppercase tracking-wider"
              >
                {customizeData?.heading1}
              </Typography>
              <Typography
                variant="h1"
                color="blue-gray"
                className="mb-4 font-bold"
              >
                {customizeData?.heading2}
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
                  {customizeData?.heading3}
                </motion.span>
              </Typography>
              <Typography
                variant="lead"
                className="mb-8 leading-2 text-gray-600"
              >
                {customizeData?.heading4}
              </Typography>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full">
              <motion.div variants={buttonVariants}>
                <Link href="/services" className="no-underline">
                  <Button
                    size="lg"
                    color="blue"
                    variant="gradient"
                    ripple={true}
                    className="flex items-center justify-center gap-2 w-full hover:scale-105"
                  >
                    <span>Explore Services</span>
                    <RxDoubleArrowRight size={18} />
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants}>
                <Link href="/become-service-provider" className="no-underline">
                  <Button
                    size="lg"
                    color="blue"
                    variant="outlined"
                    ripple={true}
                    className="flex items-center justify-center gap-2 w-full hover:scale-105 transition-all duration-300"
                  >
                    <span>Become a Provider</span>
                    <BsPersonFillAdd size={18} />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={itemVariants}
            >
              <Card className="bg-white shadow-none">
                <CardBody className="flex items-center gap-4">
                  <motion.div className="bg-blue-50 p-3 rounded-full">
                    <FaUsers className="text-blue-500 w-6 h-6" />
                  </motion.div>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      200,000+
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Satisfied Customers
                    </Typography>
                  </div>
                </CardBody>
              </Card>
              <Card className="bg-white shadow-none">
                <CardBody className="flex items-center gap-4">
                  <div className="bg-yellow-50 p-3 rounded-full">
                    <FaStar className="text-yellow-700 w-6 h-6" />
                  </div>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      4.8 / 5
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Average Rating
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>
          <motion.div className="lg:w-1/2" variants={carouselVariants}>
            <div className="relative">
              <Carousel
                className="rounded-xl"
                autoplay={true}
                loop={true}
                prevArrow={({ handlePrev }) => (
                  <IconButton
                    variant="text"
                    color="white"
                    size="lg"
                    onClick={handlePrev}
                    className="!absolute top-2/4 left-4 -translate-y-2/4 z-20 bg-white/10 hover:bg-white/30 transition-all duration-300"
                  >
                    <ArrowLeftIcon strokeWidth={2} className="w-5 h-5" />
                  </IconButton>
                )}
                nextArrow={({ handleNext }) => (
                  <IconButton
                    variant="text"
                    color="white"
                    size="lg"
                    onClick={handleNext}
                    className="!absolute top-2/4 right-4 -translate-y-2/4 z-20 bg-white/10 hover:bg-white/30 transition-all duration-300"
                  >
                    <ArrowRightIcon strokeWidth={2} className="w-5 h-5" />
                  </IconButton>
                )}
                navigation={({ setActiveIndex, activeIndex, length }) => (
                  <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                    {new Array(length).fill("").map((_, i) => (
                      <span
                        key={i}
                        className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                          activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                        }`}
                        onClick={() => setActiveIndex(i)}
                      />
                    ))}
                  </div>
                )}
              >
                {customizeData?.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image.url}
                    alt={`Service ${index + 1}`}
                    width={1000}
                    height={600}
                    className="h-[450px] lg:h-[650px] w-full object-cover"
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                ))}
              </Carousel>
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
              <motion.div
                className="absolute bottom-8 left-8 right-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Typography variant="h3" color="white" className="mb-2">
                  Quality Service at Your Fingertips
                </Typography>
                <Typography variant="small" color="white">
                  Book trusted professionals for any job, anytime.
                </Typography>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>)
  );
};

export default Hero;
