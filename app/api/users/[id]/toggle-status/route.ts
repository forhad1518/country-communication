// app/api/users/[id]/toggle-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import User from "@/models/auth/users";

// Helper: Check if valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// PUT - Toggle user active status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Find user first to get current status
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true },
    ).select("-password");

    return NextResponse.json({
      message: `User ${updatedUser?.isActive ? "activated" : "deactivated"} successfully`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error toggling status:", error);
    return NextResponse.json(
      { error: "Failed to toggle status" },
      { status: 500 },
    );
  }
}
