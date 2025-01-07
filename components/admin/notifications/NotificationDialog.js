"use client";
import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import formatDate from "@/utils/formatDate";
import Link from "next/link";
const NotificationDialog = ({ notification, open, onClose }) => {
  if (!notification) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="overflow-y-auto">
      <DialogHeader>
        <Typography variant="h5" className="font-bold">
          {notification.title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4">
        <div className="flex">
          <Typography className="font-semibold w-1/4">From:</Typography>
          <Typography className="w-3/4">{notification.from}</Typography>
        </div>
        <div className="flex">
          <Typography className="font-semibold w-1/4">Category:</Typography>
          <Typography className="w-3/4">{notification.category}</Typography>
        </div>
        <div className="flex">
          <Typography className="font-semibold w-1/4">Description:</Typography>
          <Typography className="w-3/4">{notification.description}</Typography>
        </div>
        <div className="flex">
          <Typography className="font-semibold w-1/4">Link:</Typography>
          <Link
            href={notification.link}
            className="w-3/4 !text-[var(--color)]  underline"
          >
            {notification.link}
          </Link>
        </div>
        <div className="flex">
          <Typography className="font-semibold w-1/4">Created:</Typography>
          <Typography className="w-3/4">
            {formatDate(notification.createdAt)}
          </Typography>
        </div>
        {notification.image.url && (
          <div className="flex">
            <Typography className="font-semibold w-1/4">Document:</Typography>
            <div className="w-3/4">
              <a
                href={notification.image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="!text-[var(--color)]  underline"
              >
                {notification.image.name ||
                  notification.image.url.split("/").pop()}
              </a>
            </div>
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={() => onClose(false)}
          color="purple"
          className="ml-auto"
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default NotificationDialog;
