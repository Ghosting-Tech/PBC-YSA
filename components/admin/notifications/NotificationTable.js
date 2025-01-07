"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Chip,
  Tooltip,
  IconButton,
  Checkbox,
} from "@material-tailwind/react";
import {
  EyeIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import NotificationDialog from "./NotificationDialog";
import formatDate from "@/utils/formatDate";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications, markAsRead } from "@/redux/slice/notificationSlice";

const NotificationTable = ({ initialNotifications = [] }) => {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [readMenuOpen, setReadMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  useEffect(() => {
    // Set notifications in Redux store
    dispatch(setNotifications(initialNotifications));
  }, [dispatch, initialNotifications]);

  const categories = Array.from(new Set(notifications.map((n) => n.category)));
  const filteredNotifications = notifications.filter((n) => {
    const categoryMatch =
      categoryFilter === "all" || n.category === categoryFilter;
    const readMatch =
      readFilter === "all" ||
      (readFilter === "read" && n.isRead) ||
      (readFilter === "unread" && !n.isRead);
    return categoryMatch && readMatch;
  });

  const handleCategoryFilterClose = (category) => {
    setCategoryFilter(category);
    setMenuOpen(false);
  };

  const handleReadFilterClose = (filter) => {
    setReadFilter(filter);
    setReadMenuOpen(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      important: "amber",
      info: "purple",
      default: "red",
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const handleMarkAsRead = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/admin/notification/${id}`);
      if (response.status === 200) {
        dispatch(markAsRead(id));
        router.refresh();
        toast.success("Notification updated.");
      } else {
        throw new Error("Failed to mark notification as read.");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded-full w-48"></div>
          <div className="h-4 bg-gray-200 rounded-full w-64"></div>
          <div className="h-4 bg-gray-200 rounded-full w-52"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mx-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Typography variant="h5" className="font-bold text-[var(--color)] ">
            Notifications
          </Typography>
          {/* <Chip
            value={`${filteredNotifications.length} ${
              filteredNotifications.length === 1 ? "item" : "items"
            }`}
            className="rounded-full bg-gray-500 text-white"
          /> */}
        </div>
        <div className="flex items-center gap-4">
          <Menu open={menuOpen} handler={setMenuOpen}>
            <MenuHandler>
              <Button
                variant="outlined"
                className="flex items-center gap-2"
                color="gray"
              >
                <FunnelIcon className="h-4 w-4" />
                {categoryFilter === "all" ? "All categories" : categoryFilter}
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => handleCategoryFilterClose("all")}
              >
                All categories
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  className="flex items-center gap-2"
                  onClick={() => handleCategoryFilterClose(category)}
                >
                  <Chip
                    size="sm"
                    value={category}
                    color={getCategoryColor(category)}
                    className="rounded-full"
                  />
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu open={readMenuOpen} handler={setReadMenuOpen}>
            <MenuHandler>
              <Button
                variant="outlined"
                className="flex items-center gap-2"
                color="gray"
              >
                <FunnelIcon className="h-4 w-4" />
                {readFilter === "all"
                  ? "All notifications"
                  : readFilter === "read"
                  ? "Read"
                  : "Unread"}
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => handleReadFilterClose("all")}
              >
                All notifications
              </MenuItem>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => handleReadFilterClose("read")}
              >
                Read
              </MenuItem>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => handleReadFilterClose("unread")}
              >
                Unread
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      <Card className="overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mb-4" />
            <Typography variant="h6" color="gray">
              No notifications found
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              {categoryFilter !== "all" || readFilter !== "all"
                ? `Try changing the filters`
                : `You're all caught up!`}
            </Typography>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {[
                    "IsRead",
                    "S.No",
                    "Title",
                    "From",
                    "Category",
                    "Created At",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border-b border-gray-100 bg-gray-50/50 p-4"
                    >
                      <Typography
                        variant="medium"
                        color="gray"
                        className="font-bold leading-none"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification, index) => {
                  const isLast = index === filteredNotifications.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-gray-50";

                  return (
                    <tr
                      key={notification._id}
                      className={`hover:bg-gray-50/50 ${
                        notification.isRead ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className={classes}>
                        <Checkbox
                          color="purple"
                          checked={notification.isRead}
                          onChange={() => handleMarkAsRead(notification._id)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="purple-gray">
                          {index + 1}.
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="purple-gray">
                          {notification.title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="purple-gray">
                          {notification.from}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          size="xs"
                          value={notification.category}
                          color={getCategoryColor(notification.category)}
                          className="rounded-full w-fit"
                        />
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="purple-gray">
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <Tooltip content="View Details" color="purple">
                            <IconButton
                              variant="text"
                              color="purple-gray"
                              onClick={() =>
                                setSelectedNotification(notification)
                              }
                            >
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Booking Page" color="purple">
                            <Link href={notification.link}>
                              <IconButton variant="text" color="purple-gray">
                                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                              </IconButton>
                            </Link>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedNotification && (
        <NotificationDialog
          notification={selectedNotification}
          open={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default NotificationTable;
