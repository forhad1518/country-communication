// app/api/portfolio/testimonials/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Portfolio from "@/models/portfolio";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Query published portfolios where results.testimonial exists and is not empty
    const portfolios = await Portfolio.find(
      {
        status: "published",
        "results.testimonial": { $exists: true, $ne: "" },
      },
      {
        title: 1,
        exhibition_name: 1,
        "projectInfo.clientName": 1,
        "projectInfo.location": 1,
        "results.testimonial": 1,
        "results.clientName": 1,
        "results.clientImage": 1,
        slug: 1,
        createdAt: 1,
      }
    ).lean();

    // Filter out blank or whitespace-only testimonials and format the output
    const testimonials = portfolios
      .filter((p: any) => {
        const text = p.results?.testimonial;
        return typeof text === "string" && text.trim().length > 0;
      })
      .map((p: any) => ({
        id: p._id.toString(),
        testimonial: p.results.testimonial.trim(),
        clientName:
          p.results.clientName?.trim() ||
          p.projectInfo?.clientName?.trim() ||
          "Valued Client",
        clientImage: p.results.clientImage?.url || null,
        projectTitle: p.title || "",
        exhibitionName: p.exhibition_name || "",
        location: p.projectInfo?.location || "",
        slug: p.slug,
      }));

    // Randomize the order (Fisher-Yates shuffle)
    for (let i = testimonials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [testimonials[i], testimonials[j]] = [testimonials[j], testimonials[i]];
    }

    return NextResponse.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error: any) {
    console.error("Error fetching testimonials from portfolio:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
