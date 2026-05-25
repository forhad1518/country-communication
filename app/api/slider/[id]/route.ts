import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Slider from "@/models/Slider";

// Helper: Check if valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET - Fetch single slider
export async function GET(
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

    return NextResponse.json({ data: slider });
  } catch (error: any) {
    console.error("Error fetching slider:", error);
    return NextResponse.json(
      { error: "Failed to fetch slider" },
      { status: 500 },
    );
  }
}

// PUT - Update slider
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid slider ID" }, { status: 400 });
    }

    // Build update data
    const updateData: any = {};

    if (body.image) {
      updateData.image = {
        url: body.image.url,
        publicId: body.image.publicId || "",
      };
    }
    if (body.comment !== undefined) {
      updateData.comment = body.comment;
    }
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }
    if (body.order !== undefined) {
      updateData.order = body.order;
    }

    const slider = await Slider.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Slider updated successfully",
      data: slider,
    });
  } catch (error: any) {
    console.error("Error updating slider:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update slider" },
      { status: 500 },
    );
  }
}

// DELETE - Delete slider
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid slider ID" }, { status: 400 });
    }

    const slider = await Slider.findByIdAndDelete(id);

    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if publicId exists
    if (slider.image?.publicId) {
      try {
        const { default: cloudinary } = await import("@/lib/cloudinary");
        await cloudinary.uploader.destroy(slider.image.publicId);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    return NextResponse.json({
      message: "Slider deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting slider:", error);
    return NextResponse.json(
      { error: "Failed to delete slider" },
      { status: 500 },
    );
  }
}
