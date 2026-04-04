import connectDB from "@/config/connectDB";
import { getPortfolioBySlug } from "@/repositories/portfolio.repo";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    await connectDB();

    try {
        const { slug } = await params;
        const data = await getPortfolioBySlug(slug);

        return successResponse(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResponse(message);
    }
}