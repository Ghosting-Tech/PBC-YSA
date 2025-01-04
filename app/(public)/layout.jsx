import React from "react";
import MainNav from "@/components/nav/MainNav";
import NewFooter from "@/components/home/NewFooter";

const layout = ({ children }) => {
  return (
    <div>
      <MainNav />
      {children}
      <NewFooter />
    </div>
  );
};

export default layout;
