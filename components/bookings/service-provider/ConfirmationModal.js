"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          handler={onClose}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <DialogHeader>{title}</DialogHeader>
          <DialogBody>
            <p className="text-gray-700">{message}</p>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="purple-gray"
              onClick={onClose}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color={confirmColor} onClick={onConfirm}>
              <span>{confirmText}</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
