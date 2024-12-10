import React from "react";
import Nav from "@/components/nav/Nav";
import Footer from "@/components/Footer";

const layout = ({ children }) => {
  return (
    <div>
      <Nav />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
