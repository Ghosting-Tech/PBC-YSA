"use client";

import { Button } from "@material-tailwind/react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  StethoscopeIcon,
} from "@heroicons/react/24/solid";
import { useRef } from "react";
import Link from "next/link";
import { LuStethoscope } from "react-icons/lu";
import Image from "next/image";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-[150vh]">
      {/* Hero Content */}
      <div className="sticky top-0 h-full overflow-hidden py-10">
        <motion.div className="h-full">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop"
              alt="Modern healthcare facility"
              width={1000}
              height={1000}
              className="w-full h-full object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl space-y-6 text-center sm:text-left">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mx-auto sm:mx-0"
                >
                  <LuStethoscope className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Modern Healthcare Solutions
                  </span>
                </motion.div>

                {/* Main Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-4"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white">
                    The Future of{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
                      Healthcare
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto sm:mx-0">
                    Experience revolutionary healthcare with cutting-edge
                    technology and compassionate care. Your well-being is our
                    priority.
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
                >
                  <Link
                    href="/become-service-provider"
                    className="no-underline"
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-teal-500 text-white w-full sm:w-auto"
                    >
                      Become a Provider
                    </Button>
                  </Link>
                  <Link href="/services" className="no-underline">
                    <Button
                      size="lg"
                      variant="outlined"
                      className="text-gray-300 border-gray-600 hover:bg-gray-800 w-full sm:w-auto"
                    >
                      Explore Services
                    </Button>
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
                >
                  {[
                    {
                      icon: <UserGroupIcon className="w-6 h-6" />,
                      label: "10k+",
                      sublabel: "Patients",
                    },
                    {
                      icon: <HeartIcon className="w-6 h-6" />,
                      label: "24/7",
                      sublabel: "Care",
                    },
                    {
                      icon: <ShieldCheckIcon className="w-6 h-6" />,
                      label: "100%",
                      sublabel: "Secure",
                    },
                    {
                      icon: <LuStethoscope className="w-6 h-6" />,
                      label: "100+",
                      sublabel: "Providers",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-teal-500/10 rounded-xl blur-lg group-hover:blur-2xl transition-all duration-300" />
                      <div className="relative p-4 rounded-xl border border-gray-700 bg-gray-900/50">
                        <div className="text-purple-400 mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white">
                          {stat.label}
                        </div>
                        <div className="text-sm text-gray-400">
                          {stat.sublabel}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
