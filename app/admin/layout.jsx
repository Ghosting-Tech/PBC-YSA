import React from "react";
import Sidebar from "@/components/admin/sidebar/Sidebar";

const layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="sticky top-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default layout;
