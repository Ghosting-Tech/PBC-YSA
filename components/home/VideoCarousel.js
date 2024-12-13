"use client";

import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const VideoCarousel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const videos = [
    "/video/nur-video1.mp4",
    "/video/nur-video2.mp4",
    "/video/nur-video3.mp4",
  ];

  const videoChunks =
    videos && videos.length > 0 ? chunkArray(videos, isMobile ? 1 : 3) : [];

  const renderArrowPrev = (onClickHandler, hasPrev, label) =>
    hasPrev && (
      <motion.button
        type="button"
        onClick={onClickHandler}
        title={label}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-800 bg-white/30 rounded-full hover:bg-white/50 z-10 focus:outline-none"
        transition={{ duration: 0.2 }}
      >
        <MdChevronLeft className="w-8 h-8" />
      </motion.button>
    );

  const renderArrowNext = (onClickHandler, hasNext, label) =>
    hasNext && (
      <motion.button
        type="button"
        onClick={onClickHandler}
        title={label}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-800 bg-white/30 rounded-full hover:bg-white/50 z-10 focus:outline-none"
        transition={{ duration: 0.2 }}
      >
        <MdChevronRight className="w-8 h-8" />
      </motion.button>
    );

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  const videoGroupVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const videoVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
        delay: custom * 0.2,
      },
    }),
  };

  return (
    <motion.div
      ref={ref}
      className="mx-auto container relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="w-full flex flex-col justify-center items-center py-8 px-4">
        <motion.h1
          className="font-julius lg:text-4xl md:text-3xl sm:text-2xl text-2xl text-center text-gray-800 mb-2"
          variants={titleVariants}
        >
          COMPLETE THE TASK WITH
        </motion.h1>
        <motion.h2
          className="font-cookie font-medium lg:text-5xl md:text-5xl sm:text-4xl text-3xl text-center text-blue-600"
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
        </motion.h2>
      </div>
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        useKeyboardArrows
        autoPlay
        interval={5000}
        transitionTime={300}
        renderArrowPrev={renderArrowPrev}
        renderArrowNext={renderArrowNext}
        onChange={(index) => setCurrentSlide(index)}
        className="pb-8"
      >
        {videoChunks.map((chunk, index) => (
          <motion.div
            key={index}
            className="video-group flex justify-center gap-4 px-4"
            variants={videoGroupVariants}
          >
            {chunk.map((video, idx) => (
              <motion.div
                key={idx}
                className="video-wrapper flex-1"
                variants={videoVariants}
                custom={idx}
              >
                <video
                  loop
                  muted
                  autoPlay
                  className="video shadow-md border border-gray-200 rounded-lg"
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </Carousel>
      <style jsx>{`
        .carousel-container {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 20px;
          position: relative;
        }
        .video {
          width: 100%;
          height: auto;
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .video-group {
            flex-direction: column;
          }
          .video-wrapper {
            margin-bottom: 1rem;
          }
        }
        .carousel-container :global(.carousel .control-arrow) {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .carousel-container :global(.carousel .control-prev) {
          left: -30px;
        }
        .carousel-container :global(.carousel .control-next) {
          right: -30px;
        }
        .carousel-container :global(.carousel .control-dots) {
          bottom: 0;
        }
      `}</style>
    </motion.div>
  );
};

export default VideoCarousel;
