// app/api/auth/change-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import User from "@/models/auth/users";
import { comparePassword, hashPassword } from "@/lib/passwordHash";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // ===== VALIDATION =====
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields are required: currentPassword, newPassword, confirmPassword",
        },
        { status: 400 },
      );
    }

    // Check password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters",
        },
        { status: 400 },
      );
    }

    // Check passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password and confirm password do not match",
        },
        { status: 400 },
      );
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password cannot be the same as current password",
        },
        { status: 400 },
      );
    }

    // ===== GET USER FROM TOKEN =====
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required. Please login again.",
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token. Please login again.",
        },
        { status: 401 },
      );
    }

    // ===== FIND USER =====
    const user = await User.findById(decoded.userId);

    if (!user) {
      // Clear invalid token
      const response = NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
      response.cookies.delete("token");
      return response;
    }

    // Check if user is active
    if (!user.isActive) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Your account has been deactivated",
        },
        { status: 403 },
      );
      response.cookies.delete("token");
      return response;
    }

    // ===== VERIFY CURRENT PASSWORD =====
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect",
        },
        { status: 400 },
      );
    }

    // ===== HASH NEW PASSWORD & SAVE =====
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    // ===== DELETE TOKEN (FORCE LOGOUT) =====
    const response = NextResponse.json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
      status: 200,
    });

    // Clear the token cookie
    response.cookies.delete("token");

    return response;
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error. Please try again.",
      },
      { status: 500 },
    );
  }
}
