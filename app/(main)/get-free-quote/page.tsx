import type { Metadata } from "next";
import QuoteClient from "./QuoteClient";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: "Get Free Quote | Exhibition Stand & Booth Design - Country Communication",
    description:
      "Request a free customized 3D design and cost estimation for your upcoming exhibition stall, trade show booth, or event pavilion with Country Communication.",
    keywords: [
      "free booth quote",
      "exhibition stand cost",
      "stall design quotation",
      "trade show booth estimate",
      "Country Communication quote",
      "exhibition Bangladesh",
      "ICCB booth fabrication",
    ].join(", "),
    openGraph: {
      title: "Get Free Quote | Exhibition Stand & Booth Design - Country Communication",
      description:
        "Request a free customized 3D design and cost estimation for your upcoming exhibition stall, trade show booth, or event pavilion.",
      type: "website",
      url: `${baseUrl}/get-free-quote`,
      siteName: "Country Communication",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Get Free Quote | Exhibition Stand & Booth Design",
      description:
        "Request a free customized 3D design and cost estimation for your upcoming exhibition stall.",
    },
    alternates: {
      canonical: `${baseUrl}/get-free-quote`,
    },
  };
}

export default function GetFreeQuotePage() {
  return <QuoteClient />;
}
