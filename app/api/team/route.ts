// app/api/team/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import TeamMember from "@/models/TeamMember";

// GET - Fetch all team members (public: only active, admin: all)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    const query: any = {};
    if (!isAdmin) {
      query.isActive = true;
    }

    const members = await TeamMember.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch team members" },
      { status: 500 },
    );
  }
}

// POST - Create new team member
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, photo, designation, experienceComment, isActive, order } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      );
    }

    if (!photo || !photo.url) {
      return NextResponse.json(
        { error: "Photo is required" },
        { status: 400 },
      );
    }

    if (!designation || !designation.trim()) {
      return NextResponse.json(
        { error: "Designation is required" },
        { status: 400 },
      );
    }

    // Get next order number if not provided
    let memberOrder = order !== undefined ? Number(order) : 0;
    if (order === undefined || isNaN(memberOrder)) {
      const lastMember = await TeamMember.findOne().sort({ order: -1 });
      memberOrder = lastMember ? lastMember.order + 1 : 0;
    }

    const member = await TeamMember.create({
      name: name.trim(),
      photo: {
        url: photo.url,
        publicId: photo.publicId || "",
      },
      designation: designation.trim(),
      experienceComment: (experienceComment || "").trim(),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: memberOrder,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Team member created successfully",
        data: member,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating team member:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create team member" },
      { status: 500 },
    );
  }
}
