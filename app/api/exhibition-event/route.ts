import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import ExhibitionEvent from "@/models/ExhitbitionEvent";

// GET - Fetch exhibition events
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    let exhibitionEvent = await ExhibitionEvent.findOne();

    // Auto-create if not exists
    if (!exhibitionEvent) {
      exhibitionEvent = await ExhibitionEvent.create({
        running: {
          exhibitionName: "",
          location: "",
          description: "",
          startDate: null,
          endDate: null,
          isActive: true,
        },
        next: {
          exhibitionName: "",
          location: "",
          description: "",
          startDate: null,
          endDate: null,
          isActive: true,
        },
      });
    }

    return NextResponse.json({ data: exhibitionEvent });
  } catch (error: any) {
    console.error("Error fetching exhibition events:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch exhibition events" },
      { status: 500 },
    );
  }
}

// PUT - Update exhibition events
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { running, next } = body;

    let exhibitionEvent = await ExhibitionEvent.findOne();

    if (exhibitionEvent) {
      // Update running event
      if (running) {
        if (running.exhibitionName !== undefined)
          exhibitionEvent.running.exhibitionName = running.exhibitionName;
        if (running.location !== undefined)
          exhibitionEvent.running.location = running.location;
        if (running.description !== undefined)
          exhibitionEvent.running.description = running.description;
        if (running.startDate !== undefined)
          exhibitionEvent.running.startDate = running.startDate
            ? new Date(running.startDate)
            : null;
        if (running.endDate !== undefined)
          exhibitionEvent.running.endDate = running.endDate
            ? new Date(running.endDate)
            : null;
        if (running.isActive !== undefined)
          exhibitionEvent.running.isActive = running.isActive;
      }

      // Update next event
      if (next) {
        if (next.exhibitionName !== undefined)
          exhibitionEvent.next.exhibitionName = next.exhibitionName;
        if (next.location !== undefined)
          exhibitionEvent.next.location = next.location;
        if (next.description !== undefined)
          exhibitionEvent.next.description = next.description;
        if (next.startDate !== undefined)
          exhibitionEvent.next.startDate = next.startDate
            ? new Date(next.startDate)
            : null;
        if (next.endDate !== undefined)
          exhibitionEvent.next.endDate = next.endDate
            ? new Date(next.endDate)
            : null;
        if (next.isActive !== undefined)
          exhibitionEvent.next.isActive = next.isActive;
      }

      await exhibitionEvent.save();
    } else {
      // Create new
      exhibitionEvent = await ExhibitionEvent.create({
        running: {
          exhibitionName: running?.exhibitionName || "",
          location: running?.location || "",
          description: running?.description || "",
          startDate: running?.startDate ? new Date(running.startDate) : null,
          endDate: running?.endDate ? new Date(running.endDate) : null,
          isActive: running?.isActive !== undefined ? running.isActive : true,
        },
        next: {
          exhibitionName: next?.exhibitionName || "",
          location: next?.location || "",
          description: next?.description || "",
          startDate: next?.startDate ? new Date(next.startDate) : null,
          endDate: next?.endDate ? new Date(next.endDate) : null,
          isActive: next?.isActive !== undefined ? next.isActive : true,
        },
      });
    }

    return NextResponse.json({
      message: "Exhibition events updated successfully",
      data: exhibitionEvent,
    });
  } catch (error: any) {
    console.error("Error updating exhibition events:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update exhibition events" },
      { status: 500 },
    );
  }
}
