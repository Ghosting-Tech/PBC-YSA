"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";
import BookingDetail from "@/components/bookings/service-provider/BookingDetail";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player";

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        if (!response.ok) {
          toast.error(`Error fetching booking!`);
        }
        const data = await response.json();
        console.log(data);
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setBooking(data.booking);
      } catch (error) {
        toast.error(`Error fetching booking!`);
        console.log("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const [noLongerHaveAccess, setNoLongerHaveAccess] = useState(false);
  // useEffect(() => {
  //   if (booking && booking.assignedServiceProviders && user) {
  //     if (booking.assignedServiceProviders._id == user._id) {
  //       setNoLongerHaveAccess(false);
  //     }
  //   }
  // }, [booking, user]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-lg font-semibold animate-spin my-56">
            <VscLoading size={50} />
          </div>
        </div>
      ) : noLongerHaveAccess ? (
        <div className="flex items-center justify-center my-12 bg-gray-100">
          <Card className="w-full max-w-[500px] mx-4">
            <CardBody className="flex flex-col items-center text-center">
              <div className="relative w-64 h-64 mb-6">
                <Player
                  autoplay
                  loop
                  keepLastFrame={true}
                  src="/lottie/access-denied.json"
                ></Player>
              </div>
              <Typography variant="h4" color="red" className="mb-2">
                Access Denied
              </Typography>
              <Typography variant="paragraph" color="gray" className="mb-8">
                You can no longer access this booking. The reservation may have
                already been accepted by another service provider.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/service-provider/booking">
                  <Button size="lg" color="light-blue" ripple={true}>
                    Return to bookings
                  </Button>
                </Link>
                <Button
                  size="lg"
                  color="blue-gray"
                  variant="outlined"
                  ripple={true}
                >
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        booking && <BookingDetail booking={booking} setBooking={setBooking} />
      )}
    </div>
  );
};

export default Page;
