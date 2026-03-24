import exhibiton from "../../../models/exhibiton";
import { successResponse, errorResponse } from "../../../utils/response";

export async function POST(request) {
    try{
        const body = await request.json();
        const newExhibition = new exhibiton(body);
        const savedExhibition = await newExhibition.save();
        return successResponse(savedExhibition);
    }catch(error){
        return errorResponse(error.message);
    }
};