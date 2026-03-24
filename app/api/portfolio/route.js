import { createPortfolioService } from "../../../services/portfolio.service";
import { successResponse, errorResponse } from "../../../utils/response";

export async function POST(request) {
    try{
        const body = await request.json();
        const data = await createPortfolioService(body);
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
};