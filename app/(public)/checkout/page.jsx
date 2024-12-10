"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckoutSummary } from "./(components)/CheckoutSummary";
import { CheckoutForm } from "./(components)/CheckoutForm";
import { CheckoutProgress } from "./(components)/CheckoutProgress";
import { CheckoutConfirmation } from "./(components)/CheckoutConfirmation";
import { useLocalStorage } from "@/components/common/LocalStorageWrapper";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/slice/userSlice";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    address: "",
    date: "",
    time: "",
  });
  const [location, setLocation] = useState(null);

  const cartItems = useLocalStorage("cart", []);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
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
    if (!location) {
      toast.error("location is required!");
      return false;
    }
    return true;
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const [redirectingLoading, setRedirectingLoading] = useState(false);
  const [disableRedirectingButton, setDisableRedirectingButton] =
    useState(false);
  const [redirectingButtonClicked, setRedirectingButtonClicked] = useState(0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (redirectingButtonClicked > 2) {
      setDisableRedirectingButton(true);
      toast.warning("Too many attempts. Please try again later.");
      return;
    }

    setRedirectingLoading(true);
    setRedirectingButtonClicked((prev) => prev + 1);

    try {
      const postData = {
        formData,
        location,
        cartItems,
        user,
      };

      const response = await axios.post("/api/bookings", postData);

      if (response.status === 201) {
        const booking = response.data.booking;
        dispatch(setUser(response.data.updatedUser));

        // Initiate payment separately after booking is created
        const amount = (
          booking.cartItems.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
          ) + 18
        ).toFixed(2);

        const paymentResponse = await axios.post(
          `/api/payments/initiate-payment`,
          {
            bookingId: booking._id,
            amount,
            userId: user._id,
            userPhoneNumber: booking.phoneNumber,
            invoice: false,
          }
        );

        if (paymentResponse.data.success) {
          const phonePeRedirectUrl =
            paymentResponse.data.data.instrumentResponse.redirectInfo.url;
          router.push(phonePeRedirectUrl);
        } else {
          toast.error(
            paymentResponse.data.message || "Payment initiation failed."
          );
        }

        // Clear cart after successful booking
        // setCart([]);
      } else {
        const errorMessage = response.data?.error;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log("Error in submitting order:", error);
      toast.error(
        error.response.data.message ||
          "An error occurred while placing the order."
      );
    } finally {
      setRedirectingLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-100 py-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <CheckoutProgress currentStep={step} />
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="form"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "tween", duration: 0.5 }}
                >
                  <CheckoutForm
                    formData={formData}
                    setFormData={setFormData}
                    onNextStep={handleNextStep}
                    location={location}
                    setLocation={setLocation}
                  />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="confirmation"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ type: "tween", duration: 0.5 }}
                >
                  <CheckoutConfirmation
                    formData={formData}
                    onPrevStep={handlePrevStep}
                    onSubmit={handleSubmitOrder}
                    redirectingLoading={redirectingLoading}
                    disableRedirectingButton={disableRedirectingButton}
                  />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                      Thank you for your order!
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                      Your order has been placed successfully. We'll send you a
                      confirmation email shortly.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="lg:col-span-2">
            <CheckoutSummary cartItems={cartItems[0]} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
