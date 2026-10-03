import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

// Maximum file size: 25MB
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file was uploaded." },
        { status: 400 }
      );
    }

    // 1. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File size exceeds the 25MB limit. Please upload a smaller file.",
        },
        { status: 400 }
      );
    }

    // 2. Validate file type
    const fileExtension = path.extname(file.name).toLowerCase();
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(fileExtension);
    const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!isAllowedExt && !isAllowedMime) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file format. Please upload a PDF document (.pdf) or layout image (.jpg, .png).",
        },
        { status: 400 }
      );
    }

    // 3. Prepare upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "floor-plans");
    await mkdir(uploadDir, { recursive: true });

    // 4. Generate safe unique file name
    const sanitizedBase = path
      .basename(file.name, fileExtension)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);

    const safeExt = isAllowedExt ? fileExtension : ".pdf";
    const uniqueFileName = `floorplan_${Date.now()}_${sanitizedBase}${safeExt}`;
    const destinationPath = path.join(uploadDir, uniqueFileName);

    // 5. Write file to local disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/floor-plans/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      message: "Floor plan uploaded successfully.",
      url: publicUrl,
      fileName: uniqueFileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type || (safeExt === ".pdf" ? "application/pdf" : "application/octet-stream"),
    });
  } catch (error: any) {
    console.error("Floor plan upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload floor plan." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid file URL." },
        { status: 400 }
      );
    }

    // Security check: Only allow deleting files inside /uploads/floor-plans/
    const prefix = "/uploads/floor-plans/";
    if (!url.startsWith(prefix)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized file path." },
        { status: 400 }
      );
    }

    const fileName = path.basename(url);
    const uploadDir = path.join(process.cwd(), "public", "uploads", "floor-plans");
    const targetPath = path.resolve(uploadDir, fileName);

    // Ensure path resolves inside the floor-plans directory
    if (!targetPath.startsWith(uploadDir)) {
      return NextResponse.json(
        { success: false, message: "Invalid file operation." },
        { status: 400 }
      );
    }

    if (fs.existsSync(targetPath)) {
      await unlink(targetPath);
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error: any) {
    console.error("Floor plan delete error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete floor plan." },
      { status: 500 }
    );
  }
}
