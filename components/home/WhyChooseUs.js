"use client";

import React from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { FaHandshake, FaUserTie, FaTools } from "react-icons/fa";

const WhyChooseUs = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const features = [
    {
      icon: FaHandshake,
      title: "Professional Service",
      description: "Get top-notch service from our vetted professionals",
      details:
        "Our rigorous vetting process ensures that only the most skilled and reliable professionals join our platform. Each service provider undergoes background checks, skill assessments, and customer satisfaction evaluations to maintain our high standards.",
    },
    {
      icon: FaUserTie,
      title: "Expert Providers",
      description: "Connect with skilled and experienced service providers",
      details:
        "Our network consists of industry experts with years of experience in their respective fields. From certified technicians to creative professionals, you'll find the right expert for any job, big or small.",
    },
    {
      icon: FaTools,
      title: "Wide Range of Services",
      description: "From home repair to personal care, we've got you covered",
      details:
        "Whether you need home maintenance, tech support, beauty services, or professional consulting, our platform offers a diverse range of services to meet all your needs under one roof.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
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
        damping: 12,
      },
    },
  };

  return (
    <div className="py-6 relative overflow-hidden" ref={ref}>
      {/* White textured background */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <motion.div
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div variants={titleVariants}>
          <Typography
            variant="h2"
            color="blue-gray"
            className="mb-2 text-center font-bold"
          >
            Why Choose Our Platform?
          </Typography>
          <Typography
            variant="lead"
            color="gray"
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            Discover the advantages that set us apart and make your service
            experience exceptional.
          </Typography>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="hover:scale-105 transition-all duration-300"
            >
              <Card
                className={`h-full cursor-pointer transition-all duration-300 shadow-lg ring-2 ring-blue-500`}
              >
                <CardBody className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-blue-50 hover:scale-105 transition-all duration-300">
                      <feature.icon size={24} className="text-blue-500" />
                    </div>
                    <Typography variant="h5" color="blue-gray">
                      {feature.title}
                    </Typography>
                  </div>
                  <Typography variant="small" color="gray" className="mb-4">
                    {feature.description}
                  </Typography>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <Typography variant="small" color="blue-gray">
                        {feature.details}
                      </Typography>
                    </motion.div>
                  </AnimatePresence>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WhyChooseUs;
