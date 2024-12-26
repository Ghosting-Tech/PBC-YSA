"use client";

import {
  Button,
  List,
  Dialog,
  DialogBody,
  IconButton,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Search, ShoppingCart, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Image from "next/image";
import ServicesList from "./ServiceList";
import { useSelector } from "react-redux";
import LocationDialog from "./location/LocationDialog";
import { toast } from "sonner";

export default function NavList() {
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(!open2);

  const [topServices, setTopServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [searchError, setSearchError] = useState("");

  const [cityState, setCityState] = useState(null);

  useEffect(() => {
    const storedCityState = JSON.parse(localStorage.getItem("cityState")) || {};
    setCityState(storedCityState);
  }, []);

  const topBookedServices = useSelector((state) => state.topServices);
  const city =
    useSelector((state) => state.location.cityState.city) ||
    cityState?.city ||
    "Select Location";

  const gettingServices = async () => {
    try {
      if (!city) {
        toast.error("Please select a location to continue!");
      }
      if (topBookedServices.services.length > 0) {
        console.log("All services already fetched");
        return;
      }
      const fetchedData = await fetch("/api/services/top-booked?limit=100", {
        method: "POST",
        body: JSON.stringify({ city, state: "" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await fetchedData.json();
      if (response.success) {
        function getTopBookedServices(services, topN) {
          return services
            .sort((a, b) => b.bookings.length - a.bookings.length)
            .slice(0, topN);
        }

        const topServices = getTopBookedServices(response.data, 6);
        setAllServices(response.data);
        setTopServices(topServices);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    gettingServices();
    //eslint-disable-next-line
  }, []);

  const fuseOptions = {
    keys: ["name", "subServices.name"],
    includeScore: true,
    threshold: 0.3,
  };

  const flattenedData = allServices.flatMap((service) => [
    service,
    ...service.subServices.map((subService) => ({
      ...subService,
      parentServiceName: service.name,
      parentServiceId: service._id,
    })),
  ]);

  const fuse = new Fuse(flattenedData, fuseOptions);
  function handleSearch(query) {
    if (!query) {
      setSearchError("");
      setSearchedData([]);
      return;
    }

    const result = fuse.search(query);

    if (result.length === 0) {
      toast.error("No matching service found");
    }
    setSearchedData(result);
  }

  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const handleLocationDialog = () => setOpenLocationDialog(!openLocationDialog);

  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1 md:gap-4 md:mr-4">
      <ServicesList />
      <div className="flex gap-4 justify-evenly">
        <Button
          variant="outlined"
          className="flex items-center gap-2 w-full md:w-fit justify-center text-blue-500 border-blue-500"
          onClick={handleLocationDialog}
        >
          <MapPin size={18} color="red" />
          <span className="truncate max-w-[100px]">{city}</span>
        </Button>

        <LocationDialog
          open={openLocationDialog}
          handleOpen={handleLocationDialog}
        />

        <IconButton
          onClick={handleOpen2}
          variant="outlined"
          className="w-full md:w-12 h-12 border-blue-500 text-blue-500"
        >
          <Search size={18} />
        </IconButton>

        <Link href={"/cart"} className="no-underline">
          <IconButton
            variant="outlined"
            className="w-12 h-12 border-blue-500 text-blue-500"
          >
            <ShoppingCart size={20} />
          </IconButton>
        </Link>
        <Dialog
          open={open2}
          size="lg"
          handler={handleOpen2}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <DialogBody className="p-6 md:p-10 min-h-[90vh] bg-gray-50 rounded-xl">
            <div className="flex flex-col gap-3 mb-6 md:mb-10 items-center">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                Search For Services
              </h1>
              <p className="text-lg md:text-xl text-blue-500">
                Find the perfect service for you
              </p>
            </div>
            <Input
              label="Search a Service"
              color="blue"
              onChange={(e) => handleSearch(e.target.value)}
              icon={<Search className="cursor-pointer text-blue-500" />}
            />
            <div>
              <div className="flex gap-2 items-center my-6">
                <h2 className="whitespace-nowrap text-gray-600 text-sm font-medium">
                  Most Booked Services
                </h2>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-auto max-h-[60vh]">
                {searchError ? (
                  <div className="col-span-full text-center text-red-500">
                    {searchError}
                  </div>
                ) : searchedData.length <= 0 ? (
                  topServices.map((service, index) => (
                    <ServiceCard
                      key={index}
                      service={service}
                      handleOpen2={handleOpen2}
                    />
                  ))
                ) : (
                  searchedData.map((result, index) => (
                    <ServiceCard
                      key={index}
                      service={result.item}
                      handleOpen2={handleOpen2}
                    />
                  ))
                )}
              </div>
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </List>
  );
}

function ServiceCard({ service, handleOpen2 }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
      <div className="flex flex-col items-center gap-3">
        <Image
          width={64}
          height={64}
          src={service.icon.url}
          alt={service.name}
          className="rounded-md object-cover"
        />
        <div className="flex flex-col items-center gap-2 w-full">
          <h2 className="text-gray-800 font-semibold text-center text-sm md:text-base">
            {service.name}
          </h2>
          <Link href={`/services/${service.parentServiceId || service._id}`}>
            <Button
              variant="gradient"
              color="blue"
              className="rounded w-full flex items-center justify-center gap-1 text-xs md:text-sm"
              size="sm"
              onClick={handleOpen2}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
