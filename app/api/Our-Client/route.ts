// app/api/Our-Client/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Client, { IClient } from "@/models/Our_Client";

// Define the response type for logos
interface LogoData {
  id: string;
  companyName: string;
  logo: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Fetch only the necessary fields: _id, companyName, companyLogo
    const clients: Pick<IClient, "_id" | "companyName" | "companyLogo">[] =
      await Client.find({}, "_id companyName companyLogo").lean();

    // Map to a simplified structure
    const logos: LogoData[] = clients.map((client) => ({
      id: client._id.toString(),
      companyName: client.companyName,
      logo: client.companyLogo,
    }));

    return NextResponse.json({
      success: true,
      data: logos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
