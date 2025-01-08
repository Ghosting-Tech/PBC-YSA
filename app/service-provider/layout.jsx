import React from "react";
import DutyToggle from "@/components/service-provider/DutyToggle";
import MainNav from "@/components/nav/MainNav";
import NewFooter from "@/components/home/NewFooter";

const layout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <MainNav />
      {children}
      <NewFooter />
      <DutyToggle />
    </div>
  );
};

export default layout;
