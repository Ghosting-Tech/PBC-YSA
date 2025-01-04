"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography, Button } from "@material-tailwind/react";
import BlogCard from "./admin/blogs/BlogCard";

async function getBlogs() {
  const res = await fetch(`/api/blog`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return { data: [] };
  }

  return res.json();
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogData = await getBlogs();
      setBlogs(blogData.data || []);
    };

    fetchBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="text-black py-8">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Typography
            variant="h2"
            className="mb-4 text-[#6E4BB2] font-['Arial']"
          >
            Latest Blogs
          </Typography>
          <Typography
            variant="lead"
            color="gray"
            className="max-w-2xl mx-auto font-poppins"
          >
            That&apos;s the main thing people are controlled by! Thoughts -
            their perception of themselves!
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
        >
          {blogs.slice(0, 3).map((blog) => (
            <motion.div key={blog._id} variants={itemVariants}>
              <BlogCard blog={blog} page="user" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <Link href="/blogs" className="no-underline">
            <Button
              variant="outlined"
              color="purple"
              size="lg"
              className="flex items-center gap-2 group"
            >
              View All
              <motion.span
                className="inline-block group-hover:translate-x-5 transition-all duration-300"
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
