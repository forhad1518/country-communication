import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Blog from "@/models/blog";

// POST - Add comment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userName, content, userId, userAvatar, isAdmin } = body;

    if (!userName || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blog.comments.push({
      userId,
      userName,
      userAvatar,
      content,
      isAdmin: isAdmin || false,
    });

    await blog.save();

    return NextResponse.json({
      message: "Comment added successfully",
      data: blog.comments[blog.comments.length - 1],
    });
  } catch (error: any) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 },
    );
  }
}

// DELETE - Remove comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Remove comment and its replies
    blog.comments = blog.comments.filter(
      (c: any) => c._id.toString() !== commentId,
    );

    await blog.save();

    return NextResponse.json({
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
