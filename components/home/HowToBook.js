import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@material-tailwind/react";
import { WiStars } from "react-icons/wi";
import Image from "next/image";
import HowToBookCard from "./HowToBookCard";

const HowToBook = () => {
  const services = [
    {
      title: "Find the service",
      description:
        "Choose from various amounts of services that fit your needs and expectations.",
      buttonText: "Book a Service »",
      url: "/services",
      imageUrl: "/image/service1.svg",
      medalIcon: "/image/service1model.svg",
    },
    {
      title: "Book a service",
      description:
        "Book a service and wait for the service provider to come to your given location.",
      imageUrl: "/image/service2.svg",
      medalIcon: "/image/service2model.svg",
    },
    {
      title: "Just chill",
      description:
        "Verified service providers will come to your location and complete the work hassle-free.",
      imageUrl: "/image/service3.svg",
      medalIcon: "/image/service3model.svg",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section className="py-6">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <Typography
            variant="h2"
            color="purple-gray"
            className="mb-2 flex items-center justify-center"
          >
            <WiStars className="text-orange-500 text-2xl md:text-4xl mr-2" />
            <span className="text-[#6E4BB2]">How to book a service?</span>
            <WiStars className="text-orange-500 text-4xl ml-2" />
          </Typography>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <Image
              width={384}
              height={16}
              src="/image/line2.svg"
              alt="Decorative line"
              className="mx-auto"
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <HowToBookCard {...service} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowToBook;
