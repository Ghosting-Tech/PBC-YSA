import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { bookingId, uploadedImage } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "booking id is required!" },
        { status: 404 }
      );
    }
    if (!uploadedImage) {
      return NextResponse.json(
        { success: false, message: "Image is required!" },
        { status: 404 }
      );
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        verificationImage: uploadedImage,
      },
      { new: true }
    );

    console.log({ uploadedImage });
    console.log({ booking });
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Image uploaded successfully!", success: true, booking },
      { status: 200 }
    );
  } catch (error) {
    console.log("error on uploading verification image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file");
//     const previousImageName = formData.get("previousImageName");

//     if (!file) {
//       return NextResponse.json({ error: "No file received." }, { status: 400 });
//     }

//     // Delete previous image if it exists
//     if (previousImageName) {
//       try {
//         await adminStorage.file(previousImageName).delete();
//       } catch (error) {
//         console.log("Error deleting previous image:", error);
//       }
//     }

//     // Create buffer from file
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Generate unique filename
//     const filename = `service-provider-verification-image/${Date.now()}-${
//       file.name
//     }`;

//     // Upload to Firebase Storage using Admin SDK
//     const fileUpload = adminStorage.file(filename);

//     await fileUpload.save(buffer, {
//       metadata: {
//         contentType: file.type,
//       },
//     });

//     // Make the file publicly accessible
//     await fileUpload.makePublic();

//     // Get the public URL
//     const publicUrl = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/${filename}`;

//     return NextResponse.json({
//       message: "Upload successful",
//       imageUrl: publicUrl,
//       imageName: filename,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { message: "Failed to upload image", error: error.message },
//       { status: 500 }
//     );
//   }
// }
