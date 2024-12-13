import uploadImage from "@/utils/uploadImage";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const pathname = formData.get("pathname");
    const previousImgRef = formData.get("previousImgRef");

    if (!file || !pathname) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const result = await uploadImage(file, pathname, previousImgRef);
    return NextResponse.json({
      success: true,
      image: result,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.log("Error uploading image: ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
}
