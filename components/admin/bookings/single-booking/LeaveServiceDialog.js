import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Textarea,
  Card,
  CardBody,
  Alert,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  CheckIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { toast } from "sonner";
import uploadImage from "@/utils/uploadImage";

export function LeaveServiceDialog({ isOpen, setIsOpen, id }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const from = "service-provider";
  const category = "important";
  const title = "Abandon Booking";
  const url = `/admin/bookings/${id}`;
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleLeave = async (event) => {
    event.preventDefault();
    if (reason.trim() === "") {
      toast.error("Please provide a reason for leaving");
      return;
    }

    const filesData = uploadedFile
      ? await uploadImage(uploadedFile, "notification")
      : null;
    const payload = {
      description: reason,
      from,
      category,
      title,
      url,
      image: { url: filesData?.url, name: filesData?.name },
    };

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      if (res.ok) {
        setReason("");
        setUploadedFile(null);
        toast.success("Request sent successfully");
        setShowConfirmation(true);
        setIsOpen(false);
      } else {
        throw new Error(response.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting leave service request:", error);
      toast.error("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog
        open={isOpen}
        handler={() => setIsOpen(false)}
        size="md"
        className="bg-white shadow-2xl rounded-lg h-[90vh] overflow-y-auto no-scrollbar"
      >
        <DialogHeader className="flex flex-col items-start p-4">
          <Typography variant="h4" color="red" className="mb-2">
            Abandon Booking
          </Typography>
        </DialogHeader>

        <DialogBody divider className="space-y-4">
          <Alert
            color="red"
            variant="gradient"
            icon={<XMarkIcon className="h-6 w-6" />}
            className="mb-4"
          >
            <strong>Important Notice:</strong>
            <br />
            By leaving this service, you will lose all access to the current
            booking.
          </Alert>

          <div className="mb-4">
            <Textarea
              variant="outlined"
              label="Reason for Leaving"
              color="red"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed explanation for your departure"
              rows={4}
              className="w-full"
            />
          </div>

          <Card className="w-full">
            <CardBody>
              <div className="flex items-center justify-center mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.jpg,.jpeg,.png"
                />
                <Button
                  variant="outlined"
                  color="purple-gray"
                  size="md"
                  className="flex items-center"
                  onClick={() => fileInputRef.current.click()}
                >
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Upload Supporting Document
                </Button>
              </div>

              {uploadedFile ? (
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div className="flex items-center">
                    <DocumentIcon className="h-6 w-6 mr-2 text-purple-gray-500" />
                    <Typography variant="small" color="purple-gray">
                      {uploadedFile.name}
                    </Typography>
                  </div>
                  <Button
                    variant="text"
                    color="red"
                    size="sm"
                    onClick={removeFile}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Typography
                  variant="small"
                  color="gray"
                  className="text-center"
                >
                  No document uploaded. Optional supporting file can be added
                  here.
                </Typography>
              )}
            </CardBody>
          </Card>
        </DialogBody>

        <DialogFooter className="space-x-2 p-4">
          <Button
            variant="outlined"
            color="purple-gray"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Cancel
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={handleLeave}
            disabled={isSubmitting}
            className="flex items-center"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2" />
                Confirm Departure
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Confirmation Popup */}
      <Dialog
        open={showConfirmation}
        handler={handleConfirmationClose}
        size="sm"
        className="bg-white shadow-lg rounded-lg"
      >
        <DialogHeader className="p-4">
          <Typography variant="h5" color="green">
            Request Sent
          </Typography>
        </DialogHeader>
        <DialogBody className="p-4">
          <Typography variant="body1" color="gray">
            Your abandon-booking request has been sent to the admin. You will be
            removed from the current booking.
          </Typography>
        </DialogBody>
        <DialogFooter className="p-4">
          <Button
            variant="filled"
            color="purple-gray"
            onClick={handleConfirmationClose}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
