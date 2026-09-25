import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Privacy Policy",
    description:
      "Privacy Policy of Country Communication. Learn how we collect, use, and protect your personal information when using our exhibition and event services.",
    openGraph: {
      title: "Privacy Policy | Country Communication",
      description:
        "Learn how Country Communication collects and protects your personal information.",
      type: "website",
      url: `${baseUrl}/privacy_policy`,
      siteName: "Country Communication",
      images: [`${baseUrl}/og-main.png`],
    },
    alternates: {
      canonical: `${baseUrl}/privacy_policy`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
