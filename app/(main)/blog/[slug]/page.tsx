import type { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";
import dbConnect from "@/config/connectDB";
import Blog from "@/models/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper: Get blog data with DB fallback
async function getBlog(slug: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data) return data.data;
    }
  } catch {
    // If internal fetch fails, query database directly
  }

  try {
    await dbConnect();
    const query = /^[0-9a-fA-F]{24}$/.test(slug)
      ? { _id: slug }
      : { slug: slug };
    const doc = await Blog.findOne(query).lean();
    return doc;
  } catch (dbError) {
    console.error("Error fetching blog from DB:", dbError);
    return null;
  }
}

// Extract description text from content blocks
function extractDescription(blog: any): string {
  if (blog.subtitle && typeof blog.subtitle === "string") {
    return blog.subtitle;
  }
  if (Array.isArray(blog.content)) {
    const firstPara = blog.content.find((b: any) => b.type === "paragraph");
    if (firstPara && typeof firstPara.content === "string") {
      return firstPara.content;
    }
  }
  return "Read our latest article on exhibition booth design and industry trends.";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  try {
    const blog = await getBlog(slug, baseUrl);

    if (!blog) {
      return {
        title: "Article Not Found",
        description:
          "The blog article you are looking for does not exist or has been removed.",
      };
    }

    const title = `${blog.title} - Exhibition Insights`;
    const rawDescription = extractDescription(blog);
    const description = rawDescription.substring(0, 160);

    // Hero image for social sharing
    const rawImage =
      blog.image?.url ||
      (typeof blog.image === "string" ? blog.image : "") ||
      `${baseUrl}/og-blog.png`;

    const ogImageUrl = rawImage.startsWith("http")
      ? rawImage
      : `${baseUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

    const keywords = [
      blog.title,
      blog.category,
      ...(blog.tags || []),
      "exhibition blog",
      "trade show tips Bangladesh",
      "booth design insights",
      "Country Communication blog",
    ].filter(Boolean);

    return {
      title,
      description,
      keywords: keywords.join(", "),
      openGraph: {
        title: `${blog.title} | Country Communication Blog`,
        description,
        type: "article",
        publishedTime: (blog.publishedAt || blog.createdAt)?.toString(),
        modifiedTime: (blog.updatedAt || blog.createdAt)?.toString(),
        url: `${baseUrl}/blog/${slug}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        siteName: "Country Communication",
        locale: "en_US",
        authors: blog.authorName ? [blog.authorName] : ["Country Communication"],
      },
      twitter: {
        card: "summary_large_image",
        title: `${blog.title} | Country Communication`,
        description,
        images: [ogImageUrl],
        creator: "@CountryCommBD",
        site: "@CountryCommBD",
      },
      alternates: {
        canonical: `${baseUrl}/blog/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating blog metadata:", error);
    return {
      title: `${slug.replace(/-/g, " ")} | Exhibition Article`,
      description: "Read our latest exhibition and trade show insights.",
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";
  const blog = await getBlog(slug, baseUrl);

  const rawImage =
    blog?.image?.url ||
    (typeof blog?.image === "string" ? blog.image : "") ||
    `${baseUrl}/og-blog.png`;

  const ogImageUrl = rawImage.startsWith("http")
    ? rawImage
    : `${baseUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  // JSON-LD Article Schema
  const articleSchema = blog
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: extractDescription(blog).substring(0, 160),
        image: ogImageUrl,
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt || blog.createdAt,
        author: {
          "@type": "Person",
          name: blog.authorName || "Country Communication Editorial Team",
          jobTitle: blog.authorRole || "Exhibition Specialist",
        },
        publisher: {
          "@type": "Organization",
          name: "Country Communication",
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo_COCO.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/blog/${slug}`,
        },
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      <BlogDetailClient slug={slug} />
    </>
  );
}
