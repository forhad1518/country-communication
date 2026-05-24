// app/api/portfolio/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Portfolio from "@/models/portfolio";
import axios from "axios";

// Helper: Check if string is valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper: Delete single image from Cloudinary
async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return;
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_APP_URL}/api/upload/image`, {
      data: { publicId },
    });
  } catch (error) {
    console.error(`Failed to delete image ${publicId}:`, error);
  }
}

// Helper: Delete multiple images from Cloudinary
async function deleteMultipleImages(
  images: { url: string; publicId: string }[],
): Promise<void> {
  if (!images || images.length === 0) return;

  for (const image of images) {
    if (image.publicId) {
      await deleteImage(image.publicId);
    }
  }
}

// GET - Fetch single portfolio by slug or ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    let portfolio;

    if (isValidObjectId(slug)) {
      portfolio = await Portfolio.findById(slug);
    } else {
      portfolio = await Portfolio.findOne({ slug: slug });
    }

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: portfolio });
  } catch (error: any) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 },
    );
  }
}

// PUT - Update portfolio by slug or ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const body = await req.json();

    let portfolio;

    if (isValidObjectId(slug)) {
      portfolio = await Portfolio.findByIdAndUpdate(slug, body, {
        new: true,
        runValidators: true,
      });
    } else {
      portfolio = await Portfolio.findOneAndUpdate({ slug: slug }, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Portfolio updated successfully",
      data: portfolio,
    });
  } catch (error: any) {
    console.error("Error updating portfolio:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate key error. Slug may already exist." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 },
    );
  }
}

// DELETE - Delete portfolio by slug or ID (with image cleanup)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    // Find portfolio first to get image references
    let portfolio;

    if (isValidObjectId(slug)) {
      portfolio = await Portfolio.findById(slug);
    } else {
      portfolio = await Portfolio.findOne({ slug: slug });
    }

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    // ===== DELETE ALL ASSOCIATED IMAGES FROM CLOUDINARY =====

    // Delete process images (renders, real images, moodboard)
    if (portfolio.process) {
      await deleteMultipleImages(portfolio.process.rendersImages || []);
      await deleteMultipleImages(portfolio.process.realImages || []);
      await deleteMultipleImages(portfolio.process.moodboardImages || []);
    }

    // Delete client image
    if (portfolio.results?.clientImage?.publicId) {
      await deleteImage(portfolio.results.clientImage.publicId);
    }

    // ===== DELETE PORTFOLIO FROM DATABASE =====
    if (isValidObjectId(slug)) {
      await Portfolio.findByIdAndDelete(slug);
    } else {
      await Portfolio.findOneAndDelete({ slug: slug });
    }

    return NextResponse.json({
      message: "Portfolio and all associated images deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 },
    );
  }
}
