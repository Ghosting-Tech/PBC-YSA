import React, { useState } from "react";
import UserDetail from "./UserDetail";
import AssignServiceProvider from "./AssignServiceProvider";
import { Avatar } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { FaPray, FaVenusMars } from "react-icons/fa";
import { IconButton } from "@material-tailwind/react";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@material-tailwind/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Alert } from "@material-tailwind/react";

const AvailableServiceProviders = ({
  availableServiceProviders,
  booking,
  setBooking,
}) => {
  const [providerToTerminate, setProviderToTerminate] = useState(null);

  const handleTerminate = async (serviceProviderId) => {
    const response = await axios.post(
      "/api/admin/bookings/terminate-provider",
      {
        bookingId: booking._id,
        serviceProviderId,
        assignedServiceProvider: booking?.assignedServiceProviders?._id,
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      setBooking(response.data.booking);
      setProviderToTerminate(null);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-2">
          Available Service providers
        </h3>
        <AssignServiceProvider
          bookingId={booking._id}
          setBooking={setBooking}
          booking={booking}
        />
      </div>
      <span className="text-sm text-gray-600">
        {availableServiceProviders?.length === 0 ? (
          "No service provider available"
        ) : (
          <div className="flex flex-wrap gap-4 mt-4">
            {availableServiceProviders?.map((sp, index) => {
              return (
                <div
                  key={sp._id}
                  className="flex flex-grow items-start justify-between bg-white py-4 px-2 rounded-lg gap-4"
                >
                  <Link
                    href={`/admin/service-providers/details/${sp._id}`}
                    className="flex items-center gap-4 mb-4"
                  >
                    <Avatar
                      size="md"
                      alt={sp.name}
                      src={
                        sp.image?.url ||
                        `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${sp.name}`
                      }
                      className="border border-purple-500 ring-4 ring-purple-500/40"
                    />
                    <div>
                      <Typography
                        variant="h5"
                        color="purple-gray"
                        className="mb-1"
                      >
                        {sp.name}
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal opacity-75"
                        >
                          <span className="flex items-center gap-1">
                            <FaVenusMars className="text-[var(--color)] " />
                            {sp.gender}
                          </span>
                        </Typography>
                      </div>
                    </div>
                  </Link>
                  <IconButton
                    variant="text"
                    color="red"
                    size="sm"
                    onClick={() => setProviderToTerminate(sp)}
                  >
                    <RxCross1 />
                  </IconButton>
                </div>
              );
            })}
          </div>
        )}
      </span>
      {providerToTerminate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <div className="flex items-center justify-between">
              <Typography variant="h5" color="purple-gray">
                Confirm Termination
              </Typography>
              <Button
                variant="text"
                color="purple-gray"
                onClick={() => setProviderToTerminate(null)}
                className="p-2"
              >
                <XMarkIcon strokeWidth={2} className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid gap-4 my-4">
              {booking?.assignedServiceProviders?._id ===
                providerToTerminate._id && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    color="amber"
                    icon={<ExclamationTriangleIcon className="h-6 w-6" />}
                  >
                    You are about to terminate the assigned service provider for
                    this booking.
                  </Alert>
                </motion.div>
              )}
              <Typography color="gray" className="font-normal">
                Are you sure you want to terminate{" "}
                <Link
                  href={`/admin/service-providers/details/${providerToTerminate._id}`}
                  className="font-semibold underline"
                  target="_blank"
                >
                  {providerToTerminate.name}
                </Link>{" "}
                from this booking?
              </Typography>
              <Typography color="gray" className="font-normal">
                This action will remove {providerToTerminate.name} from the
                booking and update the service provider&apos;s availability.
              </Typography>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outlined"
                color="purple-gray"
                onClick={() => setProviderToTerminate(null)}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                color="red"
                onClick={() => handleTerminate(providerToTerminate._id)}
              >
                Confirm Termination
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AvailableServiceProviders;
