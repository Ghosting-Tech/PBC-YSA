import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Dialog,
} from "@material-tailwind/react";
import Image from "next/image";
const isPdf = (documentInfo) => {
  // Method 1: Check file extension
  const fileExtCheck = documentInfo?.url?.toLowerCase().endsWith(".pdf");

  // Method 2: Check MIME type if available
  const mimeTypeCheck = documentInfo?.contentType === "application/pdf";

  // Method 3: Check filename
  const filenameCheck = documentInfo?.name?.toLowerCase().endsWith(".pdf");

  // Return true if any of the checks pass
  return fileExtCheck || mimeTypeCheck || filenameCheck;
};
// Reusable DocumentCard Component
const DocumentCard = ({ documentInfo, onImageClick, cardTitle }) => {
  const isPdfDocument = isPdf(documentInfo);

  return (
    <Card className="cursor-pointer shadow-none border">
      <CardHeader
        floated={false}
        className="relative h-48 shadow-none"
        onClick={() => onImageClick(documentInfo?.url)}
      >
        {isPdfDocument ? (
          <iframe
            src={documentInfo?.url}
            className="h-full w-full"
            title={`${cardTitle} Document`}
          ></iframe>
        ) : (
          <Image
            width={1000}
            height={1000}
            alt={cardTitle}
            src={documentInfo?.url}
            className="h-full w-full object-cover"
          />
        )}
      </CardHeader>
      <CardBody className="flex justify-between items-center">
        <Typography variant="p" color="purple-gray">
          {cardTitle}
        </Typography>
        {isPdfDocument && (
          <a
            href={documentInfo?.url}
            download
            target="_blank"
            className="text-purple-500 hover:text-purple-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Download
          </a>
        )}
      </CardBody>
    </Card>
  );
};
export default DocumentCard;
