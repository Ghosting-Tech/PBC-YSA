"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Input,
  Button,
} from "@material-tailwind/react";
import {
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import uploadImage from "@/utils/uploadImage";

const contactMethods = [
  {
    icon: <PhoneIcon className="w-6 h-6" />,
    title: "Call Us",
    content: "+1 (555) 123-4567",
    link: `tel:${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_NUMBER}`,
  },
  {
    icon: <EnvelopeIcon className="w-6 h-6" />,
    title: "Email Us",
    content: "support@yourserviceapp.com",
    link: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL_ID}`,
  },
  {
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
    title: "WhatsApp Chat",
    content: "Chat with us",
    link: `https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_NUMBER}`,
  },
];

const faqs = {
  user: [
    {
      question: "How do I book a service?",
      answer:
        "You can book a service by browsing our available services, selecting the one you need, choosing a date and time, and confirming your booking.",
    },
    {
      question: "What if I need to cancel my booking?",
      answer:
        "You can cancel your booking up to 24 hours before the scheduled service time without any penalty. Go to 'My Bookings' and select the booking you wish to cancel.",
    },
    {
      question: "How do I pay for services?",
      answer:
        "We accept various payment methods including credit/debit cards and digital wallets. Payment is processed securely at the time of booking.",
    },
  ],
  provider: [
    {
      question: "How do I sign up as a service provider?",
      answer:
        "To become a service provider, go to the 'Join as Provider' page, fill out the application form, and submit your credentials for verification.",
    },
    {
      question: "How do I manage my schedule?",
      answer:
        "You can manage your availability through the 'Provider Dashboard'. Set your working hours and block out any times you're unavailable.",
    },
    {
      question: "How and when do I get paid?",
      answer:
        "Payments are processed weekly. You'll receive your earnings via direct deposit to the bank account you've provided in your profile.",
    },
  ],
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const FAQSection = ({ items, openAccordion, handleOpen }) => (
  <div>
    {items.map((faq, index) => (
      <Accordion key={index} open={openAccordion === index + 1}>
        <AccordionHeader
          className="text-md font-semibold text-blue-600 hover:text-blue-800"
          onClick={() => handleOpen(index + 1)}
        >
          {faq.question}
        </AccordionHeader>
        <AccordionBody>{faq.answer}</AccordionBody>
      </Accordion>
    ))}
  </div>
);

export default function SupportPage() {
  const [userType, setUserType] = useState("user");
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);

  const user = useSelector((state) => state.user.user);

  const [issueForm, setIssueForm] = useState({
    name: "",
    email: "",
    category: "",
    issue: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      setUserType(user?.role === "service-provider" ? "provider" : "user");
      setIssueForm({
        name: user.name || "",
        email: user.email || "",
        category: "refund",
        issue: "",
      });
    }
  }, [user]);

  const handleOpen = (value) =>
    setOpenAccordion(openAccordion === value ? 0 : value);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user?._id) {
      toast.error("Please login to raise a ticket");
      return;
    }

    try {
      let payload = {
        ...issueForm,
        from: userType,
        user: user._id,
      };
      if (file) {
        const fileData = await uploadImage(file, "support");
        payload = {
          ...payload,
          file: fileData,
        };
      }
      console.log(payload);
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setIssueForm({
          name: "",
          email: "",
          issue: "",
          category: "",
        });
        router.push("/my-tickets");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto mb-10"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <Card className="w-full">
        <CardBody className="p-8">
          <div className="flex justify-between flex-col md:flex-row items-center mb-8">
            <Typography variant="h3" color="blue" className="text-center">
              How can we help you today?
            </Typography>
            {user?._id && (
              <Link
                href={`/my-tickets`}
                className="w-full md:w-fit no-underline"
                legacyBehavior
              >
                <Button
                  variant="outlined"
                  color="blue-gray"
                  className="w-full md:w-fit"
                >
                  My tickets
                </Button>
              </Link>
            )}
          </div>

          <Tabs value={userType} className="mb-8">
            <TabsHeader>
              <Tab value="user" onClick={() => setUserType("user")}>
                <div className="flex items-center gap-1.5 text-xs h-full">
                  <UserIcon className="w-5 h-5" />
                  I&apos;m a User
                </div>
              </Tab>
              <Tab value="provider" onClick={() => setUserType("provider")}>
                <div className="flex items-center gap-1.5 text-xs">
                  <BriefcaseIcon className="w-5 h-5" />
                  I&apos;m a Service Provider
                </div>
              </Tab>
            </TabsHeader>
          </Tabs>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            variants={fadeIn}
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                className="cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <Link
                  href={method.link}
                  target="_blank"
                  className="no-underline"
                  legacyBehavior
                >
                  <Card className="border-2 border-blue-300 shadow-md shadow-blue-50">
                    <CardBody className="flex flex-col items-center p-4">
                      {method.icon}
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mt-2"
                      >
                        {method.title}
                      </Typography>
                      <Typography variant="small" className="text-center">
                        {method.content}
                      </Typography>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeIn}>
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Frequently Asked Questions
            </Typography>
            <FAQSection
              items={faqs[userType]}
              openAccordion={openAccordion}
              handleOpen={handleOpen}
            />
          </motion.div>

          <motion.div className="mt-12" variants={fadeIn}>
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Still need help?
            </Typography>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                type="text"
                label="Your Name"
                value={issueForm.name}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, name: e.target.value })
                }
              />
              <Input
                type="email"
                label="Your Email"
                value={issueForm.email}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, email: e.target.value })
                }
              />
              {userType === "user" ? (
                <div className="relative w-full">
                  <select
                    name="category"
                    value={issueForm.category}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, category: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="refund">Refund</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="relative w-full">
                  <select
                    name="category"
                    value={issueForm.category}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, category: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="payouts">Payouts</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center w-full p-6 text-center border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
                >
                  <svg
                    className="w-8 h-8 text-blue-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm text-blue-600 font-medium">
                    {file ? file.name : "Click here to upload"}
                  </span>
                  <span className="text-xs text-blue-400 mt-1">
                    Maximum file size: 10MB
                  </span>
                </label>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
              </div>

              <div className="h-56">
                <ReactQuill
                  theme="snow"
                  value={issueForm.issue}
                  onChange={(content) =>
                    setIssueForm({ ...issueForm, issue: content })
                  }
                  modules={modules}
                  formats={formats}
                  placeholder="Describe your issue"
                  className="h-full"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                color="blue"
                className="mt-10 flex items-center justify-center"
                fullWidth
                loading={loading}
              >
                Raise ticket
              </Button>
            </form>
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
