"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";

const BlogCard = ({
  blog,
  setOpenDeleteDialog,
  setDeleteBlog,
  setOpenEditDialog,
  setSelectedBlog,
  page,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const user = useSelector((state) => state.user.user);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <Card className="w-full min-h-[510px] max-h-[510px] shadow-lg border group overflow-hidden flex flex-col justify-between">
        <div className="relative w-full min-h-56 max-h-56">
          <Image
            src={blog.image.url}
            alt="Blog Image"
            fill
            className="rounded-t-xl object-cover z-10 transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <CardBody className="flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Typography
                variant="small"
                color="blue"
                className="font-semibold px-2 py-1 bg-blue-50 rounded-md"
              >
                {blog.type}
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="flex items-center"
              >
                {user?.role === "admin" && page !== "user" ? (
                  <span className="hidden group-hover:flex gap-2">
                    <FaRegEdit
                      size={20}
                      className="cursor-pointer text-blue-gray-500 hover:text-blue-500 transition-colors"
                      onClick={() => {
                        setOpenEditDialog(true);
                        setSelectedBlog(blog);
                      }}
                    />
                    <MdOutlineDelete
                      size={22}
                      className="cursor-pointer text-blue-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => {
                        setOpenDeleteDialog(true);
                        setDeleteBlog(blog);
                      }}
                    />
                  </span>
                ) : (
                  formatDate(blog.createdAt)
                )}
              </Typography>
            </div>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 line-clamp-2"
            >
              {blog.title}
            </Typography>
            <Typography color="gray">
              {blog.description.length > 100
                ? blog.description.substring(0, 100) + "..."
                : blog.description}
            </Typography>
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex items-end">
          <Link href={`/blogs/${blog._id}`} className="no-underline">
            <Button
              size="sm"
              color="gray"
              variant="outlined"
              className="flex items-center gap-2 group"
            >
              Read More
              <IoMdArrowForward
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
