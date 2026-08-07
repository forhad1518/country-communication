"use server";
import axios from "axios";
import connectDB from "@/config/connectDB";
import { getAllExhibitions } from "@/repositories/exhibition.repo";
import { successResponse, errorResponse } from "@/utils/response";
export async function GET() {
  await connectDB();
  try {
    const data = await getAllExhibitions();
    // Return only the first 12 exhibitions
    return successResponse(data.slice(0, 12));
  } catch (error) {
    return errorResponse(error.message);
  }
}
