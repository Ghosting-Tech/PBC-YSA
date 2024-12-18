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

export function LeaveServiceDialog({ isOpen, onClose, onLeave }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    const filteredFiles = newFiles.filter(
      (file) =>
        !uploadedFiles.some((existingFile) => existingFile.name === file.name)
    );
    setUploadedFiles([...uploadedFiles, ...filteredFiles]);
  };

  const removeFile = (fileToRemove) => {
    setUploadedFiles(uploadedFiles.filter((file) => file !== fileToRemove));
  };

  const handleLeave = async () => {
    if (reason.trim() === "") {
      toast.error("Please provide a reason for leaving");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare form data for API submission
      const formData = new FormData();
      formData.append("reason", reason);
      uploadedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      // Call your API to submit the leave reason and documents
      await onLeave(formData);

      // Reset state and close dialog
      setReason("");
      setUploadedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error submitting leave service request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="md"
      className="bg-white shadow-2xl rounded-lg h-[90vh] overflow-y-auto no-scrollbar"
    >
      <DialogHeader className="flex flex-col items-start p-4">
        <Typography variant="h4" color="red" className="mb-2">
          Abandon Booking
        </Typography>
      </DialogHeader>

      <DialogBody divider className="space-y-4">
        {/* Warning Alert */}
        <Alert
          color="red"
          variant="gradient"
          icon={<XMarkIcon className="h-6 w-6" />}
          className="mb-4"
        >
          <strong>Important Notice:</strong>
          <br />
          By leaving this service, you will lose the all access for current
          booking
        </Alert>

        {/* Reason Textarea */}
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

        {/* Document Upload Section */}
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-center mb-4">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button
                variant="outlined"
                color="blue-gray"
                size="md"
                className="flex items-center"
                onClick={() => fileInputRef.current.click()}
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Upload Supporting Documents
              </Button>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 ? (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <DocumentIcon className="h-6 w-6 mr-2 text-blue-gray-500" />
                      <Typography variant="small" color="blue-gray">
                        {file.name}
                      </Typography>
                    </div>
                    <Button
                      variant="text"
                      color="red"
                      size="sm"
                      onClick={() => removeFile(file)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="small" color="gray" className="text-center">
                No documents uploaded. Optional supporting files can be added
                here.
              </Typography>
            )}
          </CardBody>
        </Card>
      </DialogBody>

      <DialogFooter className="space-x-2 p-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
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
  );
}
