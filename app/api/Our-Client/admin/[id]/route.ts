// app/api/Our-Client/admin/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Client, { IClient } from "@/models/Our_Client";

// GET - fetch a single client by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // await the params
    await connectDB();

    const client: IClient | null = await Client.findById(id).lean();

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: client });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT - update a client by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // await the params
    await connectDB();

    const body: Partial<IClient> = await request.json();

    // Prevent updating _id
    delete body._id;

    const client: IClient | null = await Client.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: client });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - remove a client by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // await the params
    await connectDB();

    const client: IClient | null = await Client.findByIdAndDelete(id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
