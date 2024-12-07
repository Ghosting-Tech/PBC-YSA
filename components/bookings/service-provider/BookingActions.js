"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button, Typography } from "@material-tailwind/react";
import ConfirmationModal from "./ConfirmationModal";

const BookingActions = ({
  booking,
  handleAcceptRequest,
  handleRejectRequest,
}) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (booking?.acceptedByServiceProvider) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200"
      >
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <Typography variant="h6" color="deep-orange">
                New Booking Request
              </Typography>
              <Typography variant="small" color="gray">
                Please accept or reject this booking request
              </Typography>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button
                variant="outlined"
                color="red"
                className="flex-1 sm:flex-none px-6 py-2 flex items-center justify-center"
                onClick={() => setShowRejectModal(true)}
              >
                <FaTimesCircle className="mr-2" />
                Reject
              </Button>
              <Button
                variant="gradient"
                color="green"
                className="flex-1 sm:flex-none px-6 py-2 flex items-center justify-center"
                onClick={() => setShowAcceptModal(true)}
              >
                <FaCheckCircle className="mr-2" />
                Accept
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={() => {
          handleAcceptRequest(booking._id);
          setShowAcceptModal(false);
        }}
        title="Accept Booking"
        message="Are you sure you want to accept this booking request?"
        confirmText="Yes, Accept"
        confirmColor="green"
      />

      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={() => {
          handleRejectRequest(booking._id);
          setShowRejectModal(false);
        }}
        title="Reject Booking"
        message="Are you sure you want to reject this booking request?"
        confirmText="Yes, Reject"
        confirmColor="red"
      />
    </AnimatePresence>
  );
};

export default BookingActions;
