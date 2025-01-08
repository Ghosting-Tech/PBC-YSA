import React from "react";
import { motion } from "framer-motion";
import { Typography, Button } from "@material-tailwind/react";
import Image from "next/image";
import { ArrowLeftIcon, CheckIcon, CreditCardIcon } from "lucide-react";

export function CheckoutConfirmation({
  formData,
  onPrevStep,
  onSubmit,
  redirectingLoading,
  disableRedirectingButton,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <Typography variant="h4" className="mb-4 text-[var(--color)]">
        Confirm Your Order
      </Typography>
      <div className="space-y-4">
        <div>
          <Typography variant="h6" color="purple-gray">
            Full Name
          </Typography>
          <Typography color="gray">{formData.fullname}</Typography>
        </div>
        <div>
          <Typography variant="h6" color="purple-gray">
            Phone Number
          </Typography>
          <Typography color="gray">{formData.phoneNumber}</Typography>
        </div>
        <div>
          <Typography variant="h6" color="purple-gray">
            Delivery Address
          </Typography>
          <Typography color="gray">{formData.address}</Typography>
        </div>
        <div>
          <Typography variant="h6" color="purple-gray">
            Delivery Date
          </Typography>
          <Typography color="gray">
            {new Date(formData.date).toLocaleDateString()}
          </Typography>
        </div>
        <div>
          <Typography variant="h6" color="purple-gray">
            Delivery Time
          </Typography>
          <Typography color="gray">{formData.time}</Typography>
        </div>
        <div>
          <Typography variant="h6" color="purple-gray">
            Patient&apos;s Condition
          </Typography>
          <Typography color="gray">{formData.patientCondition}</Typography>
        </div>
        <div>
          <Typography variant="h6" color="purple-gray">
            Patient&apos;s prescription
          </Typography>
          {formData.prescription ? (
            <div className="flex flex-col gap-2">
              <Image
                src={URL.createObjectURL(formData.prescription)}
                alt="prescription"
                width={100}
                height={100}
                className="rounded-lg w-32 aspect-square object-cover"
              />
            </div>
          ) : (
            <Typography color="gray">No prescription uploaded</Typography>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          color="gray"
          className="flex items-center gap-2"
          variant="text"
          onClick={onPrevStep}
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
        <Button
          className="flex items-center gap-2 bg-[var(--color)] hover:bg-[var(--hover)] text-white"
          disabled={disableRedirectingButton}
          loading={redirectingLoading}
          onClick={onSubmit}
        >
          Confirm & Pay <CreditCardIcon className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
