import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Exhibition Booth Portfolio & Trade Show Stands",
    description:
      "Explore 1000+ award-winning exhibition booth designs, custom trade show stands, pavilions, and brand activations by Country Communication at ICCB Dhaka and worldwide.",
    keywords: [
      "exhibition booth portfolio",
      "trade show booth design Bangladesh",
      "booth fabrication photos",
      "3D stall render ICCB",
      "exhibition stand contractor Dhaka",
      "Country Communication portfolio",
      "Bangladesh exhibition stall builder",
      "custom expo booth examples",
    ].join(", "),
    openGraph: {
      title: "Exhibition Booth Portfolio & Trade Show Stands | Country Communication",
      description:
        "Explore 1000+ award-winning exhibition booth designs, trade show stands, and brand activations built by Country Communication.",
      type: "website",
      url: `${baseUrl}/portfolio`,
      siteName: "Country Communication",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-portfolio.png`,
          width: 1200,
          height: 630,
          alt: "Country Communication Exhibition Booth Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Exhibition Booth Portfolio | Country Communication",
      description:
        "Explore 1000+ award-winning exhibition booth designs and trade show stands built by Country Communication.",
      images: [`${baseUrl}/og-portfolio.png`],
      creator: "@CountryCommBD",
      site: "@CountryCommBD",
    },
    alternates: {
      canonical: `${baseUrl}/portfolio`,
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

export default function PortfolioPage() {
  return <PortfolioClient />;
}
