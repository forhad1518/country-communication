import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Quote from "@/models/Quote";

// GET: Retrieve single quote details by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const quote = await Quote.findById(id);
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quote });
  } catch (error: any) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Update quote status or details
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedQuote = await Quote.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully",
      data: updatedQuote,
    });
  } catch (error: any) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update quote" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a quote by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedQuote = await Quote.findByIdAndDelete(id);
    if (!deletedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete quote" },
      { status: 500 }
    );
  }
}
