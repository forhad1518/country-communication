import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://countrycommu.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Country Communication | Exhibition Booth Design & Fabrication Bangladesh",
    template: "%s | Country Communication",
  },
  description:
    "Bangladesh's leading exhibition booth design, trade show stall fabrication, and event management company. We design and build award-winning trade show stands, pavilions, and brand activations for exhibitions at ICCB Dhaka and worldwide.",
  keywords: [
    "exhibition booth design Bangladesh",
    "trade show booth fabrication Dhaka",
    "ICCB Dhaka exhibition stall builder",
    "exhibition stand contractor Bangladesh",
    "event management company Dhaka",
    "pavilion design and construction",
    "brand activation Bangladesh",
    "3D stall design Dhaka",
    "Country Communication",
    "expo booth builder ICCB",
    "custom exhibition stand fabrication",
    "corporate event management Dhaka",
  ],
  authors: [{ name: "Country Communication", url: baseUrl }],
  creator: "Country Communication",
  publisher: "Country Communication",
  category: "Exhibition & Event Services",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Country Communication",
    title:
      "Country Communication | Exhibition Booth Design & Fabrication Bangladesh",
    description:
      "Bangladesh's premier exhibition booth design, trade show stall fabrication, and event management contractor. Award-winning stands and pavilions at ICCB Dhaka & worldwide.",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "Country Communication - Exhibition Booth Design & Fabrication Bangladesh",
      },
      {
        url: "/logo_COCO.png",
        width: 1031,
        height: 242,
        alt: "Country Communication Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Country Communication | Exhibition Booth Design & Fabrication Bangladesh",
    description:
      "Bangladesh's premier exhibition booth design, trade show stall fabrication, and event management contractor.",
    images: ["/og-main.png"],
    creator: "@CountryCommBD",
    site: "@CountryCommBD",
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
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  other: {
    "google-site-verification":
      process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    "msapplication-TileColor": "#00a79d",
    "theme-color": "#00a79d",
  },
};

// Structured data for Search Engines (Schema.org)
const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${baseUrl}/#organization`,
      name: "Country Communication",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo_COCO.png`,
        width: 1031,
        height: 242,
      },
      image: `${baseUrl}/og-main.png`,
      description:
        "Bangladesh's premier exhibition booth design, trade show stall fabrication, and event management company at ICCB Dhaka and worldwide.",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "House-30, (lift-03), Road-07 Block-C, Niketan, Gulshan-1",
        addressLocality: "Dhaka",
        postalCode: "1212",
        addressCountry: "BD",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 23.7744,
        longitude: 90.4184,
      },
      telephone: "+8801816756997",
      email: "countrycommu@gmail.com",
      priceRange: "$$",
      areaServed: [
        {
          "@type": "Country",
          name: "Bangladesh",
        },
        {
          "@type": "AdministrativeArea",
          name: "Worldwide",
        },
      ],
      sameAs: [
        "https://www.facebook.com/CountryCommunication",
        "https://www.linkedin.com/company/country-communication",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Country Communication",
      description: "Exhibition Booth Design & Fabrication in Bangladesh",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Font Awesome */}
        <script
          src="https://kit.fontawesome.com/6a3dc81c54.js"
          crossOrigin="anonymous"
        ></script>

        {/* Favicon & Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00a79d" />
        <meta name="msapplication-TileColor" content="#00a79d" />
        <meta name="theme-color" content="#00a79d" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
