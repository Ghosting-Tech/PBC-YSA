"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { MdChevronRight, MdPlayArrow } from "react-icons/md";
import { motion } from "framer-motion";

const VideoCarousel = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const gridItems = [
    {
      id: 1,
      image: "/video/video-1.mp4",
      title: "Ambulance Service",
      video: "/video/video-1.mp4",
      className: "hidden md:block col-span-1 row-span-1",
    },
    {
      id: 2,
      image: "/video/video-2.mp4",
      title: "Home Nursing Service",
      video: "/video/video-2.mp4",
      className: "col-span-2 row-span-1",
    },
    {
      id: 3,
      image: "/video/video-3.mp4",
      title: "Doctor On Call",
      video: "/video/video-3.mp4",
      className: "col-span-1 row-span-1",
    },
    {
      id: 4,
      image: "/video/video-4.mp4",
      title: "Baby Sitting",
      video: "/video/video-4.mp4",
      className: "col-span-1 row-span-1",
    },
    {
      id: 5,
      image: "/video/video-5.mp4",
      title: "Doctor Consultation",
      video: "/video/video-5.mp4",
      className: "col-span-2 row-span-1",
    },
    {
      id: 6,
      image: "/video/nur-video1.mp4",
      title: "Professional Care",
      video: "/video/nur-video1.mp4",
      className: "hidden md:block col-span-1 row-span-1",
    },
  ];

  return (
    <div className="container mx-auto px-4 pb-12 ">
      <div className="flex justify-center items-center mb-10">
        <div>
          <motion.h2
            className="text-2xl md:text-4xl font-['Arial'] text-[#6E4BB2] mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            COMPLETE THE TASK WITH
          </motion.h2>
          <motion.p
            className="text-purple-700 text-3xl md:text-5xl font-cookie  flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
              transition: {
                y: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                },
              },
            }}
          >
            Experienced Professionals
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gridItems.map((item) => (
          <motion.div
            key={item.id}
            className={`relative group overflow-hidden h-80 rounded-2xl ${item.className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: item.id * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <video
              src={item.video}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              muted
              loop
              autoPlay
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <Button
                variant="filled"
                size="sm"
                className="w-fit bg-white text-purple-500 flex items-center gap-2"
                onClick={() => setSelectedVideo(item.video)}
              >
                <MdPlayArrow className="w-5 h-5" />
                Watch Video
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={!!selectedVideo}
        handler={() => setSelectedVideo(null)}
        size="xl"
      >
        <div className="p-4">
          {selectedVideo && (
            <video
              controls
              autoPlay
              className="w-full aspect-video rounded-lg"
              src={selectedVideo}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default VideoCarousel;
