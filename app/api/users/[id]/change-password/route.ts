// app/api/users/[id]/change-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import User from "@/models/auth/users";
import { hashPassword } from "@/lib/passwordHash";

// Helper: Check if valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// PUT - Change user password
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();
    const { newPassword } = body;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Password changed successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
