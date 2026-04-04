// import { createPortfolioService } from "../../../services/portfolio.service";
import {createPortfolio, getAllPortfolios } from "@/repositories/portfolio.repo";
import { successResponse, errorResponse } from "../../../utils/response";

export async function POST(request) {
    try{
        const body = await request.json();
        const data = await createPortfolio(body);
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
};

export async function GET() {
    try{
        const data = await getAllPortfolios();
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
}