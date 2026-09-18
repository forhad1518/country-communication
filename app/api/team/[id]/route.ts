// app/api/team/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import TeamMember from "@/models/TeamMember";
import cloudinary from "@/lib/cloudinary";

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET - Fetch single team member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid team member ID" }, { status: 400 });
    }

    const member = await TeamMember.findById(id);

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error: any) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 },
    );
  }
}

// PUT - Update team member
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid team member ID" }, { status: 400 });
    }

    const existingMember = await TeamMember.findById(id);
    if (!existingMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    const updateData: any = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      updateData.name = body.name.trim();
    }

    if (body.designation !== undefined) {
      if (!body.designation.trim()) {
        return NextResponse.json(
          { error: "Designation cannot be empty" },
          { status: 400 },
        );
      }
      updateData.designation = body.designation.trim();
    }

    if (body.experienceComment !== undefined) {
      updateData.experienceComment = body.experienceComment.trim();
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    if (body.order !== undefined) {
      updateData.order = Number(body.order);
    }

    if (body.photo) {
      if (!body.photo.url) {
        return NextResponse.json(
          { error: "Photo URL cannot be empty" },
          { status: 400 },
        );
      }

      // If new photo publicId is different and old photo had publicId, remove old photo from Cloudinary
      if (
        existingMember.photo?.publicId &&
        existingMember.photo.publicId !== body.photo.publicId
      ) {
        try {
          await cloudinary.uploader.destroy(existingMember.photo.publicId);
        } catch (cErr) {
          console.error("Failed to remove old photo from Cloudinary:", cErr);
        }
      }

      updateData.photo = {
        url: body.photo.url,
        publicId: body.photo.publicId || "",
      };
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      message: "Team member updated successfully",
      data: updatedMember,
    });
  } catch (error: any) {
    console.error("Error updating team member:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 },
    );
  }
}

// DELETE - Delete team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid team member ID" }, { status: 400 });
    }

    const member = await TeamMember.findByIdAndDelete(id);

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    // Delete photo from Cloudinary if publicId exists
    if (member.photo?.publicId) {
      try {
        await cloudinary.uploader.destroy(member.photo.publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 },
    );
  }
}
