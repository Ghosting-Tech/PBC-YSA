import React from "react";

const Loading = ({ height = "h-screen" }) => {
  return (
    <div className={`grid place-items-center ${height} max-h-screen w-full`}>
      <div className="flex flex-col items-center gap-4">
        <div className="loaction-loader"></div>
        <div className="text-2xl font-julius">Loading</div>
      </div>
    </div>
  );
};

export default Loading;
