"use client";

import React, { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { LoaderCircle, LoaderIcon } from "lucide-react";

const MostBookedServicesChart = ({ data, loading }) => {
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedData = useMemo(() => {
    const filteredData = [...data]
      .sort((a, b) =>
        sortOrder === "asc" ? a.bookings - b.bookings : b.bookings - a.bookings
      )
      .slice(0, 10);
    return filteredData;
  }, [data, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow">
          <p className="font-bold">{label}</p>
          <p>Bookings: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-[800px] bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center justify-center h-[500px]">
          <LoaderCircle className="h-12 w-12 text-blue-500/80 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading chart data...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none p-0 md:p-2"
      >
        <div className="flex items-center justify-between flex-col md:flex-row gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-pink-50 text-pink-500 rounded-full p-3 hidden md:block">
              <Cog6ToothIcon className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray">
                Most Booked Services
              </Typography>
              <Typography
                color="gray"
                variant="small"
                className="mt-1 font-normal"
              >
                Services based on booking frequency
              </Typography>
            </div>
          </div>
          <Button
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="flex items-center gap-3"
            onClick={toggleSortOrder}
          >
            {sortOrder === "asc" ? (
              <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
            ) : (
              <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
            )}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                orientation="left"
                tickLine={false}
                className="text-xs w-full"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings" fill="#F05A7E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default MostBookedServicesChart;
