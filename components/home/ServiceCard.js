"use client";

import Link from "next/link";
import {
  IoIosStar,
  IoIosStarHalf,
  IoIosStarOutline,
  IoMdOpen,
} from "react-icons/io";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@material-tailwind/react";

const ServiceCard = ({ service }) => {
  const [ratingArray, setRatingArray] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setRatingArray((prev) => {
      return prev.concat(service?.reviews?.map((review) => review.rating));
    });
  }, [service]);

  useEffect(() => {
    const countRatings = ratingArray.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    const {
      1: r1 = 0,
      2: r2 = 0,
      3: r3 = 0,
      4: r4 = 0,
      5: r5 = 0,
    } = countRatings;

    const result =
      (5 * r5 + 4 * r4 + 3 * r3 + 2 * r2 + 1 * r1) / (r5 + r4 + r3 + r2 + r1);
    if (isNaN(result)) {
      setRating(0);
    } else {
      setRating(result.toFixed(1));
    }
  }, [ratingArray]);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 hover:scale-105">
      {/* Image Section */}
      <div className="w-full h-48 relative">
        <Image
          src={service?.icon?.url}
          alt={service?.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1">
          <IoIosStar className="text-[#FFB800]" size={16} />
          <span className="text-sm text-gray-800 font-medium">{rating}</span>
          <span className="text-sm text-gray-800">Stars</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {service?.name}
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Access expert {service?.name.toLowerCase()} for personalized recovery
          plans.
        </p>
        <Link href={`/services/${service?._id}`} className="no-underline">
          <Button
            fullWidth
            className="bg-[#6E4BB2] hover:bg-[var(--hover)]-700 text-white py-3 rounded-lg font-medium"
          >
            BOOK SERVICE
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
