import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: "Our Portfolio | Exhibition Booth Designs | Country Communication",
    description:
      "Explore our portfolio of award-winning exhibition booth designs, trade show stands, and brand activations. View design renders, real images, and project details from leading exhibitions in Bangladesh.",
    keywords: [
      "portfolio",
      "exhibition booth design",
      "trade show booth",
      "booth fabrication",
      "3D booth render",
      "exhibition stand",
      "Country Communication",
      "Bangladesh exhibition",
      "ICCB Dhaka",
      "booth contractor",
    ].join(", "),
    openGraph: {
      title: "Our Portfolio | Exhibition Booth Designs | Country Communication",
      description:
        "Explore our portfolio of award-winning exhibition booth designs, trade show stands, and brand activations.",
      type: "website",
      url: `${baseUrl}/portfolio`,
      siteName: "Country Communication",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Our Portfolio | Exhibition Booth Designs | Country Communication",
      description:
        "Explore our portfolio of award-winning exhibition booth designs, trade show stands, and brand activations.",
      creator: "@CountryCommBD",
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
