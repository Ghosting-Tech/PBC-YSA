import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import UpdateServiceStatus from "./UpdateServiceStatus";
import { useRouter } from "next/navigation";
import UserDetail from "@/components/admin/bookings/single-booking/UserDetail";
import LocationDetails from "@/components/admin/bookings/single-booking/LocationDetails";
import BookingHeader from "@/components/admin/bookings/single-booking/BookingHeader";
import ServiceDetails from "@/components/admin/bookings/single-booking/ServiceDetails";
import InvoiceDetail from "@/components/admin/bookings/single-booking/InvoiceDetail";
import { toast } from "sonner";
import Invoice from "./Invoice";
import BookingActions from "./BookingActions";
import VerificationImageUpload from "./VerificationImageUpload";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slice/userSlice";

const BookingDetail = ({ booking, setBooking }) => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChangeOtp = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to the next input box if the current one is filled
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDownOtp = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const [otpVerified, setOtpVerified] = useState(false);
  const handleVerifyOtp = async () => {
    try {
      const otpValue = otp.join("");
      if (otpValue != booking.otp) {
        toast.error("Invalid otp");
        return;
      }
      setOtpVerified(true);
      setOtp(["", "", "", ""]);
      const postData = {
        ...booking,
        otpVerified: true,
        status: "Service provider has been reached!",
        actionType: "otpVerification",
      };

      setBooking(postData);
      await axios.put(`/api/bookings/${booking._id}`, postData);

      // handle sending notification to user after completing the service

      axios.post(`/api/send-notification/by-user-phone`, {
        phoneNumber: booking.phoneNumber,
        title: "Service provider has been reached.",
        message: "Reaching Otp has been successfully verified!",
        link: `user/bookings/${booking._id}`,
      });
    } catch (e) {
      console.log(e);
      toast.error("Failed to verify the otp!");
    }
  };

  useEffect(() => {
    if (booking?.otpVerified === true) {
      setOtpVerified(true);
    }
    if (booking?.otpVerified !== true) {
      setOtpVerified(false);
    }
  }, [booking]);

  const dispatch = useDispatch();

  const handleRejectRequest = async (id) => {
    try {
      const payload = { bookingId: id, serviceProviderId: user._id };

      const { data } = await axios.post(
        `/api/bookings/reject-booking`,
        payload
      );
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setBooking(data.booking);
      dispatch(setUser(data.user));
      toast.success("Successfully rejected service!");
      router.push(`/service-provider/booking?page=1`);
    } catch (err) {
      console.log("Error occurred:", err);
    }
  };

  const handleAcceptRequest = async (id) => {
    const eliminateServiceProviders = booking.availableServiceProviders.filter(
      (serviceProvider) => {
        return serviceProvider._id !== user._id;
      }
    );

    try {
      const res = await axios.post(`/api/bookings/accept-booking`, {
        eliminateServiceProviders,
        bookingId: id,
        serviceProvider: user,
      });
      const response = res.data;

      if (!response.success) {
        toast.error(response.message);
        if (response.acceptedByAnotherServiceProvider) {
          router.push(`/service-provider/booking?page=1`);
          return;
        }
        return;
      }
      setBooking(response.booking);
      toast.success("Successfully accepted service!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-2">
      <div className="mx-8">
        <div className="mb-4">
          <BookingHeader booking={booking} />
          <ServiceDetails booking={booking} />
          <InvoiceDetail booking={booking} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="w-full overflow-hidden p-4">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 rounded-none"
              >
                <Typography variant="h5" color="black">
                  Booking Information
                </Typography>
              </CardHeader>
              <CardBody className="p-0 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-3 text-teal-500" />
                    <div>
                      <Typography variant="small" color="blue-gray">
                        Booking Date
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {booking.date}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 mr-3 text-teal-500" />
                    <div>
                      <Typography variant="small" color="blue-gray">
                        Booking Time
                      </Typography>
                      <Typography variant="h6" color="blue-gray">
                        {booking.time}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <UserIcon className="h-6 w-6 mr-3 text-teal-500 mt-1" />
                    <div>
                      <Typography variant="small" color="blue-gray">
                        Patient Condition
                      </Typography>
                      <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mt-1"
                      >
                        {booking.patientCondition}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DocumentIcon className="h-6 w-6 mr-3 text-teal-500 mt-1" />
                    <div className="flex-grow">
                      <Typography variant="small" color="blue-gray">
                        Patient Prescription
                      </Typography>
                      {booking.prescription?.url ? (
                        <a
                          href={booking.prescription.url}
                          download
                          className="mt-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            color="teal"
                            variant="outlined"
                            className="flex items-center gap-2"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            view Prescription
                          </Button>
                        </a>
                      ) : (
                        <Typography color="gray" className="mt-1">
                          No prescription uploaded
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="bg-white p-6 rounded-lg shadow w-full">
              <h3 className="text-md md:text-xl font-semibold mb-4 text-gray-800">
                Customer Details
              </h3>

              <UserDetail
                name={booking?.user?.name}
                gender={booking?.user?.gender}
                religion={booking?.user?.religion}
                access={booking?.acceptedByServiceProvider}
                profileImage={booking?.user?.image}
                email={booking?.user?.email}
                phoneNumber={booking?.user?.phoneNumber}
              />
            </div>
          </div>
        </div>
        <LocationDetails booking={booking} />
        {booking?.acceptedByServiceProvider && !booking?.canceledByCustomer && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {otpVerified ? (
              <div className="bg-white rounded-lg shadow-md w-full min-h-44 p-4 flex items-center flex-col justify-center">
                <div className="text-2xl font-julius text-teal-500 font-bold flex flex-col items-center gap-1">
                  <RiVerifiedBadgeFill size={75} /> OTP Verified
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md w-full min-h-44 p-4 flex items-center flex-col justify-center">
                <h2 className="md:text-xl sm:text-xl text-lg text-gray-500 font-normal">
                  Enter reached verification OTP
                </h2>
                <div className="w-full px-6 flex items-center flex-col md:flex-row justify-center gap-4 mt-4">
                  <div className="flex items-center justify-center gap-4">
                    {otp.map((data, index) => {
                      return (
                        <input
                          key={index}
                          type="text"
                          name="otp"
                          maxLength="1"
                          className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                          value={data}
                          onChange={(e) => handleChangeOtp(e.target, index)}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => handleKeyDownOtp(e, index)}
                        />
                      );
                    })}
                  </div>
                  <button
                    variant="gradient"
                    color="teal"
                    className="rounded px-4 py-2 flex items-center gap-1 bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-100 transition-all font-semibold"
                    onClick={handleVerifyOtp}
                  >
                    Verify <FaCheckCircle />
                  </button>
                </div>
              </div>
            )}
            {booking?.otpVerified && (
              <VerificationImageUpload
                booking={booking}
                setBooking={setBooking}
              />
            )}
            {booking?.otpVerified && !booking?.completed && (
              <Invoice
                selectedBooking={booking}
                setSelectedBooking={setBooking}
              />
            )}
            {booking?.otpVerified && (
              <UpdateServiceStatus
                selectedNewBooking={booking}
                setSelectedNewBooking={setBooking}
              />
            )}
          </div>
        )}
        <section className="mb-8 mt-4">
          <h3 className="text-xl font-bold text-red-600">Caution:</h3>
          <ol className="list-decimal ml-6 mt-2 text-gray-700">
            <li>Accept the booking as soon as possible.</li>
            <li>Rejection cannot be undone later.</li>
            <li>Verify OTP from the customer.</li>
            <li>Attach an image of doing servicing</li>
            <li>Update the status of service According to you!</li>
            <li>
              Generate an invoice after reviewing the customer problem with the
              necessary details.
            </li>
          </ol>
        </section>
      </div>
      {!booking?.canceledByCustomer && (
        <BookingActions
          booking={booking}
          handleAcceptRequest={handleAcceptRequest}
          handleRejectRequest={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default BookingDetail;
