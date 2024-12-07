"use client";

import React, { useState } from "react";
import { Typography, Chip } from "@material-tailwind/react";

const popularCities = [
  { city: "Patna", state: "Bihar" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Chennai", state: "Tamil Nadu" },
];

const PopularCities = ({ onCitySelect }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (city, state) => {
    setSelectedCity(city);
    onCitySelect(city, state);
  };

  return (
    <div>
      <Typography variant="h6" color="blue-gray" className="mb-2">
        Popular Cities
      </Typography>
      <div className="flex flex-wrap gap-2">
        {popularCities.map(({ city, state }) => (
          <Chip
            key={city}
            value={city}
            onClick={() => handleCitySelect(city, state)}
            className={`cursor-pointer transition-colors ${
              selectedCity === city
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularCities;
