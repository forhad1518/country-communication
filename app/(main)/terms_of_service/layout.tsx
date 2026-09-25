import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Terms of Service",
    description:
      "Terms of Service of Country Communication. Review our service agreements, project policies, and conditions for exhibition booth fabrication and design.",
    openGraph: {
      title: "Terms of Service | Country Communication",
      description:
        "Review our service agreements and project terms for exhibition booth fabrication.",
      type: "website",
      url: `${baseUrl}/terms_of_service`,
      siteName: "Country Communication",
      images: [`${baseUrl}/og-main.png`],
    },
    alternates: {
      canonical: `${baseUrl}/terms_of_service`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
