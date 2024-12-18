import Loading from "@/components/Loading";
import {
  Button,
  Drawer,
  IconButton,
  Input,
  Option,
  Select,
} from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";

const AssignServiceProvider = ({ bookingId, setBooking, booking }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(!openDialog);

  const [serviceProviders, setServiceProviders] = useState([]);
  const [filterByStatus, setFilterByStatus] = useState("both");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByGender, setFilterByGender] = useState("both");
  const [loading, setLoading] = useState(true); // Loading state for data fetch

  const fetchingServiceProviders = useCallback(async () => {
    const page = 1;
    const limit = 50;
    try {
      const response = await fetch(
        `/api/admin/service-providers?page=${page}&limit=${limit}&search=${searchQuery}&available=${filterByStatus}&active=true&gender=${filterByGender}`
      );
      const data = await response.json();
      if (data.success) {
        const filteredServiceProviders = data.users.filter(
          (sp) => !booking.availableServiceProviders.some(
            (availableServiceProvider) => availableServiceProvider._id === sp._id
          )
        );
        setServiceProviders(filteredServiceProviders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [filterByStatus, searchQuery, filterByGender, booking.availableServiceProviders]);

  useEffect(() => {
    fetchingServiceProviders();
  }, [fetchingServiceProviders]);

  const handleAssigning = async (serviceProviderId) => {
    try {
      const response = await axios.post(
        `/api/admin/bookings/assign-service-provider`,
        { bookingId, serviceProviderId }
      );
      const data = await response.data;
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      console.log(data);
      setBooking(data.booking);
      handleOpenDialog();
    } catch (error) {
      console.log(error);
      toast.error("Error assigning service provider");
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant="gradient"
        color="blue"
        className="flex gap-2 items-center justify-center"
        onClick={handleOpenDialog}
      >
        <span>Assign</span>
        <FaPlus className="text-lg" />
      </Button>

      <Drawer
        open={openDialog}
        onClose={handleOpenDialog}
        className="p-6"
        placement="right"
        size={500}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="flex justify-between items-center w-full">
              <div className="text-lg font-normal">
                <span>Assign Service Provider</span>
              </div>
              <IconButton variant="text" onClick={handleOpenDialog}>
                <RxCross1 className="text-lg" />
              </IconButton>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="w-full">
                <Input
                  label="Search Users"
                  className="bg-white"
                  icon={<IoIosSearch />}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  color="indigo"
                />
              </div>
              <div className="flex gap-2 items-center justify-center">
                <div className="w-full bg-white">
                  <Select
                    label="Filter By Status"
                    value={filterByStatus}
                    color="indigo"
                    onChange={(value) => setFilterByStatus(value)}
                  >
                    <Option className="list-none" value={true}>Available</Option>
                    <Option className="list-none" value={false}>Not Available</Option>
                    <Option className="list-none" value="both">Both</Option>
                  </Select>
                </div>
                <div className="w-full bg-white">
                  <Select
                    label="Filter By Gender"
                    value={filterByGender}
                    color="indigo"
                    onChange={(value) => setFilterByGender(value)}
                    
                  >
                    <Option className="list-none" value="male">Male</Option>
                    <Option className="list-none" value="female">Female</Option>
                    <Option className="list-none" value="both">Both</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-6 overflow-y-auto">
              {serviceProviders.map((provider) => {
                return (
                  <div
                    key={provider._id}
                    className="flex gap-4 items-center justify-between px-4 py-2 rounded-lg transition-all border hover:bg-gray-100 w-full"
                  >
                    <Link
                      href={`/service-provider/${provider._id}`}
                      className="no-underline"
                    >
                      <div className="flex gap-2 items-center">
                        <Image
                          src={provider?.image?.url}
                          alt={provider?.name}
                          width={200}
                          height={200}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex flex-col justify-center">
                          <span
                            className={`border w-fit ${
                              provider.available ? "bg-teal-100" : "bg-red-100"
                            }  text-xs ${
                              provider.available ? "text-teal-700" : "text-red-700"
                            }  px-2 py-1 rounded-full text-xs`}
                          >
                            {provider.available ? "Available" : "Not Available"}
                          </span>
                          <span>{provider.name}</span>
                        </div>
                      </div>
                    </Link>
                    <Button
                      size="sm"
                      variant="gradient"
                      color="blue"
                      onClick={() => handleAssigning(provider._id)}
                    >
                      Assign
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default AssignServiceProvider;
