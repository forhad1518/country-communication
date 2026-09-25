import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Contact Us | Exhibition Stall Design & Inquiries",
    description:
      "Get in touch with Country Communication for custom exhibition booth design, stall fabrication, and event management in Bangladesh. Call, WhatsApp, or visit our office in Niketan, Gulshan, Dhaka.",
    keywords: [
      "contact Country Communication",
      "exhibition booth quote Dhaka",
      "trade show fabrication contact",
      "Dhaka exhibition stall builder address",
      "booth design company contact Bangladesh",
      "ICCB stall contractor phone number",
    ].join(", "),
    openGraph: {
      title: "Contact Us | Country Communication Exhibition Services",
      description:
        "Get in touch with Country Communication for exhibition booth design, fabrication, and event management services in Bangladesh.",
      type: "website",
      url: `${baseUrl}/contact`,
      siteName: "Country Communication",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-main.png`,
          width: 1200,
          height: 630,
          alt: "Contact Country Communication - Exhibition Booth Design",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us | Country Communication",
      description:
        "Get in touch with Country Communication for exhibition booth design and fabrication services.",
      images: [`${baseUrl}/og-main.png`],
      creator: "@CountryCommBD",
      site: "@CountryCommBD",
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
