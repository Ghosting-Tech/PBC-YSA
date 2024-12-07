"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  IconButton,
  Tooltip,
  Collapse,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CurrencyRupeeIcon,
  TicketIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CubeIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/slice/userSlice";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const sidebarItemWidth = isCollapsed ? "w-12" : "w-full";

  const sidebarItems = [
    { path: "/admin", icon: QueueListIcon, label: "Dashboard" },
    { path: "/admin/services", icon: Cog6ToothIcon, label: "Services" },
    {
      path: "/admin/bookings?page=1",
      icon: CalendarDaysIcon,
      label: "Bookings",
    },
    { path: "/admin/users?page=1", icon: UserCircleIcon, label: "Users" },
    {
      path: "/admin/service-providers?page=1",
      icon: UsersIcon,
      label: "Service Provider",
    },
    { path: "/admin/payments", icon: CurrencyRupeeIcon, label: "Payments" },
    { path: "/admin/blogs", icon: BookOpenIcon, label: "Blogs" },
    { path: "/admin/tickets", icon: TicketIcon, label: "Tickets" },
    { path: "/admin/customize", icon: CubeIcon, label: "Customization" },
  ];

  const renderSidebarItem = ({ path, icon: Icon, label }) => {
    const isActive = pathname === path;
    return (
      <Link href={path} key={path} className="no-underline">
        <ListItem
          className={`${sidebarItemWidth} ${
            isActive ? "bg-blue-gray-50 text-blue-500" : ""
          }`}
        >
          <ListItemPrefix>
            <Tooltip content={label} placement="right">
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-500" : ""}`} />
            </Tooltip>
          </ListItemPrefix>
          <Collapse open={!isCollapsed}>
            <Typography
              color={isActive ? "blue" : "blue-gray"}
              className="mr-auto font-normal"
            >
              {label}
            </Typography>
          </Collapse>
        </ListItem>
      </Link>
    );
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/users/logout", {
      method: "GET",
    });
    toast.success("Logged out successfully!");
    router.push("/");
    dispatch(setUser(null));
  };

  return (
    <Card
      className={`min-h-screen max-h-full p-4 transition-all duration-500 rounded-none shadow-none ease-in-out ${sidebarWidth}`}
    >
      <div className="mb-2 flex items-center justify-between p-4 w-full relative">
        <Collapse open={!isCollapsed} className="overflow-hidden">
          <Link href="/admin" className="flex items-center">
            <div className="text-2xl font-racing">YSA</div>
          </Link>
        </Collapse>
        <IconButton variant="text" color="blue-gray" onClick={toggleCollapse}>
          {isCollapsed ? (
            <ChevronRightIcon strokeWidth={2.5} className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon strokeWidth={2.5} className="h-5 w-5" />
          )}
        </IconButton>
      </div>
      <List className="p-0 pr-4">
        {sidebarItems.map(renderSidebarItem)}

        <ListItem
          onClick={handleLogout}
          className={`hover:bg-red-100 text-red-500 hover:text-red-500 ${sidebarItemWidth}`}
        >
          <ListItemPrefix>
            <Tooltip content="Log Out" placement="right">
              <PowerIcon className="h-5 w-5" />
            </Tooltip>
          </ListItemPrefix>
          <Collapse open={!isCollapsed}>
            <Typography color="red" className="mr-auto font-normal">
              Log Out
            </Typography>
          </Collapse>
        </ListItem>
      </List>
    </Card>
  );
}
