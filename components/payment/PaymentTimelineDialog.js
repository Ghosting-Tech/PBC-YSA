"use client";
import { useState, useEffect } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Card,
  CardBody,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Avatar,
} from "@material-tailwind/react";
import { FaMoneyBillWave, FaMoneyBillAlt } from "react-icons/fa";
import Image from "next/image";
import Loading from "../Loading";
import axios from "axios";
import { toast } from "sonner";
import formatDate from "@/utils/formatDate";
import { useSelector } from "react-redux";

export default function PaymentTimelineDialog({ paymentData, open, onClose }) {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const user = useSelector((state) => state.user.user);

  const fetchingData = async () => {
    try {
      const response = await axios.get(`/api/payment/${paymentData._id}`);
      setPayments(response.data);
    } catch (error) {
      toast.error("Error fetching payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentData?._id) {
      fetchingData();
    }
    // eslint-disable-next-line
  }, [paymentData?._id, paymentData]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        handler={onClose}
        size="lg"
        className="max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <DialogHeader>Payment Timeline</DialogHeader>
        <DialogBody divider className="p-4">
          {loading ? (
            <Loading />
          ) : (
            <Card className="w-full flex items-center justify-center shadow-none">
              <CardBody>
                <div className="flex items-center mb-6">
                  <Avatar
                    src={paymentData?.service_provider?.image?.url}
                    size="sm"
                  />
                  <Typography variant="h4" color="blue-gray" className="ml-4">
                    {paymentData?.service_provider?.name || "Service Provider"}
                  </Typography>
                </div>
                <Timeline>
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon className="bg-red-500">
                        <FaMoneyBillAlt className="h-4 w-4" />
                      </TimelineIcon>
                      <Typography variant="h6" color="blue-gray">
                        {user?.role === "admin"
                          ? "Payment Not Sent"
                          : "Payment Not Received"}
                      </Typography>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <Typography
                        color="gray"
                        className="font-normal text-gray-600"
                      >
                        {formatDate(paymentData.createdAt)}
                      </Typography>
                      <Typography
                        color="gray"
                        className="font-normal text-gray-600"
                      >
                        Amount: {paymentData.amount}
                      </Typography>
                    </TimelineBody>
                  </TimelineItem>
                  {payments?.statusUpdates?.map((status, index) => (
                    <TimelineItem key={status.id}>
                      {index !== payments.statusUpdates.length - 1 && (
                        <TimelineConnector />
                      )}
                      <TimelineHeader>
                        <TimelineIcon
                          className={
                            status.paid ? "bg-green-500" : "bg-red-500"
                          }
                        >
                          {status.paid ? (
                            <FaMoneyBillWave className="h-4 w-4" />
                          ) : (
                            <FaMoneyBillAlt className="h-4 w-4" />
                          )}
                        </TimelineIcon>
                        <Typography variant="h6" color="blue-gray">
                          {user?.role === "admin"
                            ? status.paid
                              ? "Payment Sent"
                              : "Payment Not Sent"
                            : status.paid
                            ? "Payment Received"
                            : "Payment Not Received"}
                        </Typography>
                      </TimelineHeader>
                      <TimelineBody className="pb-8">
                        <Typography
                          color="gray"
                          className="font-normal text-gray-600"
                        >
                          {formatDate(status.timestamp)}
                        </Typography>
                        <Typography
                          color="gray"
                          className="font-normal text-gray-600"
                        >
                          Amount: {payments.amount}
                        </Typography>
                        {status.reason && (
                          <Typography color="red" className="font-normal mt-2">
                            Reason: {status.reason}
                          </Typography>
                        )}
                        {status.screenshot && (
                          <div className="mt-4">
                            <Typography
                              color="gray"
                              className="font-normal mb-2"
                            >
                              Payment Screenshot:
                            </Typography>
                            <Image
                              src={status.screenshot}
                              alt="Payment Screenshot"
                              width={200}
                              height={200}
                              className="rounded-lg shadow-lg cursor-pointer"
                              onClick={() =>
                                handleImageClick(status.screenshot)
                              }
                            />
                          </div>
                        )}
                      </TimelineBody>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardBody>
            </Card>
          )}
        </DialogBody>
        <DialogFooter className="sticky bottom-0">
          <Button variant="text" color="red" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
      {/* Image Modal */}
      <Dialog
        open={imageModalOpen}
        handler={handleImageModalClose}
        size="xl"
        className="max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <DialogHeader>Payment Screenshot</DialogHeader>
        <DialogBody divider className="p-4 flex justify-center">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Enlarged Payment Screenshot"
              width={600}
              height={600}
              className="rounded-lg shadow-lg"
            />
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleImageModalClose}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
