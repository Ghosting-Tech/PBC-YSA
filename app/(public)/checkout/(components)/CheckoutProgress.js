"use client";

import React from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  CheckIcon,
  ClipboardIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export function CheckoutProgress({ currentStep }) {
  const steps = [
    { label: "Details", icon: ClipboardIcon },
    { label: "Confirmation", icon: CheckIcon },
    { label: "Payment", icon: CreditCardIcon },
  ];

  return (
    <div className="w-full pb-4 hidden md:block">
      <Stepper
        activeStep={currentStep - 1}
        lineClassName="h-0.5 bg-gray-300"
        activeLineClassName="bg-gray-800"
      >
        {steps.map((step, index) => (
          <Step
            key={step.label}
            className={`h-8 w-8 cursor-pointer ${
              index < currentStep
                ? "bg-[var(--color)] text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-full grid place-items-center relative`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <step.icon className="h-4 w-4" />
            </motion.div>
            <div className="absolute -bottom-8 w-max text-center">
              <Typography
                variant="small"
                color={index < currentStep ? "purple" : "gray"}
                className="font-bold"
              >
                {step.label}
              </Typography>
            </div>
            {index < currentStep && (
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-[var(--color)] opacity-20"></span>
              </motion.div>
            )}
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
