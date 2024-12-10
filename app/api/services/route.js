import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service-model";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  await connectMongoDB();
  const service = await Service.create(data);
  return NextResponse.json(service, { status: 201 });
}
