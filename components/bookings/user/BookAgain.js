import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  BookOpenIcon,
  XMarkIcon,
  CalendarDaysIcon,
  CalendarDateRangeIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const BookAgain = ({ booking }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();

  const handleBookAgain = () => {
    localStorage.setItem("cart", JSON.stringify(booking.cartItems));
    router.push("/checkout");
  };

  if (!booking.completed) return null;

  return (
    <>
      <div
        className={`fixed bottom-8 right-1/2 translate-x-1/2 transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <Button
          color="blue"
          size="lg"
          className={`rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleBookAgain}
        >
          Book Again <CalendarDateRangeIcon className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};

export default BookAgain;
