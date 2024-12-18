"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Input,
  Button,
  Typography,
  Radio,
  Textarea,
  Chip,
  ListItem,
  List,
  ListItemPrefix,
} from "@material-tailwind/react";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export function CheckoutForm({
  formData,
  setFormData,
  onNextStep,
  location,
  setLocation,
}) {
  const [dates, setDates] = useState([]);
  const user = useSelector((state) => state.user.user);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fourDays = getFourDays();
    setDates(fourDays);
    setFormData((prev) => ({
      ...prev,
      fullname: user.name || "",
      phoneNumber: user.phoneNumber || "",
      date: fourDays[0],
    }));
  }, [user, setFormData]);

  // Function to generate the four days including the current date
  const getFourDays = () => {
    const today = new Date();
    const fourDaysArray = [today];

    for (let i = 1; i < 4; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      fourDaysArray.push(nextDate);
    }

    return fourDaysArray.map((date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        e.target.value = null;
        return;
      }
      setFormData((prev) => ({ ...prev, prescription: file }));
    }
  };

  const searchBoxRef = useRef(null);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const newLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    getAddress(newLocation);
    setLocation(newLocation);
  };

  const getAddress = async (location) => {
    if (!location) return; // Early return to avoid unnecessary calls

    const { lat, lng } = location;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    if (!response.ok) toast.error("Failed to fetch address");

    const data = await response.json();
    const formattedAddress =
      data.results?.[0]?.formatted_address || "Unknown Address";

    setFormData((prev) => ({ ...prev, address: formattedAddress }));
  };

  const validateForm = () => {
    if (!formData.fullname || formData.fullname.length < 4) {
      toast.error("Please enter a valid full name (at least 4 characters)");
      return false;
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!formData.address) {
      toast.error("Please enter a valid address");
      return false;
    }
    if (!formData.date) {
      toast.error("Please select a delivery date");
      return false;
    }
    if (!formData.time) {
      toast.error("Please select a delivery time");
      return false;
    }
    if (!formData.patientCondition) {
      toast.error("Please enter the patient's condition");
      return false;
    }
    return true;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${parseFloat(hours)}:${parseFloat(minutes) + 10}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-xl shadow-lg"
    >
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Delivery Details
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!validateForm()) {
            return;
          }
          if (formData.time <= getCurrentTime()) {
            toast.warning(
              "Kindly choose a time that is at least 10 minutes from now."
            );
            return;
          }
          onNextStep();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
            className="bg-gray-50"
          />
          <Input
            label="Phone number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            pattern="\d{10}"
            className="bg-gray-50"
          />
        </div>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="bg-gray-50"
            />
          </StandaloneSearchBox>
        </LoadScript>
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Delivery Date
          </Typography>
          <List className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dates.map((date) => (
              <ListItem className="p-0" key={date}>
                <label
                  htmlFor={date}
                  className="flex w-full cursor-pointer items-center px-3 py-2"
                >
                  <ListItemPrefix className="mr-3">
                    <Radio
                      id={date}
                      className="hover:before:opacity-0"
                      containerProps={{
                        className: "p-0",
                      }}
                      key={date}
                      name="date"
                      value={date}
                      onChange={handleChange}
                      checked={formData.date === date}
                      color="teal"
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="font-medium text-blue-gray-400"
                  >
                    {date}
                  </Typography>
                </label>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Delivery Time
            </Typography>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
            <Typography variant="small" color="gray" className="mt-1">
              Please select a time between 8:00 AM and 8:00 PM
            </Typography>
          </div>
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Patient&apos;s Condition
            </Typography>
            <Textarea
              name="patientCondition"
              value={formData.patientCondition}
              onChange={handleChange}
              required
              label="Briefly describe the patient's condition"
            />
          </div>
        </div>
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Upload Prescription
          </Typography>
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <Button
              color="teal"
              variant="outlined"
              className="w-full h-32 flex flex-col items-center justify-center border-dashed"
              onClick={() => fileInputRef.current.click()}
            >
              <CloudArrowUpIcon className="h-8 w-8 mb-2" />
              <span>Click to upload or drag and drop</span>
              <span className="text-xs text-gray-600">
                PDF, JPG, JPEG, or PNG (max. 5MB)
              </span>
            </Button>
            <AnimatePresence>
              {formData.prescription && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-2 left-2"
                >
                  <Chip
                    value={formData.prescription.name}
                    onClose={() =>
                      setFormData((prev) => ({ ...prev, prescription: null }))
                    }
                    className="bg-teal-100 text-teal-700"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Button type="submit" color="teal" ripple className="w-full">
          Continue to Confirmation
        </Button>
      </form>
    </motion.div>
  );
}
