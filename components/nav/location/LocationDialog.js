"use client";

import React from "react";
import { Dialog } from "@material-tailwind/react";
import ChangeCity from "./ChangeCity";

const LocationDialog = ({ open, handleOpen }) => {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="md"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <ChangeCity handleLocationDialog={handleOpen} />
    </Dialog>
  );
};

export default LocationDialog;
