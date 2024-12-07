"use client";
import React, { useEffect, useState } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { MdLibraryAdd } from "react-icons/md";
import {
  Button,
  Dialog,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea,
  IconButton,
  Typography,
  Switch,
} from "@material-tailwind/react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import location from "@/assets/location.json";
import { FaArrowLeft, FaCross, FaTrash } from "react-icons/fa";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { VscLoading } from "react-icons/vsc";
import { AiOutlineLoading } from "react-icons/ai";

const Services = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const [serviceData, setServiceData] = useState({
    name: "",
    status: "active",
    description: "",
    cities: [],
    icon: {
      url: "",
      name: "",
    },
    images: [],
  });
  const [images, setImages] = useState({
    icon: null,
    images: null,
  });
  const [imageUploaded, setimageUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);

  const handleCreateService = async () => {
    try {
      if (serviceData.name === "") {
        toast.error("Name is required");
        return;
      }
      if (serviceData.description === "") {
        toast.error("Description is required");
        return;
      }
      if (serviceData.status === "") {
        toast.error("Please Select the Status");
        return;
      }
      if (serviceData.cities.length === 0) {
        toast.error("Please Select the Cities");
        return;
      }
      if (images.icon === null) {
        toast.error("Icon is required");
        return;
      }
      if (images.images === null) {
        toast.error("Please Upload the Images");
        return;
      }
      setimageUploaded(true);
      const iconRef = ref(
        storage,
        `serviceIcons/${
          images.icon.lastModified + images.icon.size + images.icon.name
        }`
      );
      await uploadBytes(iconRef, images.icon);
      const iconUrl = await getDownloadURL(iconRef); // Get the image URL directly
      const iconObject = { url: iconUrl, name: iconRef._location.path_ };
      const arrayOfImages = Object.values(images.images);
      const imagesUrlArray = await Promise.all(
        arrayOfImages.map(async (img) => {
          const imageRef = ref(
            storage,
            `serviceImages/${img.lastModified + img.size + img.name}`
          );
          await uploadBytes(imageRef, img);
          const imageUrl = await getDownloadURL(imageRef); // Get the image URL directly
          const imageObject = { url: imageUrl, name: imageRef._location.path_ };
          return imageObject;
        })
      );
      const postData = {
        ...serviceData,
        icon: iconObject,
        images: imagesUrlArray,
      };
      setServiceData(postData);
      const response = await fetch(
        "/api/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        },
        { cache: "no-store" }
      );
      const data = await response.json();
      setAllServices([...allServices, data]);

      setimageUploaded(false);
      setServiceData({
        name: "",
        status: "",
        description: "",
        cities: [],
        icon: {
          url: "",
          name: "",
        },
        images: [],
      });
      setImages({
        icon: null,
        images: null,
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedCity, setSelectedCity] = useState("Patna");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Update cities whenever the selected state changes
    if (selectedState) {
      setCities(location[selectedState]);
      console.log(location[selectedState][0]);
      setSelectedCity(location[selectedState][0]);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  const fetchingInitialData = async () => {
    try {
      const fetchedData = await fetch("/api/services/top-booked?limit=100", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const response = await fetchedData.json();
      console.log("Admin services: ", response);
      setAllServices(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchingInitialData();
  }, []);

  return (<>
    <div>
      <div className="px-10 md:px-4 flex flex-col gap-2 sm:flex-row justify-between items-center py-4 w-full">
        <Typography variant="h4" color="blue-gray">
          All Services
        </Typography>
        <Button
          onClick={handleOpen}
          color="blue"
          variant="gradient"
          className="flex items-center gap-2"
        >
          Create New Service
          <MdLibraryAdd />
        </Button>
        <Dialog
          size="lg"
          open={open}
          handler={handleOpen}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <div className="px-2">
            <h1 className="text-3xl font-bold text-indigo-500 font-lato p-4 text-center">
              Create New Service
            </h1>
            <div className="max-h-[80vh] overflow-y-auto no-scrollbar">
              <div className="p-4  grid grid-cols-1 gap-4 ">
                <div className="flex items-center gap-4 flex-col md:flex-row">
                  <Input
                    color="indigo"
                    label="Name"
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        name: e.target.value,
                      })
                    }
                  />
                  <div className="flex items-center gap-2 w-32">
                    <Switch
                      color="green"
                      defaultChecked={serviceData.status === "active"}
                      onChange={(e) =>
                        setServiceData({
                          ...serviceData,
                          status: e.target.checked ? "active" : "inactive",
                        })
                      }
                      label={
                        serviceData.status === "active"
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-col md:flex-row">
                  <div className="relative w-full">
                    <select
                      name="state"
                      value={selectedState}
                      onChange={handleStateChange}
                      required
                      className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {Object.keys(location).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="relative w-full">
                    <select
                      name="city"
                      value={selectedCity}
                      onChange={handleCityChange}
                      required
                      className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <Button
                    size="md"
                    onClick={() => {
                      if (serviceData.cities.includes(selectedCity)) {
                        toast.error("City already selected");
                        return;
                      }
                      setServiceData({
                        ...serviceData,
                        cities: [...serviceData.cities, selectedCity],
                      });
                    }}
                    color="blue"
                    className="flex items-center justify-center gap-2 w-[21.5rem]"
                  >
                    <PlusIcon className="w-6 h-6" /> Add City
                  </Button>
                </div>
                <div className="w-full max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Selected Cities
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {serviceData.cities.map((city, index) => (
                      <div
                        key={index}
                        className="group flex items-center bg-white rounded-full pl-4 pr-2 py-2 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                      >
                        <span className="text-gray-700 font-medium mr-2 text-sm">
                          {city}
                        </span>
                        <button
                          onClick={() => {
                            setServiceData({
                              ...serviceData,
                              cities: serviceData.cities.filter(
                                (c) => c !== city
                              ),
                            });
                          }}
                          className="p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-500 transition-colors duration-300 ease-in-out"
                          aria-label={`Remove ${city}`}
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {cities.length === 0 && (
                    <p className="text-gray-500 mt-4">
                      No cities selected. Add some cities to get started!
                    </p>
                  )}
                </div>
                <Textarea
                  label="Description"
                  color="indigo"
                  onChange={(e) =>
                    setServiceData({
                      ...serviceData,
                      description: e.target.value,
                    })
                  }
                />
                <div className="flex items-center gap-4 flex-col md:flex-row">
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <label htmlFor="icon">Icon</label>
                    <input
                      className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                      type="file"
                      onChange={(e) =>
                        setImages({ ...images, icon: e.target.files[0] })
                      }
                      id="icon"
                    />
                  </div>
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <label htmlFor="gallery-images">Gallery Images</label>
                    <input
                      className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                      type="file"
                      multiple
                      id="gallery-images"
                      onChange={(e) =>
                        setImages({ ...images, images: e.target.files })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  variant="gradient"
                  color="teal"
                  loading={imageUploaded}
                  onClick={handleCreateService}
                >
                  <span>Create</span>
                </Button>
              </DialogFooter>
            </div>
          </div>
        </Dialog>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-64">
          <AiOutlineLoading
            className="animate-spin text-blue-500"
            size={50}
          />
        </div>
      ) : (
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map((serv, index) => {
            return (
              (<div
                    key={index}
                    className="p-4 border bg-white border-gray-300 rounded-2xl flex flex-col justify-between gap-4"
                  >
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={serv.icon.url}
                      alt="ac"
                      width={100}
                      height={100}
                      className="w-24 h-24 drop-shadow-lg object-cover rounded"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    <div className="flex flex-col gap-2 justify-center">
                      <div>
                        <span
                          className={`border ${
                            serv.status === "active"
                              ? "bg-teal-100"
                              : "bg-red-100"
                          }  text-xs ${
                            serv.status === "active"
                              ? "text-teal-700"
                              : "text-red-700"
                          }  px-2 py-1 rounded-full`}
                        >
                          {serv.status}
                        </span>
                      </div>
                      <h1 className="font-bold text-2xl text-gray-700">
                        {serv.name}
                      </h1>
                    </div>
                  </div>
                  <div className="flex w-full gap-2 items-center">
                    <div className="bg-gray-500 w-full h-[1px]"></div>
                    <div className="whitespace-nowrap text-gray-700 text-xs">
                      Sub Services
                    </div>
                  </div>
                </div>
                <div className="max-h-56 overflow-auto no-scrollbar">
                  {serv.subServices.length === 0 ? (
                    <div className="text-center text-xl">
                      🚫Uh oh, There are no Sub services yet.
                    </div>
                  ) : (
                    serv.subServices.map((sub, index) => {
                      return (
                        (<div
                            key={index}
                            className="flex gap-2 items-center hover:bg-gray-300 rounded cursor-pointer transition-all duration-500 p-2"
                          >
                          <Image
                            src={sub.icon?.url}
                            alt=""
                            width={100}
                            height={100}
                            className="w-14 h-14 object-cover rounded shadow-md"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              maxWidth: "100%",
                              height: "auto"
                            }} />
                          <h4 className="whitespace-nowrap">{sub.name}</h4>
                        </div>)
                      );
                    })
                  )}
                </div>
                <Link
                  href={`/admin/services/${serv._id}`}
                  className="no-underline w-full"
                  legacyBehavior>
                  <Button
                    variant="gradient"
                    color="black"
                    className="w-full flex justify-center items-center gap-2"
                  >
                    <IoMdInformationCircle size={25} />
                    More details
                  </Button>
                </Link>
              </div>)
            );
          })}
        </div>
      )}
    </div>
  </>);
};

export default Services;
