import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Typography, Rating } from "@material-tailwind/react";

const TestimonialCard = ({ name, img, cust, desc, rating }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <motion.div
        className="relative w-24 h-24 rounded-full overflow-hidden mb-4"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.7 }}
      >
        <Image
          src={img}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </motion.div>
      <Typography variant="h5" color="blue-gray" className="mb-2">
        {name}
      </Typography>
      <Typography variant="small" color="gray" className="mb-4">
        {cust}
      </Typography>
      <Typography variant="paragraph" className="mb-4 italic">
        &quot;{desc}&quot;
      </Typography>
      <Rating value={parseInt(rating)} readonly />
    </motion.div>
  );
};

export default TestimonialCard;
