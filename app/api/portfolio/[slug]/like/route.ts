// app/api/portfolio/[slug]/track/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Portfolio from "@/models/portfolio";

// Helper: Check if string is valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper: Find portfolio by slug or ID
async function findPortfolio(slug: string) {
  if (isValidObjectId(slug)) {
    return await Portfolio.findById(slug);
  }
  return await Portfolio.findOne({ slug: slug });
}

// ===== POST - Increment Views =====
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const body = await req.json();
    const action = body.action; // "view" or "like" or "unlike"

    const portfolio = await findPortfolio(slug);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    let updateData: any = {};

    switch (action) {
      case "view":
        // Increment views by 1
        updateData = { $inc: { views: 1 } };
        break;

      case "like":
        // Increment likes by 1
        updateData = { $inc: { likes: 1 } };
        break;

      case "unlike":
        // Decrement likes by 1 (but not below 0)
        updateData = { $inc: { likes: portfolio.likes > 0 ? -1 : 0 } };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'view', 'like', or 'unlike'" },
          { status: 400 },
        );
    }

    const updated = await Portfolio.findByIdAndUpdate(
      portfolio._id,
      updateData,
      { new: true },
    ).select("views likes");

    return NextResponse.json({
      message: `${action} tracked successfully`,
      views: updated?.views || 0,
      likes: updated?.likes || 0,
    });
  } catch (error: any) {
    console.error(`Error tracking:`, error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}

// ===== GET - Get views and likes count =====
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const portfolio = await findPortfolio(slug);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      views: portfolio.views || 0,
      likes: portfolio.likes || 0,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
