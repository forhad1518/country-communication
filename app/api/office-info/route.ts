import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import OfficeInfo from "@/models/OfficeInfo";

// GET - Fetch office info
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    let officeInfo = await OfficeInfo.findOne();

    // Auto-create if not exists
    if (!officeInfo) {
      officeInfo = await OfficeInfo.create({
        streetAddress: "",
        city: "",
        country: "",
        postalCode: "",
        googleMapUrl: "",
        officeHours: [],
      });
    }

    return NextResponse.json({ data: officeInfo });
  } catch (error: any) {
    console.error("Error fetching office info:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch office info" },
      { status: 500 },
    );
  }
}

// PUT - Create or Update office info
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      streetAddress,
      city,
      country,
      postalCode,
      googleMapUrl,
      officeHours,
    } = body;

    let officeInfo = await OfficeInfo.findOne();

    if (officeInfo) {
      // Update existing
      if (streetAddress !== undefined) officeInfo.streetAddress = streetAddress;
      if (city !== undefined) officeInfo.city = city;
      if (country !== undefined) officeInfo.country = country;
      if (postalCode !== undefined) officeInfo.postalCode = postalCode;
      if (googleMapUrl !== undefined) officeInfo.googleMapUrl = googleMapUrl;
      if (officeHours !== undefined) officeInfo.officeHours = officeHours;

      await officeInfo.save();
    } else {
      // Create new
      officeInfo = await OfficeInfo.create({
        streetAddress: streetAddress || "",
        city: city || "",
        country: country || "",
        postalCode: postalCode || "",
        googleMapUrl: googleMapUrl || "",
        officeHours: officeHours || [],
      });
    }

    return NextResponse.json({
      message: "Office info updated successfully",
      data: officeInfo,
    });
  } catch (error: any) {
    console.error("Error updating office info:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update office info" },
      { status: 500 },
    );
  }
}
