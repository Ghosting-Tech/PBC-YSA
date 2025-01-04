"use client";

import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";
import { FaPhoneAlt, FaEnvelope, FaVenusMars, FaPray } from "react-icons/fa";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Tooltip,
  Avatar,
} from "@material-tailwind/react";

const UserDetail = ({
  profileImage,
  name,
  phoneNumber,
  email,
  gender,
  religion,
  access,
}) => {
  return (
    <Card className="w-full max-w-[400px] shadow-none">
      <CardBody className="p-0">
        <div className="flex items-center gap-4 mb-4">
          <Avatar
            size="lg"
            alt={name}
            src={
              profileImage?.url ||
              `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${name}`
            }
            className="border border-purple-500 ring-4 ring-purple-500/40"
          />
          <div>
            <Typography variant="h5" color="purple-gray" className="mb-1">
              {name}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography
                variant="small"
                color="gray"
                className="font-normal opacity-75"
              >
                <span className="flex items-center gap-1">
                  <FaVenusMars className="text-purple-500" />
                  {gender}
                </span>
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="font-normal opacity-75"
              >
                <span className="flex items-center gap-1">
                  <FaPray className="text-purple-500" />
                  {religion}
                </span>
              </Typography>
            </div>
          </div>
        </div>
        {access && (
          <div className="flex flex-wrap gap-3 mt-5">
            <Tooltip content="Call">
              <Link
                href={`tel:+91${phoneNumber}`}
                target="_blank"
                className="no-underline"
              >
                <Button
                  variant="outlined"
                  color="purple"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FaPhoneAlt />
                  Call
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="WhatsApp">
              <Link
                href={`https://wa.me/${phoneNumber}`}
                target="_blank"
                className="no-underline"
              >
                <Button
                  variant="outlined"
                  color="green"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <BsWhatsapp />
                  WhatsApp
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="Email">
              <Link
                href={`mailto:${email}`}
                target="_blank"
                className="no-underline"
              >
                <Button
                  variant="outlined"
                  color="indigo"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FaEnvelope />
                  Email
                </Button>
              </Link>
            </Tooltip>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UserDetail;
