import React from "react";
import Image from "next/image";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const HowToBookCard = ({ title, description, imageUrl }) => {
  return (
    (<div
      className="cursor-pointer hover:scale-105 transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full min-w-[350px] overflow-hidden shadow-lg">
        <CardBody className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src={imageUrl}
              alt={title}
              className="rounded-full"
              fill
              sizes="100vw"
              style={{
                objectFit: "contain"
              }} />
          </div>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {title}
          </Typography>
          <Typography className="mb-4 text-gray-700">{description}</Typography>
        </CardBody>
      </Card>
    </div>)
  );
};

export default HowToBookCard;
