import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import User from "@/models/auth/users";
import { comparePassword } from "@/lib/passwordHash";
import { generateToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // ===== CHECK USER STATUS =====
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has been deactivated. Please contact administrator.",
        },
        { status: 403 },
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id,
      role: user.role,
      email: user.email,
    });

    // Update last login time
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      status: 200,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    );
  }
}
