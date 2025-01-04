"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button, Badge, Avatar } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import ProfileInfo from "@/components/service-provider/ProfileInfo";
import ServicesList from "@/components/service-provider/ServiceList";
import EditProfileDialog from "@/components/service-provider/EditProfileDialog";
import AddServiceDialog from "@/components/service-provider/AddServiceDialog";
import axios from "axios";
import ServiceProviderLocation from "@/components/service-provider/ServiceProviderLocation";
import { setTopBookedServices } from "@/redux/slice/topBookedServicesSlice";
import { toast } from "sonner";
import ApplyDress from "@/components/service-provider/ApplyDress";

const ServiceProvider = () => {
  const reduxUser = useSelector((state) => state.user.user);
  const [user, setUser] = useState(reduxUser);
  const [updatedServices, setUpdatedServices] = useState(
    reduxUser.services || []
  );

  useEffect(() => {
    setUser(reduxUser);
    setUpdatedServices(reduxUser?.services || []);
  }, [reduxUser]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [fetchedServicesFromId, setFetchedServicesFromId] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleOpen = () => setOpen(!open);
  const handleOpen2 = () => setOpen2(!open2);

  const topBookedServices = useSelector((state) => state.topServices);
  const dispatch = useDispatch();

  const getAllService = useCallback(async () => {
    const storedLocation = JSON.parse(localStorage.getItem("cityState"));
    if (!storedLocation.city) {
      toast.error("Please select a location for continue!");
    }
    if (topBookedServices.services.length > 0) {
      console.log("All services already fetched");
      return;
    }
    const { data } = await axios.post(
      "/api/services/top-booked?limit=100",
      storedLocation
    );
    if (data.success) {
      dispatch(setTopBookedServices(data.data));
    } else {
      toast.error(data.message);
    }

    //eslint-disable-next-line
  }, []);

  const fetchingServices = useCallback(async () => {
    if (updatedServices.length > 0) {
      try {
        const res = await axios.post(
          `/api/service-providers/services-from-array-of-id`,
          updatedServices
        );
        setFetchedServicesFromId(res.data); // Update the list in the state
      } catch (err) {
        console.log(err);
      }
    } else {
      setFetchedServicesFromId([]); // Clear the list if no services
    }
  }, [updatedServices]);

  useEffect(() => {
    getAllService();
    fetchingServices();
    setLoading(false);
    //eslint-disable-next-line
  }, [getAllService, fetchingServices]);

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center items-center">
        <div className="w-10/12 mb-4">
          <button
            title="Go Back"
            className="flex gap-1 font-semibold text-gray-700 items-center my-10"
            onClick={router.back}
          >
            <FaArrowLeft /> Profile
          </button>
          <ApplyDress />
          <div className="flex flex-col justify-center gap-4">
            <div className="flex gap-4 items-center w-full">
              <Badge
                content={<div className="h-3 w-h-3"></div>}
                overlap="circular"
                className={`border-2 border-white shadow-lg shadow-black/20 ${
                  user?.available ? "bg-green-400" : "bg-red-400"
                }`}
              >
                <Avatar
                  src={
                    user.image.url ||
                    `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.name}`
                  }
                  alt="profile picture"
                  className="w-32 h-32 object-cover"
                />
              </Badge>
              <div className="flex gap-1 flex-col justify-center">
                <span className="text-6xl font-semibold text-gray-800">
                  Hey👋
                </span>
                <span className="text-indigo-500 font-semibold text-3xl font-itim tracking-wider">
                  {user?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center md:flex-row flex-col justify-end w-full">
              <Button
                onClick={handleOpen}
                variant="gradient"
                color="purple"
                className="mt-3 md:mt-0 whitespace-nowrap flex justify-center"
              >
                Edit Profile
              </Button>
            </div>
            <ProfileInfo user={user} />
          </div>

          <ServicesList
            fetchedServicesFromId={fetchedServicesFromId}
            handleOpen2={handleOpen2}
            setUpdatedServices={setUpdatedServices}
            setFetchedServicesFromId={setFetchedServicesFromId}
            updatedServices={updatedServices}
            user={user}
          />
          <ServiceProviderLocation serviceProvider={user} />
        </div>
      </div>
      <EditProfileDialog
        open={open}
        handleOpen={handleOpen}
        user={user}
        setUser={setUser}
      />
      <AddServiceDialog
        allServices={topBookedServices.services}
        open={open2}
        handleOpen={handleOpen2}
        updatedServices={updatedServices}
        setUpdatedServices={setUpdatedServices}
        user={user}
        setUser={setUser}
        fetchingServices={fetchingServices}
      />
    </div>
  );
};

export default ServiceProvider;
