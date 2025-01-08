"use client";

import {
  Button,
  Dialog,
  DialogBody,
  IconButton,
  Input,
  List,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, MapPin, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LocationDialog from "./location/LocationDialog";
import { toast } from "sonner";
import Fuse from "fuse.js";
import Image from "next/image";
import Profile from "./user-profile/Profile";
import UserNavigation from "./user-profile/UserNavigation";
import { usePathname } from "next/navigation";
import { setUser, setUserLoading } from "@/redux/slice/userSlice";
import { useDispatch } from "react-redux";

export default function MainNav() {
  // State management
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [topServices, setTopServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [cityState, setCityState] = useState(null);
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "All Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Support", path: "/support" },
  ];

  // Handlers
  const handleSearchDialog = () => setSearchDialogOpen(!searchDialogOpen);
  const handleLocationDialog = () => setOpenLocationDialog(!openLocationDialog);
  const handleOpenLoginDialog = () => setOpenLoginDialog(!openLoginDialog);

  // Redux selectors
  const topBookedServices = useSelector((state) => state.topServices);
  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.userLoading);
  const city =
    useSelector((state) => state.location.cityState.city) ||
    cityState?.city ||
    "Select Location";

  useEffect(() => {
    const storedCityState = JSON.parse(localStorage.getItem("cityState")) || {};
    setCityState(storedCityState);

    // Close mobile nav on resize
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const response = await fetch(`/api/users/check-authorization`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.message === "Unauthorized") {
          return;
        }
        if (!data.success) {
          return toast.error(data.message);
        }
        dispatch(setUser(data.user));
      } catch (err) {
        console.log(err);
        toast.error("Error fetching user");
      } finally {
        dispatch(setUserLoading(false));
      }
    };
    gettingUser();
  }, [dispatch]);

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
      setSearchedData([]);
      toast.error("No matching service found");
    } else {
      setSearchedData(result);
    }
  }

  return (
    <>
      <nav className="w-full max-w-[1310px] mx-auto h-[79px] px-4 lg:px-8 py-2 bg-white/30 rounded-[108px] backdrop-blur flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link href="/">
            <Image
              src="/trustologo.svg"
              alt="Trustory Logo"
              width={100}
              height={100}
              className="w-[200px] h-[200px]"
            />
          </Link>
        </div>

        {/* Navigation Links - Hidden on Mobile */}
        <div className="hidden lg:flex px-[35px] rounded-[26px] items-center gap-6">
          {navItems.map((item) => (
            <motion.div key={item.name} className="hover:text-[var(--hover)] ">
              <Link
                key={item.name}
                href={item.path}
                className={`
            text-lg
            transition-colors
            duration-300
            font-poppins
          `}
                style={{
                  color: pathname === item.path ? "#6e4bb2" : "inherit",
                  ":hover": {
                    color: "#6e4bb2",
                  },
                }}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Button
            variant="outlined"
            className="pl-2 lg:pl-3.5 pr-3 lg:pr-5 py-2 bg-gray-50 lg:border-none rounded-[66px]  flex items-center gap-1 lg:gap-2.5"
            onClick={handleLocationDialog}
          >
            <MapPin size={14} color="red" />
            <span className="text-[#1a1a1a] text-sm font-medium uppercase truncate max-w-[80px] lg:max-w-[100px] font-poppins">
              {city}
            </span>
          </Button>

          <div className="hidden lg:flex items-center gap-4">
            <IconButton
              onClick={handleSearchDialog}
              className="p-2.5 bg-[var(--color)] rounded-[60px] text-white hover:bg-[var(--hover)]"
            >
              <Search size={20} />
            </IconButton>

            <Link href="/cart">
              <IconButton className="p-2.5 bg-[var(--color)] rounded-[60px] text-white hover:bg-[var(--hover)]">
                <ShoppingCart size={20} />
              </IconButton>
            </Link>

            <Profile
              openLoginDialog={openLoginDialog}
              handleOpenLoginDialog={handleOpenLoginDialog}
              setOpenLoginDialog={setOpenLoginDialog}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center justify-center  gap-2">
            <IconButton
              variant="text"
              color="purple-gray"
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </IconButton>
            <UserNavigation
              userLoading={userLoading}
              user={user}
              handleOpenLoginDialog={handleOpenLoginDialog}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden bg-white shadow-lg p-4 fixed w-full transform transition-transform duration-400 ease-in-out z-50 ${
          openNav ? "translate-y-[5px]" : "-translate-y-[500px]"
        }`}
      >
        <div className="flex flex-col gap-4 w-full p-4 items-center">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              className={`hover:bg-[#9165e8] hover:text-white w-full flex items-center justify-center rounded-lg transition-colors  font-poppins ${
                pathname === item.path ? "bg-[#6e4bb2] text-white" : ""
              }`}
            >
              <Link
                key={item.name}
                href={item.path}
                className={`text-lg p-2`}
                onClick={() => setOpenNav(false)}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          <div className="flex items-center gap-4">
            <IconButton
              onClick={handleSearchDialog}
              className="p-2.5 bg-[#6e4bb2] rounded-[60px] text-white hover:bg-[#5d3f96]"
            >
              <Search size={20} />
            </IconButton>

            <Link href="/cart">
              <IconButton className="p-2.5 bg-[#6e4bb2] rounded-[60px] text-white hover:bg-[#5d3f96]">
                <ShoppingCart size={20} />
              </IconButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <LocationDialog
        open={openLocationDialog}
        handleOpen={handleLocationDialog}
      />

      <Dialog
        open={searchDialogOpen}
        size="lg"
        handler={handleSearchDialog}
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
            <p className="text-lg md:text-xl text-[var(--color)] ">
              Find the perfect service for you
            </p>
          </div>
          <Input
            label="Search a Service"
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search className="cursor-pointer text-[var(--color)] " />}
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
                    handleOpen2={handleSearchDialog}
                  />
                ))
              ) : (
                searchedData.map((result, index) => (
                  <ServiceCard
                    key={index}
                    service={result.item}
                    handleOpen2={handleSearchDialog}
                  />
                ))
              )}
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}

// ServiceCard Component
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
              color="purple"
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
