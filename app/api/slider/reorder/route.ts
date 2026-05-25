// app/api/slider/reorder/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Slider from "@/models/Slider";

// PUT - Reorder sliders
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { orders } = body; // Array of { id: string, order: number }

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json(
        { error: "Orders array is required" },
        { status: 400 },
      );
    }

    // Update all sliders with new order
    const updates = orders.map((item: { id: string; order: number }) =>
      Slider.findByIdAndUpdate(item.id, { order: item.order }),
    );

    await Promise.all(updates);

    return NextResponse.json({
      message: "Sliders reordered successfully",
    });
  } catch (error: any) {
    console.error("Error reordering sliders:", error);
    return NextResponse.json(
      { error: "Failed to reorder sliders" },
      { status: 500 },
    );
  }
}
