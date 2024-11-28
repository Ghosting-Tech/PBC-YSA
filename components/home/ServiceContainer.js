"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, Button } from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import TopServices from "./TopServices";
import locationData from "@/assets/location.json";
import { useSelector } from "react-redux";
import ServiceCard from "./ServiceCard";

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

  const selectVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
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
          <Card className="w-11/12 md:w-3/5 shadow-lg mt-8 p-6 pt-0 mx-auto">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-4 grid h-28 place-items-center"
            >
              <motion.div
                className="text-7xl font-cookie"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Select City
              </motion.div>
            </CardHeader>
            <motion.div
              className="flex gap-4 flex-col md:flex-row"
              variants={containerVariants}
            >
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full sm:w-4/6">
                <motion.div className="relative w-full" variants={itemVariants}>
                  <motion.select
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full md:w-64"
                    name="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    required
                    variants={selectVariants}
                    whileHover="hover"
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {Object.keys(locationData).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </motion.select>
                  <motion.div
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                    animate={{ rotate: selectedState ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.div>
                </motion.div>

                <motion.div className="relative w-full" variants={itemVariants}>
                  <motion.select
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full md:w-64"
                    name="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    required
                    variants={selectVariants}
                    whileHover="hover"
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </motion.select>
                  <motion.div
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                    animate={{ rotate: selectedCity ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="gradient"
                  fullWidth
                  size="md"
                  onClick={handleLocationChange}
                  disabled={!selectedState || !selectedCity}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <MapPinIcon className="h-5 w-5" />
                  </motion.div>
                  Confirm Location
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
