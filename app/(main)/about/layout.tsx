import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "About Us | Leading Exhibition Stand Fabricator in Bangladesh",
    description:
      "Learn about Country Communication - Bangladesh's top exhibition booth designer, trade show stand builder, and event management contractor with 1000+ delivered booths across ICCB and worldwide.",
    keywords: [
      "about Country Communication",
      "exhibition company Bangladesh",
      "booth builder Dhaka",
      "trade show contractor ICCB",
      "exhibition stand fabrication team",
      "stall design company Bangladesh",
    ].join(", "),
    openGraph: {
      title: "About Us | Country Communication Exhibition Booth Fabricator",
      description:
        "Bangladesh's leading exhibition booth design, trade show stand fabrication, and event management company. Over 1000+ booths delivered.",
      type: "website",
      url: `${baseUrl}/about`,
      siteName: "Country Communication",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-main.png`,
          width: 1200,
          height: 630,
          alt: "About Country Communication - Exhibition Booth Design",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About Us | Country Communication",
      description:
        "Bangladesh's premier exhibition booth design and fabrication contractor.",
      images: [`${baseUrl}/og-main.png`],
      creator: "@CountryCommBD",
      site: "@CountryCommBD",
    },
    alternates: {
      canonical: `${baseUrl}/about`,
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
