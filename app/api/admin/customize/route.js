import { NextResponse } from "next/server";
import { adminStorage } from "@/libs/adminFirebase"; // Import your Firebase Admin SDK
import connectMongoDB from "@/libs/mongodb";
import Customize from "@/models/customize";

export async function POST(request) {
  try {
    const formData = await request.formData();
    // Extract headings
    const heading1 = formData.get("heading1");
    const heading2 = formData.get("heading2");
    const heading3 = formData.get("heading3");
    const heading4 = formData.get("heading4");

    const images = formData.getAll("images");
    const videos = formData.getAll("videos");
    console.log(heading1, heading2, heading3, heading4, images, videos);

    const uploadedImages = [];
    const uploadedVideos = [];

    // Helper function to upload files to Firebase
    const uploadToFirebase = async (file, folder) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `customize/${folder}/${Date.now()}-${file.name}`;
      const fileUpload = adminStorage.file(filename);

      await fileUpload.save(buffer, {
        metadata: { contentType: file.type },
      });
      await fileUpload.makePublic();

      // Generate correct public URL for Firebase
      const publicUrl = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/${filename}`;

      return {
        url: publicUrl, // Store public URL
        name: filename, // Save file name for deletion
      };
    };

    // Helper function to delete files from Firebase
    const deleteFromFirebase = async (file) => {
      const fileRef = adminStorage.file(file.name);
      try {
        await fileRef.delete();
      } catch (err) {
        console.error(`Failed to delete file ${file.name}:`, err.message);
      }
    };

    // Connect to MongoDB
    await connectMongoDB();

    // Retrieve the existing data from the database
    const existingContent = await Customize.findOne();

    // Delete existing images and videos from Firebase
    if (existingContent) {
      for (const image of existingContent.images) {
        await deleteFromFirebase(image);
      }
      for (const video of existingContent.videos) {
        await deleteFromFirebase(video);
      }
    }

    // Upload new images to Firebase
    for (const image of images) {
      const uploadedImage = await uploadToFirebase(image, "images");
      uploadedImages.push(uploadedImage);
    }

    // Upload new videos to Firebase
    for (const video of videos) {
      const uploadedVideo = await uploadToFirebase(video, "videos");
      uploadedVideos.push(uploadedVideo);
    }

    // Save all data to the database
    const newContent = await Customize.findOneAndUpdate(
      {},
      {
        heading1,
        heading2,
        heading3,
        heading4,
        images: uploadedImages,
        videos: uploadedVideos,
      },
      { new: true, upsert: true } // `upsert` creates a new document if none exists
    );

    console.log({ content: newContent });
    // const savedContent = await newContent.save();

    return NextResponse.json({
      message: "Upload successful",
      content: newContent,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload files or save data", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    const allContent = await Customize.find();

    if (!allContent || allContent.length === 0) {
      return NextResponse.json(
        { message: "No data found", content: [] },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Data retrieved successfully",
      content: allContent,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data", error: error.message },
      { status: 500 }
    );
  }
}
