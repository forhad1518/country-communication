// app/(main)/portfolio/[slug]/layout.tsx
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params before accessing properties
  const { slug } = await params;

  // Fetch portfolio data for SEO (use absolute URL in production)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`/api/portfolio/${slug}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });
    const data = await res.json();
    const portfolio = data.data;

    if (!portfolio) {
      return {
        title: "Portfolio Not Found",
        description:
          "The portfolio project you are looking for does not exist.",
      };
    }

    const title = `${portfolio.title} | Portfolio | Country Communication`;
    const description =
      portfolio.projectInfo?.overview ||
      portfolio.objective ||
      `Explore ${portfolio.title} - an exhibition booth project by Country Communication for ${portfolio.exhibition_name}. View design renders, real images, and project details.`;

    const heroImage =
      portfolio.process?.rendersImages?.[0]?.url ||
      portfolio.process?.realImages?.[0]?.url ||
      "";

    const keywords = [
      portfolio.title,
      portfolio.exhibition_name,
      "exhibition booth",
      "trade show booth",
      "booth design",
      "Country Communication",
      "Bangladesh exhibition",
      ...(portfolio.keywords || []),
      ...(portfolio.materials || []),
      ...(portfolio.technologies || []),
    ].filter(Boolean);

    return {
      title,
      description: description.substring(0, 160),
      keywords: keywords.join(", "),
      openGraph: {
        title,
        description: description.substring(0, 160),
        type: "article",
        publishedTime: portfolio.createdAt,
        modifiedTime: portfolio.createdAt,
        url: `${baseUrl}/portfolio/${slug}`,
        images: heroImage
          ? [
              {
                url: heroImage,
                width: 1200,
                height: 630,
                alt: portfolio.title,
              },
            ]
          : [],
        siteName: "Country Communication",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description.substring(0, 160),
        images: heroImage ? [heroImage] : [],
        creator: "@CountryCommBD",
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
        "article:published_time": portfolio.createdAt,
        "article:section": "Portfolio",
        "article:tag": portfolio.exhibition_name,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${slug.replace(/-/g, " ")} | Portfolio | Country Communication`,
      description: "View our exhibition booth portfolio project.",
    };
  }
}

export default function PortfolioDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
