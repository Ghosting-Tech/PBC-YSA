import React from "react";
import {
  UserGroupIcon,
  UserIcon,
  CogIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  ArrowsRightLeftIcon,
  CheckBadgeIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import formatLargeNumber from "@/utils/formatLargeNumber";

const Card = ({ label, value, icon: Icon, color, graph }) => (
  <Tooltip content={`${label}: ${value}`} placement="top">
    <div
      className={`bg-white p-4 rounded-lg shadow-md flex items-center justify-between overflow-hidden relative group hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
    >
      <div className="flex items-center space-x-3 z-10">
        <Icon className={`w-8 h-8 ${color}`} />
        <div>
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center">
        {graph}
      </div>
      <div
        className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>
    </div>
  </Tooltip>
);

const MiniGraph = ({ data, color }) => (
  <svg className="w-14 h-14" viewBox="0 0 50 25">
    {data.map((value, index) => (
      <React.Fragment key={index}>
        <circle
          cx={index * 12.5 + 2.5}
          cy={25 - value / 2}
          r="1.5"
          className={`${color} fill-current`}
        />
        {index > 0 && (
          <line
            x1={(index - 1) * 12.5 + 2.5}
            y1={25 - data[index - 1] / 2}
            x2={index * 12.5 + 2.5}
            y2={25 - value / 2}
            className={`${color} stroke-current`}
            strokeWidth="1"
          />
        )}
      </React.Fragment>
    ))}
  </svg>
);

const DashboardCard = ({ data }) => {
  const cardData = [
    {
      id: 1,
      label: "Total Services",
      value: formatLargeNumber(data.totalServices),
      color: "text-amber-500",
      icon: CogIcon,
      graph: <MiniGraph data={[20, 15, 30, 25]} color="text-amber-500" />,
    },
    {
      id: 2,
      label: "Inactive Services",
      value: formatLargeNumber(data.inactiveServices),
      color: "text-red-500",
      icon: XCircleIcon,
      graph: <MiniGraph data={[10, 5, 15, 8]} color="text-red-500" />,
    },
    {
      id: 4,
      label: "Sub Services",
      value: formatLargeNumber(data.totalSubServices),
      color: "text-green-500",
      icon: ChartBarIcon,
      graph: <MiniGraph data={[10, 20, 15, 25]} color="text-green-500" />,
    },
    {
      id: 5,
      label: "Users",
      value: formatLargeNumber(data.totalUsers),
      color: "text-indigo-500",
      icon: UserGroupIcon,
      graph: <MiniGraph data={[30, 25, 35, 40]} color="text-indigo-500" />,
    },
    {
      id: 6,
      label: "Active Users",
      value: formatLargeNumber(data.activeUsers),
      color: "text-purple-500",
      icon: UserIcon,
      graph: <MiniGraph data={[20, 30, 25, 35]} color="text-purple-500" />,
    },
    {
      id: 7,
      label: "Total Providers",
      value: formatLargeNumber(data.totalServiceProviders),
      color: "text-purple-500",
      icon: BriefcaseIcon,
      graph: <MiniGraph data={[15, 20, 25, 30]} color="text-purple-500" />,
    },
    {
      id: 8,
      label: "Active Providers",
      value: formatLargeNumber(data.activeServiceProviders),
      color: "text-teal-500",
      icon: ShieldCheckIcon,
      graph: <MiniGraph data={[10, 15, 2, 25]} color="text-teal-500" />,
    },
    {
      id: 9,
      label: "Bookings",
      value: formatLargeNumber(data.totalBookings),
      color: "text-orange-500",
      icon: CalendarDaysIcon,
      graph: <MiniGraph data={[10, 5, 30, 25]} color="text-orange-500" />,
    },
    {
      id: 10,
      label: "Canceled Bookings",
      value: formatLargeNumber(data.canceledBookings),
      color: "text-red-500",
      icon: ArchiveBoxXMarkIcon,
      graph: <MiniGraph data={[10, 5, 30, 25]} color="text-red-500" />,
    },
    {
      id: 11,
      label: "Pending Bookings",
      value: formatLargeNumber(data.pendingBookings),
      color: "text-amber-500",
      icon: ArrowsRightLeftIcon,
      graph: <MiniGraph data={[10, 5, 30, 25]} color="text-amber-500" />,
    },
    {
      id: 12,
      label: "Ongoing Bookings",
      value: formatLargeNumber(data.onGoingBookings),
      color: "text-deep-purple-500",
      icon: LightBulbIcon,
      graph: <MiniGraph data={[10, 5, 30, 25]} color="text-deep-purple-500" />,
    },
    {
      id: 13,
      label: "Completed Bookings",
      value: formatLargeNumber(data.completedBookings),
      color: "text-green-500",
      icon: CheckBadgeIcon,
      graph: <MiniGraph data={[10, 5, 30, 25]} color="text-green-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cardData.map(({ id, label, value, color, icon, graph }) => (
        <Card
          key={id}
          label={label}
          value={value}
          icon={icon}
          color={color}
          graph={graph}
        />
      ))}
    </div>
  );
};

export default DashboardCard;
