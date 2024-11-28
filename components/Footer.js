"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography } from "@material-tailwind/react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import Logo from "./Logo";
import { useSelector } from "react-redux";

const Footer = () => {
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
      className="bg-gray-100 border-t border-gray-300 text-gray-700 pt-12 pb-6 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('/image/shape-3-2.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants}>
            <Logo />
            <Typography variant="small" className="mt-4 mb-6">
              We&apos;re a leading agency specializing in providing customized
              service solutions for businesses of all sizes.
            </Typography>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <Typography variant="small">
                  support@yourserviceapp.in
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-blue-500" />
                <Typography variant="small">+91 9470017395</Typography>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500" />
                <Typography variant="small">
                  123 Service St, City, Country
                </Typography>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              className="mb-4 text-blue-500 font-semibold"
            >
              Important Links
            </Typography>
            <ul className="space-y-2">
              {[
                {
                  name: "Become Services Provider",
                  link: "/become-service-provider",
                },
                {
                  name: "Services",
                  link: "/services",
                },
                {
                  name: "Support",
                  link: "/support",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.link}
                    className="hover:text-blue-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              className="mb-4 text-blue-500 font-semibold"
            >
              Our Services
            </Typography>
            <ul className="space-y-2">
              {topBookedServices.length > 0 ? (
                topBookedServices.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/services/${item?._id}`}
                      className="hover:text-blue-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))
              ) : (
                <Typography variant="small">
                  No services found, Enable location for services
                </Typography>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.hr variants={itemVariants} className="my-8 border-gray-300" />

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-between items-center"
        >
          <Typography variant="small" className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Yourserviceapp. All rights reserved.
          </Typography>
          <div className="flex gap-4">
            {[
              {
                icon: FaFacebookF,
                color: "bg-light-blue-600",
                link: "https://facebook.com",
              },
              {
                icon: FaInstagram,
                color: "bg-pink-500",
                link: "https://instagram.com",
              },
              {
                icon: FaLinkedinIn,
                color: "bg-blue-700",
                link: "https://linkedin.com",
              },
              {
                icon: FaWhatsapp,
                color: "bg-green-500",
                link: "https://whatsapp.com",
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                target="_blank"
                className={`${item.color} text-white p-2 no-underline rounded-full hover:opacity-80 transition-opacity`}
              >
                <item.icon size={16} />
              </Link>
            ))}
          </div>
        </motion.div>

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
            <span className="text-blue-500 font-semibold">Ghosting Tech</span>
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
