import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: "Contact Us | Country Communication",
    description:
      "Get in touch with Country Communication for exhibition booth design, fabrication, and event management services. Call, WhatsApp, or visit our office in Dhaka.",
    keywords: [
      "contact",
      "exhibition booth",
      "trade show",
      "Country Communication",
      "Dhaka exhibition",
      "booth design contact",
      "exhibition company Bangladesh",
    ].join(", "),
    openGraph: {
      title: "Contact Us | Country Communication",
      description:
        "Get in touch with Country Communication for exhibition booth design, fabrication, and event management services.",
      type: "website",
      url: `${baseUrl}/contact`,
      siteName: "Country Communication",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us | Country Communication",
      description:
        "Get in touch with Country Communication for exhibition booth design, fabrication, and event management services.",
      creator: "@CountryCommBD",
    },
    alternates: {
      canonical: `${baseUrl}/contact`,
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

export default function ContactPage() {
  return <ContactClient />;
}
