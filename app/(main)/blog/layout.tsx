import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Exhibition Design Blog, Industry Insights & News",
    description:
      "Explore the latest exhibition booth design trends, trade show stand fabrication tips, event marketing strategies, and ICCB Dhaka exhibition guides from Country Communication.",
    keywords: [
      "exhibition blog",
      "trade show tips Bangladesh",
      "stall design ideas",
      "booth fabrication guide",
      "ICCB Dhaka events",
      "event marketing insights",
      "Country Communication news",
    ].join(", "),
    openGraph: {
      title:
        "Exhibition Design Blog, Industry Insights & News | Country Communication",
      description:
        "Explore expert booth design tips, exhibition fabrication guides, and event marketing trends.",
      type: "website",
      url: `${baseUrl}/blog`,
      siteName: "Country Communication",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-blog.png`,
          width: 1200,
          height: 630,
          alt: "Country Communication Blog & Industry Insights",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Exhibition Design Blog & News | Country Communication",
      description:
        "Explore expert booth design tips, exhibition fabrication guides, and event marketing trends.",
      images: [`${baseUrl}/og-blog.png`],
      creator: "@CountryCommBD",
      site: "@CountryCommBD",
    },
    alternates: {
      canonical: `${baseUrl}/blog`,
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
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
