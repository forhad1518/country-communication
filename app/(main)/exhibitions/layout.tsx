import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Exhibitions & Trade Fairs Across Bangladesh & Worldwide",
    description:
      "Explore upcoming and past trade fairs, expos, and industrial exhibitions across ICCB Dhaka and international venues where Country Communication designs and fabricates premium booths.",
    keywords: [
      "exhibitions Bangladesh",
      "ICCB Dhaka expos",
      "trade shows Bangladesh",
      "upcoming exhibitions Dhaka",
      "exhibition stall design Dhaka",
      "Country Communication exhibitions",
    ].join(", "),
    openGraph: {
      title: "Exhibitions & Trade Fairs | Country Communication",
      description:
        "Discover upcoming and past trade shows, expos, and exhibitions in Bangladesh and globally.",
      type: "website",
      url: `${baseUrl}/exhibitions`,
      siteName: "Country Communication",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-main.png`,
          width: 1200,
          height: 630,
          alt: "Exhibitions by Country Communication",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Exhibitions & Trade Fairs | Country Communication",
      description:
        "Discover upcoming and past trade shows, expos, and exhibitions in Bangladesh and globally.",
      images: [`${baseUrl}/og-main.png`],
      creator: "@CountryCommBD",
      site: "@CountryCommBD",
    },
    alternates: {
      canonical: `${baseUrl}/exhibitions`,
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

export default function ExhibitionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
