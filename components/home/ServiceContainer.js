"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Select,
  Option,
  Button,
  Card,
  Typography,
} from "@material-tailwind/react";
import TopServices from "./TopServices";
import ServiceCard from "./ServiceCard";
import locationData from "@/assets/location.json";
import { useSelector } from "react-redux";

export default function ServiceContainer({
  selectedState,
  selectedCity,
  setSelectedState,
  setSelectedCity,
  handleLocationChange,
  forAllService = false,
}) {
  const [cities, setCities] = useState([]);

  const geolocationDenied = useSelector(
    (state) => state.location.geolocationDenied
  );

  const topServices = useSelector((state) => state.topServices.services);

  useEffect(() => {
    if (selectedState) {
      setCities(locationData[selectedState] || []);
      setSelectedCity(locationData[selectedState]?.[0] || "");
    } else {
      setCities([]);
    }
  }, [selectedState, setSelectedCity]);

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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-transparent text-white"
    >
      {!geolocationDenied && topServices?.length !== 0 ? (
        forAllService ? (
          <motion.div
            className="container mx-auto lg:p-6 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8"
            variants={containerVariants}
          >
            <AnimatePresence>
              {topServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <TopServices topServices={topServices} />
        )
      ) : (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center min-h-[60vh]"
        >
          <Card className="w-11/12 md:w-3/5 mt-8 p-8 mx-auto bg-opacity-80 bg-white shadow-lg border border-blue-gray-700">
            <motion.div
              className="text-4xl md:text-5xl font-bold text-center mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h2" color="blue-gray">
                Select Your Location
              </Typography>
            </motion.div>
            <motion.div
              className="flex gap-6 flex-col md:flex-row"
              variants={containerVariants}
            >
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 w-full">
                <motion.div className="relative w-full" variants={itemVariants}>
                  <Select
                    label="Select State"
                    value={selectedState}
                    onChange={(value) => setSelectedState(value)}
                    required
                    color="blue"
                  >
                    {Object.keys(locationData).map((state) => (
                      <Option key={state} value={state}>
                        {state}
                      </Option>
                    ))}
                  </Select>
                </motion.div>

                <motion.div className="relative w-full" variants={itemVariants}>
                  <Select
                    label="Select City"
                    value={selectedCity}
                    onChange={(value) => setSelectedCity(value)}
                    required
                    disabled={!selectedState}
                    color="blue"
                  >
                    {cities.map((city) => (
                      <Option key={city} value={city}>
                        {city}
                      </Option>
                    ))}
                  </Select>
                </motion.div>
              </div>

              <Button
                onClick={handleLocationChange}
                disabled={!selectedState || !selectedCity}
                variant="gradient"
                color="blue"
                size="lg"
                className="flex items-center gap-2 justify-center"
              >
                <MapPinIcon className="h-5 w-5" />
                Confirm Location
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
