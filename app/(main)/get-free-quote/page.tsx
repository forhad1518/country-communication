import type { Metadata } from "next";
import QuoteClient from "./QuoteClient";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Get Free Quote | 3D Booth Design & Cost Estimation",
    description:
      "Request a free customized 3D design and transparent cost quotation for your upcoming exhibition stall, trade show booth, or event pavilion in Bangladesh with Country Communication.",
    keywords: [
      "free booth quote Bangladesh",
      "exhibition stand cost Dhaka",
      "stall design quotation ICCB",
      "trade show booth estimate",
      "Country Communication quote",
      "booth fabrication price Dhaka",
      "custom stall 3D design request",
    ].join(", "),
    openGraph: {
      title: "Get Free Quote | 3D Booth Design & Cost Estimation",
      description:
        "Request a free customized 3D design and cost quotation for your upcoming exhibition stall, trade show booth, or event pavilion.",
      type: "website",
      url: `${baseUrl}/get-free-quote`,
      siteName: "Country Communication",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-main.png`,
          width: 1200,
          height: 630,
          alt: "Get Free Booth Design Quote - Country Communication",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Get Free Quote | Exhibition Stand & Booth Design",
      description:
        "Request a free customized 3D design and cost quotation for your upcoming exhibition stall in Bangladesh.",
      images: [`${baseUrl}/og-main.png`],
      creator: "@CountryCommBD",
      site: "@CountryCommBD",
    },
    alternates: {
      canonical: `${baseUrl}/get-free-quote`,
    },
  };
}

export default function GetFreeQuotePage() {
  return <QuoteClient />;
}
