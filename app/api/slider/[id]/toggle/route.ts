// app/api/slider/[id]/toggle/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Slider from "@/models/Slider";

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// PUT - Toggle slider active status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid slider ID" }, { status: 400 });
    }

    const slider = await Slider.findById(id);
    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    const updated = await Slider.findByIdAndUpdate(
      id,
      { isActive: !slider.isActive },
      { new: true },
    );

    return NextResponse.json({
      message: `Slider ${updated?.isActive ? "activated" : "deactivated"} successfully`,
      data: updated,
    });
  } catch (error: any) {
    console.error("Error toggling slider:", error);
    return NextResponse.json(
      { error: "Failed to toggle slider" },
      { status: 500 },
    );
  }
}
