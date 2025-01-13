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
  badge,
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
import { BellIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/slice/userSlice";
import { setNotifications } from "@/redux/slice/notificationSlice";
import axios from "axios";
import Image from "next/image";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/notification/countNotification`
        );
        dispatch(setNotifications(response.data.notifications));
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return []; // Return an empty array on error
      }
    };
    getNotifications();
  }, [dispatch]);

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
    {
      path: "/admin/notifications",
      icon: BellIcon,
      label: "Notifications",
      badge: unreadCount,
    },
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
    // { path: "/admin/customize", icon: CubeIcon, label: "Customization" },
  ];

  const renderSidebarItem = ({ path, icon: Icon, label, badge }) => {
    const isActive = pathname === path;
    return (
      <Link href={path} key={path} className="no-underline">
        <ListItem
          className={`${sidebarItemWidth} ${
            isActive ? "bg-gray-50 text-[var(--color)] " : ""
          } flex justify-between items-center`}
        >
          <div className="flex items-center">
            <ListItemPrefix>
              <Tooltip content={label} placement="right">
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-[var(--color)] " : ""
                  }`}
                />
              </Tooltip>
            </ListItemPrefix>
            <Collapse open={!isCollapsed}>
              <Typography
                color={isActive ? "purple" : "purple-gray"}
                className="mr-auto font-normal"
              >
                {label}
              </Typography>
            </Collapse>
          </div>
          {badge && (
            <span className="ml-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
              {badge}
            </span>
          )}
        </ListItem>
      </Link>
    );
  };

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
      className={`min-h-screen max-h-full px-4 transition-all duration-500 rounded-none shadow-none ease-in-out ${sidebarWidth}`}
    >
      <div className=" flex items-center justify-between px-4 pt-3 w-full relative">
        <Collapse open={!isCollapsed} className="overflow-hidden">
          <Link href="/admin" className="flex items-center">
            <Image src={"/trustotry-fav.svg"} width={1000} height={1000} className=" h-10 w-10"/>
          </Link>
        </Collapse>
        <IconButton variant="text" color="purple-gray" onClick={toggleCollapse}>
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
