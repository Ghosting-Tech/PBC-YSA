"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCityState,
  setGeolocationDenied,
} from "@/redux/slice/locationSlice";
import Testimonial from "@/components/home/testimonial/Testimonial";
import Blogs from "@/components/BlogSection";
import { toast } from "sonner";
import {
  setTopBookedServices,
  setTopBookedServicesLoading,
} from "@/redux/slice/topBookedServicesSlice";
import {
  setLatestBookedServices,
  setLatestBookedServicesLoading,
} from "@/redux/slice/LatestBookedServicesSlice";
import {
  setRecommendedBookedServices,
  setRecommendedBookedServicesLoading,
} from "@/redux/slice/RecommendedBookedServicesSlice";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Hero from "@/components/home/Hero";
import VideoCarousel from "@/components/home/VideoCarousel";
import CallToAction from "@/components/home/CallToAction";
import ServiceContainer from "@/components/home/ServiceContainer";
import HowToBook from "@/components/home/HowToBook";
import Footer from "@/components/Footer";
import Nav from "@/components/nav/Nav";
import EnhancedNav from "@/components/nav/Nav";
import MainNav from "@/components/nav/MainNav";
import HeroSection from "@/components/home/NewHero";
import LatestServices from "@/components/home/LatestServices";
import RecommendedServices from "@/components/home/RecommendedServices";
import NewFooter from "@/components/home/NewFooter";
import AvailableCities from "@/components/home/AvailableCities";
const fetchTopServices = async (cityState) => {
  try {
    const response = await axios.post(
      "/api/services/top-booked?limit=100",
      cityState
    );
    return response;
  } catch (error) {
    console.error("Error fetching top services:", error);
    return [];
  }
};
const fetchLatestServices = async (cityState) => {
  try {
    const response = await axios.post(
      "/api/services/latest?limit=100",
      cityState
    );
    return response;
  } catch (error) {
    console.error("Error fetching Latest services:", error);
    return [];
  }
};
const fetchRecommendedServices = async (cityState) => {
  try {
    const response = await axios.post(
      "/api/services/recommended?limit=100",
      cityState
    );
    return response;
  } catch (error) {
    console.error("Error fetching Recommended services:", error);
    return [];
  }
};

const getAddress = async ({ lat, lng }) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const city = data.results[0].address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name;
      const state = data.results[0].address_components.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name;
      return { city, state };
    } else {
      throw new Error("Address not found");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};

export default function Home() {
  const [selectedState, setSelectedState] = useState("Bihar");
  const [selectedCity, setCity] = useState("patna");
  const [latestServices, setLatestServices] = useState([]);
  const [recommendedServices, setRecommendedServices] = useState([]);

  const setSelectedCity = useCallback((city) => {
    setCity(city);
  }, []);

  const dispatch = useDispatch();
  const topBookedServices = useSelector((state) => state.topServices);
  const latestBookedServices = useSelector((state) => state.latestServices);
  const recommendedBookedServices = useSelector(
    (state) => state.recommendedServices
  );

  const getTopServices = useCallback(
    async (cityState, message) => {
      try {
        dispatch(setTopBookedServicesLoading(true));
        const response = await fetchTopServices(cityState);
        if (response.data.success) {
          const allServices = response.data.data;
          dispatch(setTopBookedServicesLoading(false));
          if (message && allServices.length === 0) {
            toast.warning(message);
          }
          dispatch(setTopBookedServices(allServices));
          dispatch(setGeolocationDenied(false));
          dispatch(setCityState(cityState));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching top services:", error);
      } finally {
        dispatch(setTopBookedServicesLoading(false));
      }
    },
    [dispatch]
  );
  const getLatestServices = useCallback(
    async (cityState, message) => {
      try {
        dispatch(setLatestBookedServicesLoading(true));
        const response = await fetchLatestServices(cityState);
        console.log({ latestResponse: response.data.data });
        setLatestServices(response.data.data);
        if (response.data.success) {
          const allServices = response.data.data;
          dispatch(setLatestBookedServicesLoading(false));
          if (message && allServices.length === 0) {
            toast.warning(message);
          }
          dispatch(setLatestBookedServices(allServices));
          dispatch(setGeolocationDenied(false));
          dispatch(setCityState(cityState));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching top services:", error);
      } finally {
        dispatch(setLatestBookedServicesLoading(false));
      }
    },
    [dispatch]
  );
  const getRecommendedServices = useCallback(
    async (cityState, message) => {
      try {
        dispatch(setRecommendedBookedServicesLoading(true));
        const response = await fetchRecommendedServices(cityState);
        console.log({ recommendedResponse: response.data.data });
        setRecommendedServices(response.data.data);
        if (response.data.success) {
          const allServices = response.data.data;
          dispatch(setRecommendedBookedServicesLoading(false));
          if (message && allServices.length === 0) {
            toast.warning(message);
          }
          dispatch(setRecommendedBookedServices(allServices));
          dispatch(setGeolocationDenied(false));
          dispatch(setCityState(cityState));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Recommended services:", error);
      } finally {
        dispatch(setRecommendedBookedServicesLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation not supported");

        dispatch(setTopBookedServicesLoading(false));
        dispatch(setLatestBookedServicesLoading(false));
        dispatch(setRecommendedBookedServicesLoading(false));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          try {
            const cityState = await getAddress(location);
            setSelectedState(cityState.state);
            setSelectedCity(cityState.city);
            getTopServices(cityState);
            dispatch(setCityState(cityState));
            localStorage.setItem("cityState", JSON.stringify(cityState));
          } catch (error) {
            console.log("Error getting address:", error);
            dispatch(setTopBookedServicesLoading(false));
            dispatch(setLatestBookedServicesLoading(false));
            dispatch(setRecommendedBookedServicesLoading(false));
          }
        },
        (error) => {
          console.log("Error getting location:", error.message);
          dispatch(setGeolocationDenied(true));
          dispatch(setTopBookedServicesLoading(false));
          dispatch(setLatestBookedServicesLoading(false));
          dispatch(setRecommendedBookedServicesLoading(false));
        }
      );
    };

    const storedLocation = localStorage.getItem("cityState");
    if (storedLocation && topBookedServices.services.length === 0) {
      getTopServices(JSON.parse(storedLocation));
      getLatestServices(JSON.parse(storedLocation));
      getRecommendedServices(JSON.parse(storedLocation));
    } else {
      getUserLocation();
    }
    //eslint-disable-next-line
  }, [
    dispatch,
    getTopServices,
    getLatestServices,
    getRecommendedServices,
    setSelectedCity,
  ]);

  const handleLocationChange = () => {
    if (selectedState && selectedCity) {
      const cityState = { state: selectedState, city: selectedCity };
      dispatch(setCityState(cityState));
      localStorage.setItem("cityState", JSON.stringify(cityState));
      getTopServices(
        cityState,
        "No services found for the selected location. Please select a different location."
      );
      getLatestServices(
        cityState,
        "No services found for the selected location. Please select a different location."
      );
      getRecommendedServices(
        cityState,
        "No services found for the selected location. Please select a different location."
      );
    }
  };
  console.log({ latest: latestBookedServices.services });
  console.log({ recommended: recommendedBookedServices.services });

  return (
    <main>
      <>
        {/* <EnhancedNav /> */}
        {/* <MainNav /> */}
        {/* <Hero /> */}
        <HeroSection />
        <ServiceContainer
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          setSelectedCity={setSelectedCity}
          handleLocationChange={handleLocationChange}
          selectedCity={selectedCity}
          forAllService={false}
        />
        <VideoCarousel />
        {latestServices.length > 0 && (
          <LatestServices latestServices={latestServices} />
        )}
        <WhyChooseUs />
        <HowToBook />
        <CallToAction />
        <Testimonial />
        <Blogs />
        <AvailableCities />
        {recommendedServices.length > 0 && (
          <RecommendedServices recommendedServices={recommendedServices} />
        )}
        <NewFooter />
        {/* <Footer /> */}
      </>
    </main>
  );
}
