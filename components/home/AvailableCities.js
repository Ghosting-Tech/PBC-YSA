"use client";

import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCity, FaArrowRight } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { Button, Card, Typography, Input } from "@material-tailwind/react";
import Link from "next/link";

const cities = [
  {
    name: "Patna",
    icon: <FaCity className="h-6 w-6" />,
    description: "Historical City",
  },
  {
    name: "Kolkata",
    icon: <MdLocationCity className="h-6 w-6" />,
    description: "City of Joy",
  },
  {
    name: "Chennai",
    icon: <FaCity className="h-6 w-6" />,
    description: "Gateway of South India",
  },
  {
    name: "Mumbai",
    icon: <MdLocationCity className="h-6 w-6" />,
    description: "City of Dreams",
  },
  {
    name: "Delhi",
    icon: <FaCity className="h-6 w-6" />,
    description: "Heart of India",
  },
  {
    name: "Indore",
    icon: <MdLocationCity className="h-6 w-6" />,
    description: "Cleanest City",
  },
  {
    name: "Lucknow",
    icon: <FaCity className="h-6 w-6" />,
    description: "City of Nawabs",
  },
];

export default function CitySelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6E4BB2]/10 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-3 rounded-full bg-[#6E4BB2]/10 mb-4"
          >
            <FaMapMarkerAlt className="h-8 w-8 text-[#6E4BB2]" />
          </motion.div>
          <Typography
            variant="h1"
            className="text-4xl font-bold text-[#6E4BB2]"
          >
            Available Cities
          </Typography>
          <Typography
            variant="paragraph"
            className="text-gray-600 max-w-xl mx-auto"
          >
            Discover our services across major cities in India. According to
            your city, you can begin your journey with us.
          </Typography>
        </div>
        {/* Cities Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card className="p-6 cursor-pointer group hover:shadow-lg transition-all duration-300 hover:border-[#6E4BB2]">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#6E4BB2]/10 group-hover:bg-[#6E4BB2]/20 transition-colors">
                    {city.icon}
                  </div>
                  <div className="space-y-1">
                    <Typography
                      variant="h6"
                      className="text-[#6E4BB2] font-semibold"
                    >
                      {city.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {city.description}
                    </Typography>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link href="/services" className="no-underline">
            <Button
              size="lg"
              className="bg-[#6E4BB2] hover:bg-[#6E4BB2]/90 shadow-lg hover:shadow-[#6E4BB2]/20 flex items-center gap-2 mx-auto"
            >
              <span>Explore Services</span>
              <FaArrowRight className="h-4 w-4 animate-bounce-x" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
