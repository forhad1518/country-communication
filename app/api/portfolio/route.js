import connectDB from "@/config/connectDB";
import {createPortfolio, getAllPortfolios } from "@/repositories/portfolio.repo";
import { successResponse, errorResponse } from "@/utils/response";

export async function POST(request) {
    await connectDB();
    try{
        const body = await request.json();
        const data = await createPortfolio(body);
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
};

export async function GET() {
    await connectDB();
    try{
        const data = await getAllPortfolios();
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
}
