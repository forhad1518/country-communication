import connectDB from "../../../config/connectDB";
import { createMenu } from "../../../repositories/addmenu.repo";
import { getAllMenus } from "../../../repositories/addmenu.repo";
import { successResponse, errorResponse } from "../../../utils/response";

export async function POST(request) {
    await connectDB();
    try{
        const body = await request.json();
        const data = await createMenu(body);
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
};

export async function GET() {
    await connectDB();
    try{
        const data = await getAllMenus();
        return successResponse(data);
    }catch(error){
        return errorResponse(error.message);
    }
};