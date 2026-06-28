// /api/portfolio/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Portfolio from "@/models/portfolio";

// GET - Fetch all portfolios (with pagination & filters)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "published"; // Default: published
    const exhibition = searchParams.get("exhibition") || "";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const isAdmin = searchParams.get("admin") || ""; // Admin override

    // Build query
    const query: any = {};

    // ===== STATUS FILTER =====
    // Admin panel: can see all statuses
    // Public: only published
    if (isAdmin === "true") {
      // Admin can filter by status
      if (status && status !== "all") {
        query.status = status;
      }
    } else {
      // Public only sees published
      query.status = "published";
    }

    // Filter by exhibition name
    if (exhibition && exhibition !== "All") {
      query.exhibition_name = exhibition;
    }

    // Filter by category
    if (category && category !== "All") {
      query["projectInfo.category"] = category;
    }

    // Search by title, exhibition, client
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { exhibition_name: { $regex: search, $options: "i" } },
        { "projectInfo.clientName": { $regex: search, $options: "i" } },
        { "projectInfo.location": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [portfolios, total] = await Promise.all([
      Portfolio.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Portfolio.countDocuments(query),
    ]);

    return NextResponse.json({
      data: portfolios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch portfolios" },
      { status: 500 },
    );
  }
}

// POST - Create new portfolio
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.exhibition_name || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields: title, exhibition_name, slug" },
        { status: 400 },
      );
    }

    const existing = await Portfolio.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A portfolio with this slug already exists" },
        { status: 400 },
      );
    }

    const portfolio = await Portfolio.create({
      title: body.title,
      exhibition_name: body.exhibition_name,
      projectInfo: {
        clientName: body.projectInfo?.clientName || "",
        boothSize: body.projectInfo?.boothSize || "",
        location: body.projectInfo?.location || "",
        buildTime: body.projectInfo?.buildTime || "",
        overview: body.projectInfo?.overview || "",
      },
      objective: body.objective || "",
      challenges: body.challenges || "",
      process: {
        rendersImages: body.process?.rendersImages || [
          { url: "", publicId: "" },
        ],
        realImages: body.process?.realImages || [{ url: "", publicId: "" }],
        moodboardImages: body.process?.moodboardImages || [
          { url: "", publicId: "" },
        ],
        processText: body.process?.processText || "",
      },
      materials: body.materials || [],
      technologies: body.technologies || [],
      execution: body.execution || "",
      results: {
        visitors: body.results?.visitors || "",
        engagement: body.results?.engagement || "",
        testimonial: body.results?.testimonial || "",
        clientName: body.results?.clientName || "",
        clientImage: body.results?.clientImage || { url: "", publicId: "" },
      },
      keywords: body.keywords || [],
      status: body.status || "draft",
      slug: body.slug,
    });

    return NextResponse.json(
      { message: "Portfolio created successfully", data: portfolio },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create portfolio" },
      { status: 500 },
    );
  }
}
