"use server"
import connectDB from "../../../config/connectDB";
import { createExhibition } from "../../../repositories/exhibition.repo";
import { successResponse, errorResponse } from "../../../utils/response";

export async function POST(request) {
    
    await connectDB();
    try{
        const body = await request.json();
        const data = await createExhibition(body);
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
};

export async function GET(request) {
    await connectDB();
    try{
        const data = await getAllExhibitions();
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
};