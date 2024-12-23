"use server";
import React from "react";
import NotificationTable from "@/components/admin/notifications/NotificationTable";
import axios from "axios";
import PaginationBtn from "@/components/PaginationBtn";
import { Suspense } from "react";
import Loading from "@/components/Loading";

const getNotifications = async (page = 1, limit = 3) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/notification`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    // Ensure the response includes both data and metadata
    return {
      notifications: Array.isArray(response.data.notifications)
        ? response.data.notifications
        : [],
      meta: response.data.meta || { totalPages: 1 },
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      notifications: [],
      meta: { totalPages: 1 },
    };
  }
};

const NotificationsContent = async ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1;
  const { notifications, meta } = await getNotifications(page);

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <NotificationTable initialNotifications={notifications} />
      <PaginationBtn totalPages={meta.totalPages} />
    </div>
  );
};

const Page = async ({ searchParams }) => {
  return (
    <Suspense fallback={<Loading />}>
      <NotificationsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
