import Booking from "@/components/bookings/service-provider/BookingPage";
import Loading from "@/components/Loading";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Booking />
    </Suspense>
  );
};

export default page;
