"use client";
import { IoMdInformationCircleOutline } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, List, ListItem, Radio } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slice/userSlice";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useLocalStorage } from "@/components/common/LocalStorageWrapper";

function Shipping() {
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    address: "",
    date: "",
    time: 0,
  });

  const [dates, setDates] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Create handler functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to generate the four days including the current date
  const getFourDays = () => {
    const today = new Date();
    const fourDaysArray = [today];

    for (let i = 1; i < 4; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      fourDaysArray.push(nextDate);
    }

    return fourDaysArray.map((date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${parseFloat(hours) + 1}:${parseFloat(minutes)}`;
  };

  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [cart, setCart] = useLocalStorage("cart", []);
  const [location, setLocation] = useLocalStorage("location", {});
  useEffect(() => {
    if (cart.length === 0) router.back();
    // eslint-disable-next-line
  }, [router, cart.length]);

  useEffect(() => {
    setCartItems(cart);

    const dates = getFourDays();
    setDates(dates);
    getAddress(location);
    setFormData((prevFormData) => ({
      ...prevFormData,
      fullname: user.name || "Name",
      profileImage: user.image || { url: "", name: "" },
      phoneNumber: user.phoneNumber || "Phone Number",
      email: user.email || "Email",
      date: dates[0],
    }));
  }, [user, cart, location]); // No router dependency here

  const dispatch = useDispatch();

  const [redirectingLoading, setRedirectingLoading] = useState(false);
  const [disableRedirectingButton, setDisableRedirectingButton] =
    useState(false);
  const [redirectingButtonClicked, setRedirectingButtonClicked] = useState(0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedToday = `${day}-${month}-${year}`;

    if (formData.date === formattedToday) {
      if (formData.time <= getCurrentTime()) {
        toast.warning(
          "Kindly choose a time that is at least one hour from now."
        );
        return;
      }
    }

    if (redirectingButtonClicked > 2) {
      setDisableRedirectingButton(true);
      toast.warning("Too many attempts. Please try again later.");
      return;
    }

    setRedirectingLoading(true);
    setRedirectingButtonClicked((prev) => prev + 1);

    try {
      // Combine all API logic into a single POST request
      const postData = {
        formData,
        location,
        cartItems,
        user,
      };

      const response = await axios.post("/api/bookings", postData);

      if (response.status === 201) {
        const booking = response.data.booking;
        dispatch(setUser(response.data.updatedUser));

        // Initiate payment separately after booking is created
        const amount = (
          booking.cartItems.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
          ) + 18
        ).toFixed(2);

        const paymentResponse = await axios.post(
          `/api/payments/initiate-payment`,
          {
            bookingId: booking._id,
            amount,
            userId: user._id,
            userPhoneNumber: booking.phoneNumber,
            invoice: false,
          }
        );

        if (paymentResponse.data.success) {
          const phonePeRedirectUrl =
            paymentResponse.data.data.instrumentResponse.redirectInfo.url;
          router.push(phonePeRedirectUrl);
        } else {
          toast.error(
            paymentResponse.data.message || "Payment initiation failed."
          );
        }

        // Clear cart after successful booking
        // setCart([]);
      } else {
        const errorMessage = response.data?.error;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log("Error in submitting order:", error);
      toast.error(error.error || "An error occurred while placing the order.");
    } finally {
      setRedirectingLoading(false);
    }
  };

  const searchBoxRef = useRef(null);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const newLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    getAddress(newLocation);
    setLocation(newLocation);
  };

  const getAddress = async (location) => {
    if (!location) return; // Early return to avoid unnecessary calls

    const { lat, lng } = location;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    if (!response.ok) toast.error("Failed to fetch address");

    const data = await response.json();
    const formattedAddress =
      data.results?.[0]?.formatted_address || "Unknown Address";

    setFormData((prev) => ({ ...prev, address: formattedAddress }));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-20 p-8">
        <div className="w-full md:w-1/3">
          <h2 className="font-julius lg:text-4xl md:text-4xl sm:text-3xl text-3xl mb-4 text-gray-700">
            SUMMARY
          </h2>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <Image
                  src={item.icon?.url}
                  alt={`service${index}`}
                  width={100}
                  height={100}
                  className="w-24 h-24 mr-3 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-teal-500">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-px w-full bg-gray-300 mt-4"></div>

          <div className="flex flex-col gap-4 p-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ₹
                {cartItems
                  .reduce(
                    (acc, product) => acc + product.price * product.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span>₹18.00</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-700">
              <span>Total</span>
              <span>
                ₹
                {(
                  cartItems.reduce(
                    (acc, product) => acc + product.price * product.quantity,
                    0
                  ) + 18
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="font-julius text-center lg:text-4xl md:text-4xl sm:text-3xl text-3xl mb-4 text-gray-700">
            Checkout
          </h2>
          <form className="space-y-4" onSubmit={handleSubmitOrder}>
            <Input
              label="Full name"
              className="bg-white"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              maxLength={30}
              minLength={4}
            />
            <Input
              label="Phone number"
              className="bg-white"
              name="phoneNumber"
              value={formData.phoneNumber}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, ""); // Only allows digits
              }}
              onChange={handleChange}
              required
              maxLength={10}
              minLength={10}
            />
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              libraries={["places"]}
            >
              <StandaloneSearchBox
                onLoad={(ref) => (searchBoxRef.current = ref)}
                onPlacesChanged={onPlacesChanged}
              >
                <Input
                  label="Search Address"
                  value={formData.address}
                  onChange={handleChange}
                  name="address"
                  size="lg"
                  className="p-2 w-full border rounded"
                  placeholder="Enter your address"
                  required
                />
              </StandaloneSearchBox>
            </LoadScript>
            <h2>Available Dates</h2>
            <List className="grid grid-cols-2 2xl:grid-cols-4 bg-white rounded-lg">
              {dates.map((date) => (
                <ListItem key={date} className="p-0">
                  <label
                    htmlFor={date}
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <Radio
                      id={date}
                      name="date"
                      value={date}
                      checked={formData.date === date}
                      onChange={handleChange}
                    />
                    {date}
                  </label>
                </ListItem>
              ))}
            </List>
            <input
              type="time"
              name="time"
              value={formData.time}
              min="08:00"
              max="20:00"
              required
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="text-sm text-red-600 flex items-center gap-1">
              <IoMdInformationCircleOutline size={20} />
              <p className="text-xs">
                Please select the time between 8:00A.M to 8:00P.M
              </p>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <IoMdInformationCircleOutline size={20} />
              <p className="text-xs">
                Your privacy is important to us. We will only contact you if
                there is an issue with your order.
              </p>
            </div>
            <Button
              className="mt-4 flex justify-center items-center gap-1 w-full"
              size="lg"
              color="teal"
              loading={redirectingLoading}
              disabled={disableRedirectingButton || redirectingLoading}
              variant="gradient"
              type="submit"
            >
              {/* Continue to payments */}
              Book Service
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Shipping;
