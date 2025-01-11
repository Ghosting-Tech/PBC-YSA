"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { Drawer, Rating, Textarea } from "@material-tailwind/react";
import {
  Button,
  Carousel,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Link from "next/link";
import { VscDebugContinue } from "react-icons/vsc";
import { IoBagRemove } from "react-icons/io5";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import Image from "next/image";
import Review from "@/components/services/review/Review";
import Loading from "@/components/Loading";
import SubServiceCard from "@/components/admin/services/SubServiceCard";
import { toast } from "sonner";
import RecommendedServices from "@/components/home/RecommendedServices";
import { useSelector } from "react-redux";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-gray-700 text-white rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      <MdChevronRight className="w-6 h-6" />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-gray-700 text-white rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      <MdChevronLeft className="w-6 h-6" />
    </div>
  );
};

const sliderSettings = {
  // dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        // dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Service = () => {
  const { id } = useParams();
  const recommendedBookedServices = useSelector(
    (state) => state.recommendedServices
  );
  console.log({ recommendedBookedServices });

  const [service, setService] = useState({});

  const [cartItems, setCartItems] = useState([]);
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const [addingDifferentService, setAddingDifferentService] = useState(false);
  const handleAddingCart = (subService) => {
    const differentServices = cartItems.filter(
      (item) => item.serviceId !== subService.serviceId
    );
    if (differentServices.length > 0) {
      toast.error("Remove other services to add this service!");
      openDrawer();
      setAddingDifferentService(true);
      return;
    }
    const existingItem = cartItems.find((item) => item._id === subService._id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item._id === subService._id // Use _id here
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...subService, quantity: 1 }]);
      localStorage.setItem(
        "cart",
        JSON.stringify([...cartItems, { ...subService, quantity: 1 }])
      );
      openDrawer();
    }
  };
  const removingCartItem = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems.filter((item) => item._id !== id))
    );
    if (cartItems.length == 1) closeDrawer();
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getService = async () => {
      try {
        const res = await fetch(`/api/services/${id}`, { cache: "no-store" });
        const data = await res.json();
        setService(data.service);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getService();
    setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
  }, [id]);

  const [rating, setRating] = useState(0);

  useEffect(() => {
    console.log({ cartItems });
  }, [cartItems]);

  if (loading) {
    return (
      <div className="grid place-items-center min-h-screen absolute w-full bg-white transition-all duration-700 top-0 z-50">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div
        className={`grid place-items-center min-h-screen absolute w-full bg-white transition-all duration-700 top-0 ${
          loading ? "opacity-100" : "opacity-0"
        } ${loading ? "z-50" : "-z-50"}`}
      >
        <Loading />
      </div>
      <div
        className={`${
          loading ? "hidden" : "block"
        } transition-all duration-700`}
      >
        <Drawer
          open={open}
          onClose={closeDrawer}
          className="p-4 shadow-lg overflow-auto"
          dismiss={{ enabled: false }}
          overlay={false}
          size={420}
          placement="right"
        >
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h5" color="purple-gray">
              Cart Services
            </Typography>
            <IconButton
              variant="text"
              color="purple-gray"
              onClick={closeDrawer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          {addingDifferentService && (
            <div className="flex flex-col mb-4">
              <h1 className="text-red-500 text-xl font-bold">
                Remove other services to add this service!
              </h1>
              <Button
                onClick={() => {
                  setCartItems([]);
                  localStorage.removeItem("cart");
                  setAddingDifferentService(false);
                  closeDrawer();
                }}
                color="red"
                variant="outlined"
                size="lg"
              >
                Remove all
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => {
              return (
                <div key={item._id} className="flex items-center gap-2">
                  <Image
                    width={1000}
                    height={1000}
                    // Replace with actual path
                    src={item.icon?.url}
                    alt="Service Icon"
                    className="w-28 h-28 object-cover rounded shadow"
                  />
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl leading-tight text-gray-700 font-bold w-full">
                      {item.name}
                    </h2>
                    <Typography color="teal" variant="h5">
                      ₹{item.price}
                    </Typography>
                    <Button
                      onClick={() => removingCartItem(item._id)}
                      color="red"
                      variant="gradient"
                      size="sm"
                      className="rounded w-fit flex items-center gap-1"
                    >
                      Remove <IoBagRemove />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="lg"
              variant="outlined"
              className="rounded flex items-center gap-1"
              onClick={closeDrawer}
            >
              Continue Browsing <VscDebugContinue />
            </Button>
            <Link href={"/cart"} legacyBehavior>
              <Button
                size="lg"
                color="gray"
                variant="gradient"
                className="rounded flex items-center gap-1"
              >
                Next <FaCartShopping />
              </Button>
            </Link>
          </div>
        </Drawer>
        <div className="px-4 md:px-20 my-6 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <Carousel
              className="rounded-md w-full max-h-auto overflow-hidden"
              loop
              prevArrow={({ handlePrev }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handlePrev}
                  className="!absolute top-2/4 left-4 -translate-y-2/4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </IconButton>
              )}
              nextArrow={({ handleNext }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handleNext}
                  className="!absolute top-2/4 !right-4 -translate-y-2/4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </IconButton>
              )}
            >
              {service.images?.map((image) => (
                <Image
                  width={1000}
                  height={1000}
                  key={image.name}
                  src={image.url}
                  alt=""
                  className="h-96 w-full object-cover"
                />
              ))}
            </Carousel>
            <div className="w-full lg:w-2/3 px-4 flex flex-col gap-3 rounded-lg">
              <div>
                <div className="flex flex-col justify-center">
                  <h2 className="lg:text-4xl md:text-5xl sm:text-5xl  text-4xl leading-tight text-[#6E4BB2] font-bold  ">
                    {service.name}
                  </h2>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }, (e, index) => {
                          let stars = rating;
                          return (
                            <span key={index} className="text-[#FFB800]">
                              {stars >= index + 1 ? (
                                <IoIosStar size={15} />
                              ) : stars >= index + 0.5 ? (
                                <IoIosStarHalf size={15} />
                              ) : (
                                <IoIosStarOutline size={15} />
                              )}
                            </span>
                          );
                        })}
                      </div>
                      <span className="ml-1">{rating}</span>
                    </div>
                    <span className="ml-2 text-gray-700">
                      | {service?.reviews?.length} reviews
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600  overflow-y-auto no-scrollbar  max-h-24 max-w-[450px] font-poppins">
                {service.description}
              </p>
              <div className="flex items-start gap-6 ">
                <div className="flex w-full items-center gap-2 bg-white h-fit  shadow-lg rounded-lg px-4 py-2 cursor-pointer hover:scale-105 transition-all">
                  <Image
                    width={100}
                    height={100}
                    // Replace with actual path
                    src="/icons/cargo.png"
                    alt="Bookings Icon"
                    className="w-10 object-cover"
                  />
                  <span className="text-gray-600 md:text-xl ">
                    {service?.bookings?.length} Bookings
                  </span>
                </div>
                <div className="flex w-full items-center gap-2 bg-white h-fit  shadow-lg rounded-lg px-4 py-2 cursor-pointer hover:scale-105 transition-all">
                  <Image
                    width={100}
                    height={100}
                    // Replace with actual path
                    src="/icons/star.png"
                    alt="Star Icon"
                    className="w-10 object-cover"
                  />
                  <span className="text-gray-600 md:text-xl">
                    {rating} | {service?.reviews?.length} reviews
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {service.images?.slice(0, 3).map((image, index) => (
                  <Image
                    key={index}
                    width={1000}
                    height={1000}
                    src={image.url}
                    alt={`Service image ${index + 1}`}
                    className="service-image w-36 h-[135px] rounded-lg"
                  />
                ))}
              </div>
              <div className="flex gap-2"></div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center py-4 px-4">
            <h1 className="font-poppins lg:text-5xl md:text-4xl sm:text-3xl text-3xl text-center text-[#6E4BB2] font-bold uppercase">
              {service.name}
            </h1>
          </div>
          <div className="container mx-auto">
            {service.subServices?.length <= 4 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center">
                {service.subServices?.map((subService, index) => (
                  <SubServiceCard
                    forAdmin={false}
                    cartItems={cartItems}
                    removingCartItem={removingCartItem}
                    handleAddingCart={handleAddingCart}
                    key={index}
                    sub={subService}
                    index={index}
                    serviceId={id}
                    subServices={service.subServices}
                  />
                ))}
              </div>
            ) : (
              <Slider {...sliderSettings}>
                {service.subServices?.map((subService, index) => (
                  <div key={index} className="px-3">
                    <Card className="mb-3">
                      <CardHeader floated={false}>
                        <Image
                          width={100}
                          height={100}
                          src={subService.icon.url}
                          alt="Service Icon"
                          className="object-cover w-64 h-48 shadow-lg"
                        />
                      </CardHeader>
                      <CardBody>
                        <div className="mb-1 flex flex-col justify-start gap-2">
                          <Typography
                            variant="h6"
                            color="purple-gray"
                            className="font-medium"
                          >
                            {subService.name}
                          </Typography>
                        </div>
                        <div className="text-2xl font-bold text-[var(--color)]">
                          ₹{subService.price}
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0 flex flex-col gap-2">
                        {cartItems.some((sub) => sub._id === subService._id) ? (
                          <Button
                            size="lg"
                            fullWidth
                            variant="gradient"
                            color="red"
                            className="flex gap-2 items-center justify-center"
                            onClick={() => removingCartItem(subService._id)}
                          >
                            <span>Remove Service</span>
                            <IoBagRemove size={20} />
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            fullWidth
                            className="flex gap-2 items-center justify-center bg-[var(--color)] hover:bg-[var(--hover)] text-white"
                            onClick={() => handleAddingCart(subService)}
                          >
                            <span>Add to cart</span>
                            <FaCartArrowDown size={20} />
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
        {/* <RecommendedServices
          recommendedServices={recommendedBookedServices.services}
        /> */}
        <Review
          service={service}
          id={id}
          rating={rating}
          setRating={setRating}
          setService={setService}
        />
      </div>
    </>
  );
};

export default Service;
