import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Blog from "@/models/blog";

// POST - Add comment to blog by slug
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const body = await req.json();
    const { userName, content, userId, userAvatar, isAdmin } = body;

    if (!userName || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 },
      );
    }

    // Find blog by slug
    const blog = await Blog.findOne({ slug: slug });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Add comment
    const newComment = {
      userId,
      userName,
      userAvatar,
      content,
      isAdmin: isAdmin || false,
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    const addedComment = blog.comments[blog.comments.length - 1];

    return NextResponse.json({
      message: "Comment added successfully",
      data: addedComment,
    });
  } catch (error: any) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 },
    );
  }
}

// DELETE - Remove comment from blog by slug
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 },
      );
    }

    // Find blog by slug
    const blog = await Blog.findOne({ slug: slug });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Helper function to recursively delete comment
    const deleteCommentRecursive = (comments: any[], id: string): boolean => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id.toString() === id) {
          comments.splice(i, 1);
          return true;
        }
        if (comments[i].replies && comments[i].replies.length > 0) {
          if (deleteCommentRecursive(comments[i].replies, id)) {
            return true;
          }
        }
      }
      return false;
    };

    const deleted = deleteCommentRecursive(blog.comments, commentId);

    if (!deleted) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

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
