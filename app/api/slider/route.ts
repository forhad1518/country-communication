// app/api/slider/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Slider from "@/models/Slider";

// GET - Fetch all sliders (public: only active, admin: all)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    const query: any = {};

    // Public: only active sliders
    if (!isAdmin) {
      query.isActive = true;
    }

    const sliders = await Slider.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ data: sliders });
  } catch (error: any) {
    console.error("Error fetching sliders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch sliders" },
      { status: 500 },
    );
  }
}

// POST - Create new slider
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { image, comment, isActive, order } = body;

    // Validate required fields
    if (!image || !image.url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // Get next order number if not provided
    let sliderOrder = order || 0;
    if (!order) {
      const lastSlider = await Slider.findOne().sort({ order: -1 });
      sliderOrder = lastSlider ? lastSlider.order + 1 : 0;
    }

    const slider = await Slider.create({
      image: {
        url: image.url,
        publicId: image.publicId || "",
      },
      comment: comment || "",
      isActive: isActive !== undefined ? isActive : true,
      order: sliderOrder,
    });

    return NextResponse.json(
      { message: "Slider created successfully", data: slider },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating slider:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create slider" },
      { status: 500 },
    );
  }
}
