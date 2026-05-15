import User from "@/models/auth/users";
import connectDB from "@/config/connectDB";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token provided",
        },
        { status: 400 },
      );
    }

    // Clear the token cookie
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
      status: 200,
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: "strict",
      maxAge: 0, // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during logout",
      },
      { status: 500 },
    );
  }
}