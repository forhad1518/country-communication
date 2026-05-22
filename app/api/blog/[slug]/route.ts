import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Blog from "@/models/blog";

// GET - Fetch single blog by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    // Find by slug
    const blog = await Blog.findOne({ slug: slug });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Increment views
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

// Helper: Check if string is valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
// PUT - Update blog (auto-detect ID or slug)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params; // This could be actual slug OR MongoDB ObjectId
    const body = await req.json();

    let blog;

    // Check what type of value we received
    if (isValidObjectId(slug)) {
      // ===== It's a MongoDB ObjectId =====
      // Example: "6a085379e2e60387f03e5025"
      blog = await Blog.findByIdAndUpdate(
        slug, // Direct MongoDB _id
        body,
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      // ===== It's a slug string =====
      // Example: "third-blog-post-for-try-image"
      blog = await Blog.findOneAndUpdate(
        { slug: slug }, // Find by slug field
        body,
        {
          new: true,
          runValidators: true,
        },
      );
    }

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

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate key error. Slug may already exist." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

// DELETE - Delete blog by slug
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    // Find and delete by slug
    const blog = await Blog.findOneAndDelete({ slug: slug });

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
