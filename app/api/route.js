import { successResponse, errorResponse } from "../../utils/response"
export async function GET() {
   return new Response("Hello API")
}