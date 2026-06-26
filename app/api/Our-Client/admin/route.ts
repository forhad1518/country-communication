import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Client, { IClient } from "@/models/Our_Client";

// GET all clients (with optional search & pagination)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build search filter
    const filter = search
      ? {
          $or: [
            { companyName: { $regex: search, $options: "i" } },
            { clientName: { $regex: search, $options: "i" } },
            { clientEmail: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Client.countDocuments(filter);
    const clients: IClient[] = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - create a new client
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: Partial<IClient> = await request.json();

    // Validate required fields
    const requiredFields = [
      "companyName",
      "companyLogo",
      "clientName",
      "clientEmail",
    ];
    for (const field of requiredFields) {
      if (!body[field as keyof IClient]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    const client = new Client(body);
    await client.save();

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
