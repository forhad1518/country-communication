import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

  return {
    title: "Cookie Policy",
    description:
      "Cookie Policy of Country Communication. Learn how we use cookies to improve your user experience and how you can manage them.",
    openGraph: {
      title: "Cookie Policy | Country Communication",
      description:
        "Learn how Country Communication uses cookies to improve your browsing experience.",
      type: "website",
      url: `${baseUrl}/cookie_policy`,
      siteName: "Country Communication",
      images: [`${baseUrl}/og-main.png`],
    },
    alternates: {
      canonical: `${baseUrl}/cookie_policy`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
