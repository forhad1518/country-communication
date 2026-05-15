import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Blog from "@/models/blog";

// GET - Fetch single blog by ID or slug
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const blog = await Blog.findOne({
      $or: [{ _id: params.id }, { slug: params.id }],
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Increment views (optional)
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return NextResponse.json({ data: blog });
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

// PUT - Update blog
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const body = await req.json();

    const blog = await Blog.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error: any) {
    console.error("Error updating blog:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

// DELETE - Delete blog
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const blog = await Blog.findByIdAndDelete(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
