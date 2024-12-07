"use client";

import React from "react";
import { Button } from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";

const CurrentLocationButton = ({ onLocationSet }) => {
  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const city = data.results[0].address_components.find(
                (component) => component.types.includes("locality")
              )?.long_name;
              const state = data.results[0].address_components.find(
                (component) =>
                  component.types.includes("administrative_area_level_1")
              )?.long_name;
              onLocationSet({ city, state });
            } else {
              throw new Error("Address not found");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            throw error;
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Button
      variant="outlined"
      color="blue"
      className="flex items-center justify-center gap-2"
      onClick={handleGetCurrentLocation}
    >
      <MapPinIcon className="h-5 w-5" />
      Use Current Location
    </Button>
  );
};

export default CurrentLocationButton;
