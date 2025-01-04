"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Mithilesh Kr.",
    img: "/image/hero2.webp",
    cust: "Satisfied Customer",
    desc: "The platform has revolutionized the way I manage my business, highly recommended!",
    rating: "4.5",
  },
  {
    name: "Salman Ali.",
    img: "/image/hero3.webp",
    cust: "Verified Customer",
    desc: "Excellent service and fast delivery, the best experience I've had shopping online.",
    rating: "5",
  },
  {
    name: "Manish Kr.",
    img: "/image/hero4.webp",
    cust: "Happy Customer",
    desc: "I love the wide variety of products and how easy it is to find what I need.",
    rating: "4",
  },
  {
    name: "Reyaz ali.",
    img: "/image/hero5.webp",
    cust: "Verified Customer",
    desc: "The customer support is amazing! They helped me resolve my issue within minutes.",
    rating: "5",
  },
  {
    name: "Manish Kr.",
    img: "/image/hero1.webp",
    cust: "Satisfied Customer",
    desc: "A truly outstanding platform. The interface is user-friendly and the service is top-notch.",
    rating: "5",
  },
  {
    name: "Naushad Ahmad.",
    img: "/image/hero2.webp",
    cust: "Verified Customer",
    desc: "The connections you make at Web Summit are unparalleled, we met users all over the world.",
    rating: "4",
  },
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    let interval;
    if (isAutoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      className="py-10"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-12 mt-5">
        <Typography variant="h2" className="mb-4 text-[#6E4BB2] font-['Arial']">
          Our Clients
        </Typography>
        <Typography
          variant="lead"
          color="purple-gray"
          className="max-w-3xl mx-auto font-poppins"
        >
          That&apos;s the main thing people are controlled by! Thoughts - their
          perception of themselves!
        </Typography>
      </motion.div>

      <motion.div
        className="relative max-w-5xl mx-auto px-4"
        variants={itemVariants}
        onMouseEnter={() => setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <TestimonialCard {...testimonials[currentIndex]} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 flex justify-between">
          <IconButton
            variant="text"
            color="purple"
            size="lg"
            onClick={prevSlide}
            className="rounded-full"
          >
            <ChevronLeftIcon strokeWidth={2} className="w-6 h-6" />
          </IconButton>
          <IconButton
            variant="text"
            color="purple"
            size="lg"
            onClick={nextSlide}
            className="rounded-full"
          >
            <ChevronRightIcon strokeWidth={2} className="w-6 h-6" />
          </IconButton>
        </div>
      </motion.div>

      <motion.div className="flex justify-center mt-8" variants={itemVariants}>
        {testimonials.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full mx-1 cursor-pointer ${
              index === currentIndex ? "bg-purple-500" : "bg-purple-200"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}
