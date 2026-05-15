import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Blog from "@/models/blog";

// GET - Fetch all blogs (with pagination & filters)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    const query: any = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-comments"), // Exclude comments for list view
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

// POST - Create new blog
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Validate required fields
    if (
      !body.title ||
      !body.category ||
      !body.image ||
      !body.authorName ||
      !body.content ||
      !body.slug
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: body.slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 },
      );
    }

    const blog = await Blog.create(body);

    return NextResponse.json(
      { message: "Blog created successfully", data: blog },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating blog:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create blog" },
      { status: 500 },
    );
  }
}
