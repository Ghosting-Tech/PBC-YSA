"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography, Button } from "@material-tailwind/react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const NewFooter = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const topBookedServices = useSelector((state) => state.topServices.services);

  return (
    <motion.footer
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative min-h-screen bg-white "
    >
      {/* DNA Background Image */}
      <div className="absolute w-full h-full bottom-0">
        <Image
          src="/bgImage.png"
          alt="DNA Structure"
          fill
          className="object-cover opacity-100"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-12 pb-5 relative z-10">
        {/* Ready to Get Started Section */}
        <motion.div variants={itemVariants} className="max-w-2xl mb-24">
          <Typography
            variant="h1"
            className="text-purple-600 text-5xl font-bold mb-6 text-center md:text-left "
          >
            Ready to Get Started?
          </Typography>
          <Link href="/services" className="no-underline">
            <Button
              color="purple"
              size="lg"
              className="rounded-full px-8 mx-auto md:mx-0 flex justify-center items-center md:justify-start"
            >
              Explore Services
            </Button>
          </Link>
        </motion.div>
        <div className="bg-gradient-to-br from-[#6E4BB2]/10 to-white w-full pt-5 px-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us Column */}
            <div className="flex flex-col">
              <div className="flex  h-[200px]">
                <Link href="/">
                  <Image
                    src="/trustologo.svg"
                    alt="Trustory Logo"
                    width={1000}
                    height={1000}
                    className="w-[200px] h-[200px]"
                  />
                </Link>
              </div>
              {/* <div className="text-gray-700 mb-6">
                We&apos;re a leading agency specializing in providing customized
                service solutions for businesses of all sizes.
              </div> */}
            </div>

            {/* Our Services Column */}
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                className="text-purple-600 mb-4 font-semibold"
              >
                Our Services
              </Typography>
              <ul className="space-y-2">
                {topBookedServices?.length > 0 ? (
                  topBookedServices?.slice(0, 8).map((item, index) => (
                    <motion.li
                      key={index}
                      className="cursor-pointer hover:translate-x-5 transition-all duration-300 text-[#6E4BB2] hover:text-purple-600"
                    >
                      <Link
                        href={`/services/${item?._id}`}
                        className="transition-colors"
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))
                ) : (
                  <Typography variant="small" className="text-gray-700">
                    No services found, Enable location for services
                  </Typography>
                )}
              </ul>
            </motion.div>

            {/* For You Column */}
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                className="text-purple-600 mb-4 font-semibold"
              >
                For You
              </Typography>
              <ul className="space-y-2">
                {[
                  {
                    name: "Become Services Provider",
                    link: "/become-service-provider",
                  },
                  {
                    name: "Support",
                    link: "/support",
                  },
                  {
                    name: "Privacy Policy",
                    link: "/privacy-policy",
                  },
                  {
                    name: "Terms & Conditions",
                    link: "/terms-and-condition",
                  },
                  {
                    name: "Refund Policy",
                    link: "/refund-policy",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="cursor-pointer hover:translate-x-5 transition-all duration-300 text-[#6E4BB2] hover:text-purple-600"
                  >
                    <Link href={item.link} className="transition-colors">
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Get in Touch Column */}
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                className="text-purple-600 mb-4 font-semibold"
              >
                Get in Touch
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-yellow-600" />
                  <Typography variant="small" className="text-gray-700">
                    support@yourserviceapp.in
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-purple-600" />
                  <Typography variant="small" className="text-gray-700">
                    +91 9470017395
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-600" />
                  <Typography variant="small" className="text-gray-700">
                    123 Service St, City, Country
                  </Typography>
                </div>
              </div>
              {/* Social Media Icons */}
              <motion.div variants={itemVariants} className="flex gap-4 mt-8">
                {[
                  {
                    icon: FaLinkedinIn,
                    link: "https://linkedin.com",
                    color: "text-[#6E4BB2]",
                    hoverColor: "text-purple-700",
                  },
                  {
                    icon: FaFacebookF,
                    link: "https://facebook.com",
                    color: "text-purple-600",
                    hoverColor: "text-purple-700",
                  },
                  {
                    icon: FaInstagram,
                    link: "https://instagram.com",
                    color: "text-pink-600",
                    hoverColor: "text-purple-700",
                  },
                  {
                    icon: FaWhatsapp,
                    link: "https://whatsapp.com",
                    color: "text-green-600",
                    hoverColor: "text-purple-700",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`${item.color} hover:${item.hoverColor} cursor-pointer`}
                  >
                    <Link
                      href={item.link}
                      target="_blank"
                      className={`${item.color} hover:${item.hoverColor}`}
                    >
                      <item.icon size={20} />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Copyright Section */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center text-gray-700"
          >
            <Typography variant="small">
              © {new Date().getFullYear()} Yourserviceapp. All rights reserved.
            </Typography>
          </motion.div>

          {/* Powered By Section */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex justify-center items-center"
          >
            <Typography variant="small" className="text-gray-600 mr-2">
              Powered by
            </Typography>
            <Link
              href="https://ghosting.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo/ghosting.png"
                width={24}
                height={24}
                alt="Ghosting Tech"
                className="mr-2"
              />
              <span className="text-purple-600 font-semibold">
                Ghosting Tech
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default NewFooter;
