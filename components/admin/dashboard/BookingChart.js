"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { processBookingData } from "@/utils/processBookingData";
import { LoaderCircle } from "lucide-react";
import { CalendarDateRangeIcon } from "@heroicons/react/24/solid";
import formatLargeNumber from "@/utils/formatLargeNumber";

const CHART_COLORS = [
  "#3b82f6", // purple-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

const BookingChart = ({ bookingData, bookingCount, loading }) => {
  const [chartType, setChartType] = useState("line");

  const processedData = useMemo(() => {
    return processBookingData(bookingData);
  }, [bookingData]);

  const renderChart = () => {
    const ChartComponent = chartType === "line" ? LineChart : BarChart;
    const DataComponent = chartType === "line" ? Line : Bar;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(processedData[0])
            .filter((key) => key !== "period")
            .map((key, index) => (
              <DataComponent
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
              />
            ))}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <Card className="w-full max-w-[800px] bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center justify-center h-[500px]">
          <LoaderCircle className="h-12 w-12 text-[var(--color)] /80 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading chart data...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[800px] bg-white rounded-xl shadow-md">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none p-2 bg-white border-b"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--color)] text-white  rounded-full p-3 hidden md:block">
              <CalendarDateRangeIcon className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="purple-gray" className="mb-1">
                Bookings {formatLargeNumber(bookingCount)}
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                Bookings trends by month
              </Typography>
            </div>
          </div>
          <select
            value={chartType}
            onChange={(value) => setChartType(value.target.value)}
            label="Chart Type"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-4">
        <div className="h-[400px]">{renderChart()}</div>
      </CardBody>
    </Card>
  );
};

export default BookingChart;
