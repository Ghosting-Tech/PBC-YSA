import { Button } from "@material-tailwind/react";
import Link from "next/link";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const CallToAction = () => {
  return (
    <div className="w-full pt-4">
      <div className="flex flex-col items-center justify-center gap-6 mx-auto max-w-3xl">
        <Link href={"/services"} className="no-underline w-full">
          <Button
            variant="gradient"
            color="blue"
            className="mt-4"
            fullWidth
            size="lg"
          >
            Book a Service »
          </Button>
        </Link>
        <div className="flex items-center lg:w-full md:w-full sm:w-full w-full">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-gray-500 font-medium">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <Link href={"/become-service-provider"} className="no-underline w-full">
          <Button
            variant="outlined"
            color="blue"
            className="flex items-center justify-center gap-1"
            fullWidth
            size="lg"
          >
            Become a service provider
            <span className="ml-2">
              <FaUserPlus />
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
