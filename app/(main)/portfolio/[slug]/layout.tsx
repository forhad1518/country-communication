// app/(main)/portfolio/[slug]/layout.tsx
import type { Metadata } from "next";
import dbConnect from "@/config/connectDB";
import Portfolio from "@/models/portfolio";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

// Helper: Get portfolio data with DB fallback
async function getPortfolio(slug: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/api/portfolio/${slug}`, {
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
    const doc = await Portfolio.findOne(query).lean();
    return doc;
  } catch (dbError) {
    console.error("Error fetching portfolio from DB:", dbError);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  try {
    const portfolio = await getPortfolio(slug, baseUrl);

    if (!portfolio) {
      return {
        title: "Portfolio Project Not Found",
        description:
          "The exhibition booth project you are looking for does not exist or has been moved.",
      };
    }

    const title = `${portfolio.title} - ${portfolio.exhibition_name} Booth`;
    const description =
      portfolio.projectInfo?.overview ||
      portfolio.objective ||
      `Explore ${portfolio.title} exhibition booth designed and fabricated by Country Communication for ${portfolio.exhibition_name}. View 3D renders, real build photos, and project specs.`;

    // Prioritize thumbnail image as requested: thumbnailImage -> renders -> real images -> moodboard -> fallback
    const rawThumbnail =
      portfolio.thumbnailImage?.url ||
      portfolio.process?.rendersImages?.[0]?.url ||
      portfolio.process?.realImages?.[0]?.url ||
      portfolio.process?.moodboardImages?.[0]?.url ||
      `${baseUrl}/og-portfolio.png`;

    const thumbnailUrl = rawThumbnail.startsWith("http")
      ? rawThumbnail
      : `${baseUrl}${rawThumbnail.startsWith("/") ? "" : "/"}${rawThumbnail}`;

    const keywords = [
      portfolio.title,
      portfolio.exhibition_name,
      portfolio.projectInfo?.clientName,
      "exhibition booth design",
      "trade show booth",
      "booth fabrication Dhaka",
      "Country Communication",
      "Bangladesh exhibition stall builder",
      ...(portfolio.keywords || []),
      ...(portfolio.materials || []),
      ...(portfolio.technologies || []),
    ].filter(Boolean);

    return {
      title,
      description: description.substring(0, 160),
      keywords: keywords.join(", "),
      openGraph: {
        title: `${portfolio.title} | Country Communication Portfolio`,
        description: description.substring(0, 160),
        type: "article",
        publishedTime: portfolio.createdAt?.toString(),
        modifiedTime: portfolio.updatedAt?.toString() || portfolio.createdAt?.toString(),
        url: `${baseUrl}/portfolio/${slug}`,
        images: [
          {
            url: thumbnailUrl,
            width: 1200,
            height: 630,
            alt: `${portfolio.title} - Exhibition Booth Design by Country Communication`,
          },
        ],
        siteName: "Country Communication",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: `${portfolio.title} | Exhibition Stand Portfolio`,
        description: description.substring(0, 160),
        images: [thumbnailUrl],
        creator: "@CountryCommBD",
        site: "@CountryCommBD",
      },
      alternates: {
        canonical: `${baseUrl}/portfolio/${slug}`,
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
      other: {
        "article:published_time": portfolio.createdAt?.toString() || "",
        "article:section": "Portfolio",
        "article:tag": portfolio.exhibition_name || "",
      },
    };
  } catch (error) {
    console.error("Error generating portfolio metadata:", error);
    return {
      title: `${slug.replace(/-/g, " ")} | Exhibition Project`,
      description: "View our exhibition booth portfolio project.",
    };
  }
}

export default async function PortfolioDetailLayout({
  children,
  params,
}: Props) {
  const { slug } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";
  const portfolio = await getPortfolio(slug, baseUrl);

  const rawThumbnail =
    portfolio?.thumbnailImage?.url ||
    portfolio?.process?.rendersImages?.[0]?.url ||
    portfolio?.process?.realImages?.[0]?.url ||
    `${baseUrl}/og-portfolio.png`;

  const thumbnailUrl = rawThumbnail.startsWith("http")
    ? rawThumbnail
    : `${baseUrl}${rawThumbnail.startsWith("/") ? "" : "/"}${rawThumbnail}`;

  // Structured Data (CreativeWork / VisualArtwork)
  const projectSchema = portfolio
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: portfolio.title,
        headline: `${portfolio.title} - ${portfolio.exhibition_name} Exhibition Stand`,
        description:
          portfolio.projectInfo?.overview ||
          portfolio.objective ||
          `Exhibition booth project designed and fabricated for ${portfolio.exhibition_name}.`,
        image: thumbnailUrl,
        url: `${baseUrl}/portfolio/${slug}`,
        creator: {
          "@type": "Organization",
          name: "Country Communication",
          url: baseUrl,
        },
        provider: {
          "@type": "Organization",
          name: "Country Communication",
        },
        keywords: portfolio.keywords?.join(", ") || "exhibition booth",
      }
    : null;

  return (
    <>
      {projectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectSchema),
          }}
        />
      )}
      {children}
    </>
  );
}
