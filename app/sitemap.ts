import type { MetadataRoute } from "next";
import dbConnect from "@/config/connectDB";
import Portfolio from "@/models/portfolio";
import Blog from "@/models/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  // Core static pages with priority and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/get-free-quote`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exhibitions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy_policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms_of_service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie_policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let portfolioPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();

    // Fetch published portfolios
    const portfolios = await Portfolio.find(
      { status: "published" },
      "slug updatedAt createdAt",
    )
      .lean()
      .exec();

    portfolioPages = portfolios
      .filter((p: any) => p.slug)
      .map((p: any) => ({
        url: `${baseUrl}/portfolio/${p.slug}`,
        lastModified: p.updatedAt || p.createdAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    // Fetch published blogs
    const blogs = await Blog.find(
      { status: "published" },
      "slug updatedAt publishedAt createdAt",
    )
      .lean()
      .exec();

    blogPages = blogs
      .filter((b: any) => b.slug)
      .map((b: any) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updatedAt || b.publishedAt || b.createdAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (error) {
    console.error("Error generating dynamic sitemap from database:", error);
  }

  return [...staticPages, ...portfolioPages, ...blogPages];
}
