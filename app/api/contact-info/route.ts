import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import ContactInfo from "@/models/ContactInfo";
import cloudinary from "@/lib/cloudinary";

// GET - Fetch contact info
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Always return the first document (singleton pattern)
    let contactInfo = await ContactInfo.findOne();

    // If no contact info exists, create default
    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        whatsapp: "",
        whatsappQrCode: { url: "", publicId: "" },
        wechat: "",
        wechatQrCode: { url: "", publicId: "" },
        primaryEmail: "",
        primaryPhone: "",
        secondaryPhone: "",
      });
    }

    return NextResponse.json({ data: contactInfo });
  } catch (error: any) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch contact info" },
      { status: 500 },
    );
  }
}

// PUT - Create or Update contact info (upsert)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      whatsapp,
      whatsappQrCode,
      wechat,
      wechatQrCode,
      primaryEmail,
      primaryPhone,
      secondaryPhone,
    } = body;

    // Find first document or create new
    let contactInfo = await ContactInfo.findOne();

    if (contactInfo) {
      // Update existing
      if (whatsapp !== undefined) contactInfo.whatsapp = whatsapp;
      if (wechat !== undefined) contactInfo.wechat = wechat;
      if (primaryEmail !== undefined) contactInfo.primaryEmail = primaryEmail;
      if (primaryPhone !== undefined) contactInfo.primaryPhone = primaryPhone;
      if (secondaryPhone !== undefined)
        contactInfo.secondaryPhone = secondaryPhone;

      // WhatsApp QR Code
      if (whatsappQrCode !== undefined) {
        if (
          contactInfo.whatsappQrCode?.publicId &&
          contactInfo.whatsappQrCode.publicId !== whatsappQrCode?.publicId
        ) {
          try {
            await cloudinary.uploader.destroy(contactInfo.whatsappQrCode.publicId);
          } catch (cErr) {
            console.error("Failed to delete old WhatsApp QR code:", cErr);
          }
        }
        contactInfo.whatsappQrCode = {
          url: whatsappQrCode?.url || "",
          publicId: whatsappQrCode?.publicId || "",
        };
      }

      // WeChat QR Code
      if (wechatQrCode !== undefined) {
        if (
          contactInfo.wechatQrCode?.publicId &&
          contactInfo.wechatQrCode.publicId !== wechatQrCode?.publicId
        ) {
          try {
            await cloudinary.uploader.destroy(contactInfo.wechatQrCode.publicId);
          } catch (cErr) {
            console.error("Failed to delete old WeChat QR code:", cErr);
          }
        }
        contactInfo.wechatQrCode = {
          url: wechatQrCode?.url || "",
          publicId: wechatQrCode?.publicId || "",
        };
      }

      await contactInfo.save();
    } else {
      // Create new
      contactInfo = await ContactInfo.create({
        whatsapp: whatsapp || "",
        whatsappQrCode: {
          url: whatsappQrCode?.url || "",
          publicId: whatsappQrCode?.publicId || "",
        },
        wechat: wechat || "",
        wechatQrCode: {
          url: wechatQrCode?.url || "",
          publicId: wechatQrCode?.publicId || "",
        },
        primaryEmail: primaryEmail || "",
        primaryPhone: primaryPhone || "",
        secondaryPhone: secondaryPhone || "",
      });
    }

    return NextResponse.json({
      message: "Contact info updated successfully",
      data: contactInfo,
    });
  } catch (error: any) {
    console.error("Error updating contact info:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update contact info" },
      { status: 500 },
    );
  }
}
