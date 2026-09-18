import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Quote from "@/models/Quote";
import { sendQuoteEmails } from "@/helpers/mailer";

// POST: Create a new quote request and trigger dual email notification
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      companyName,
      email,
      phone,
      country,
      city,
      exhibitionName,
      stallNumber,
      boothSize,
      boothType,
      budget,
      services,
      eventDate,
      message,
      attachment,
    } = body;

    // Basic Validation
    if (!name || !companyName || !email || !phone || !exhibitionName || !boothSize) {
      return NextResponse.json(
        {
          error:
            "Please fill all required fields (Name, Company, Email, Phone, Exhibition Name, and Booth Size).",
        },
        { status: 400 }
      );
    }

    // 1. Save quote inquiry to MongoDB database
    const newQuote = await Quote.create({
      name: name.trim(),
      companyName: companyName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      country: country?.trim() || "",
      city: city?.trim() || "",
      exhibitionName: exhibitionName.trim(),
      stallNumber: stallNumber?.trim() || "",
      boothSize: boothSize.trim(),
      boothType: boothType?.trim() || "Standard / Custom",
      budget: budget?.trim() || "",
      services: Array.isArray(services) ? services : [],
      eventDate: eventDate?.trim() || "",
      message: message?.trim() || "",
      attachment: attachment || { url: "", publicId: "" },
      status: "pending",
    });

    // 2. Dispatch dual emails (to Admin & to Client)
    let emailResult = null;
    try {
      emailResult = await sendQuoteEmails({
        name,
        companyName,
        email,
        phone,
        country,
        city,
        exhibitionName,
        stallNumber,
        boothSize,
        boothType,
        budget,
        services,
        eventDate,
        message,
        attachment,
      });
    } catch (mailErr: any) {
      console.error("Warning: email sending failed, but quote is saved in database:", mailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your quote request has been submitted successfully. A confirmation has been sent to your email.",
        data: newQuote,
        emailResult,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit quote request" },
      { status: 500 }
    );
  }
}

// GET: Retrieve quotes for admin review
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Number(searchParams.get("limit")) || 50;

    const query = status ? { status } : {};
    const quotes = await Quote.find(query).sort({ createdAt: -1 }).limit(limit);

    return NextResponse.json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch quote inquiries" },
      { status: 500 }
    );
  }
}
