import { Card, CardBody } from "@material-tailwind/react";
import {
  CalendarIcon,
  ShieldCheckIcon,
  ClockIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { LuStethoscope } from "react-icons/lu";

const features = [
  {
    icon: <CalendarIcon className="w-6 h-6" />,
    title: "Easy Scheduling",
    description: "Book appointments instantly with our user-friendly platform",
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: "Verified Providers",
    description: "All healthcare providers are thoroughly vetted and certified",
  },
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: "24/7 Support",
    description: "Round-the-clock medical assistance whenever you need it",
  },
  {
    icon: <HeartIcon className="w-6 h-6" />,
    title: "Personal Care",
    description: "Tailored healthcare plans for your specific needs",
  },
  {
    icon: <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />,
    title: "Wide Range of Services",
    description: "From home repair to personal care, we've got you covered",
  },
  {
    icon: <LuStethoscope className="w-6 h-6" />,
    title: "Professional Service",
    description: "Get top-notch service from our vetted professionals",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl text-[#6E4BB2] font-['Arial']">
          Why Choose Us
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
          We provide comprehensive healthcare solutions with a focus on quality,
          accessibility, and patient comfort.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-200 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
