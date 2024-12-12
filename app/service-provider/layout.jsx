import React from "react";
import Nav from "@/components/nav/Nav";
import Footer from "@/components/Footer";
import DutyToggle from "@/components/service-provider/DutyToggle";

const layout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <Nav />
      {children}
      <Footer />
      <DutyToggle />
    </div>
  );
};

export default layout;
