"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  MapPinIcon,
  BuildingOffice2Icon,
  GlobeAsiaAustraliaIcon,
} from "@heroicons/react/24/solid";
import { toast } from "sonner";
import axios from "axios";
import locationData from "@/assets/location.json";
import {
  setTopBookedServices,
  setTopBookedServicesLoading,
} from "@/redux/slice/topBookedServicesSlice";
import {
  setCityState,
  setGeolocationDenied,
} from "@/redux/slice/locationSlice";
import CurrentLocationButton from "./CurrentLocationButton";
import PopularCities from "./PopularCities";

const fetchServices = async (cityState) => {
  try {
    const response = await axios.post(
      "/api/services/top-booked?limit=100",
      cityState
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching top services:", error);
    throw error;
  }
};

const ChangeCity = ({ handleLocationDialog }) => {
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedCity, setSelectedCity] = useState("Patna");
  const [currentCity, setCurrentCity] = useState("Patna");
  const [previousLocation, setPreviousLocation] = useState({ state: "Bihar", city: "Patna" });
  const [showNoServiceDialog, setShowNoServiceDialog] = useState(false);
  const [noServiceLocation, setNoServiceLocation] = useState({ city: "", state: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    const storedCityState = JSON.parse(
      localStorage.getItem("cityState") || "{}"
    );
    const defaultState = storedCityState.state || "Bihar";
    const defaultCity = storedCityState.city || "Patna";
    
    setCurrentCity(defaultCity);
    setSelectedState(defaultState);
    setSelectedCity(defaultCity);
    setPreviousLocation({ state: defaultState, city: defaultCity });
  }, []);

  useEffect(() => {
    if (selectedState) {
      setCities(locationData[selectedState] || []);
      setSelectedCity(locationData[selectedState]?.[0] || "");
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleLocationChange = useCallback(
    async (cityState) => {
      const state = cityState.state || selectedState;
      const city = cityState.city || selectedCity;
      if (state && city) {
        setPreviousLocation({ state: selectedState, city: selectedCity });
        
        const cityState = { state, city };
        try {
          dispatch(setTopBookedServicesLoading(true));
          const response = await fetchServices(cityState);
          
          if (response?.data && Array.isArray(response.data)) {
            if (response.data.length === 0) {
              setNoServiceLocation({ city, state });
              setShowNoServiceDialog(true);
              // Revert to previous location
              setSelectedState(previousLocation.state);
              setSelectedCity(previousLocation.city);
              return;
            }
            // Only update Redux and localStorage if services are found
            dispatch(setCityState(cityState));
            localStorage.setItem("cityState", JSON.stringify(cityState));
            toast.success(`City changed successfully to ${city}`);
            handleLocationDialog();
            dispatch(setTopBookedServices(response.data));
            dispatch(setGeolocationDenied(false));
          } else {
            toast.error("Unable to fetch services for this location");
          }
        } catch (error) {
          console.error("Error fetching top services:", error);
          toast.error(error?.response?.data?.message || "Failed to fetch services for this location");
        } finally {
          dispatch(setTopBookedServicesLoading(false));
        }
      }
    },
    [selectedState, selectedCity, previousLocation, dispatch, handleLocationDialog]
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <motion.div
        className="flex justify-center items-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full max-w-full p-4">
          <CardHeader
            color="purple"
            className="relative h-28 flex items-center justify-center"
          >
            <Typography
              variant="h3"
              color="white"
              className="font-cookie text-4xl"
            >
              Select Your City
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-red-500">
              <MapPinIcon className="h-5 w-5" />
              <Typography color="purple-gray">
                Current City: {currentCity}
              </Typography>
            </div>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select State</option>
                {Object.keys(locationData).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex gap-1 items-center px-2 pointer-events-none">
                <GlobeAsiaAustraliaIcon className="h-5 w-5 text-gray-400" />
                State
              </div>
            </div>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex gap-1 items-center px-2 pointer-events-none">
                <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
                City
              </div>
            </div>
            <CurrentLocationButton onLocationSet={handleLocationChange} />
            <PopularCities
              onCitySelect={(city, state) => {
                setSelectedState(state);
                setSelectedCity(city);
              }}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              onClick={() => handleLocationChange({ state: selectedState, city: selectedCity })}
              disabled={!selectedState || !selectedCity}
              className="flex items-center justify-center gap-2"
            >
              <MapPinIcon className="h-5 w-5" />
              Confirm Location
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* No Service Dialog */}
      <Dialog 
        open={showNoServiceDialog} 
        handler={() => setShowNoServiceDialog(false)}
        size="sm"
      >
        <DialogHeader className="flex items-center gap-2">
          <MapPinIcon className="h-6 w-6 text-red-500" />
          <Typography variant="h5">Service Not Available</Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <Typography className="text-center text-gray-700">
            We're sorry, but our services are not yet available in{" "}
            <span className="font-bold">{noServiceLocation.city}</span>, {noServiceLocation.state}.
          </Typography>
          <Typography className="text-center text-gray-600">
            We are working on expanding our services to more locations. Meanwhile, please select a different city.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="gradient"
            color="purple"
            onClick={() => setShowNoServiceDialog(false)}
          >
            OK, I'll select another city
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ChangeCity;