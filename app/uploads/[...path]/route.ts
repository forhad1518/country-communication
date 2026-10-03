import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// MIME type map for allowed file extensions
const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;

    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, ...pathSegments);
    const resolvedPath = path.resolve(filePath);

    // Security check: prevent directory traversal
    if (!resolvedPath.startsWith(uploadDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(resolvedPath)) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const stat = fs.statSync(resolvedPath);
    if (!stat.isFile()) {
      return new NextResponse("Not a file", { status: 400 });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileName = path.basename(resolvedPath);

    // Read file as buffer
    const fileBuffer = fs.readFileSync(resolvedPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Error serving uploaded file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
