"use server";
import axios from "axios";
import connectDB from "@/config/connectDB";
import {
  createExhibition,
  getAllExhibitions,
  updateExhibition,
  deleteExhibition,
} from "@/repositories/exhibition.repo";
import { successResponse, errorResponse } from "@/utils/response";

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const data = await createExhibition(body);
    return successResponse(data);
  } catch (error) {
    return errorResponse(error.message);
  }
}

export async function GET() {
  await connectDB();
  try {
    const data = await getAllExhibitions();
    return successResponse(data);
  } catch (error) {
    return errorResponse(error.message);
  }
}

export async function PUT(data) {
  await connectDB();
  try {
    const { id, ...updateData } = await data.json();
    const updatedExhibition = await updateExhibition(id, updateData);
    return successResponse(updatedExhibition);
  } catch (error) {
    return errorResponse(error.message);
  }
}

export async function DELETE(request) {
  await connectDB();
  try {
    const body = await request.json();
    const { id } = body;
    const data = await deleteExhibition(id);
    return successResponse(data);
  } catch (error) {
    return errorResponse(error.message);
  }
}
