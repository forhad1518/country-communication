import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Country Communication | Exhibition Booth Design & Fabrication",
    template: "%s | Country Communication",
  },
  description:
    "Bangladesh's leading exhibition booth design, fabrication, and event management company. We create award-winning trade show stands, pavilions, and brand activations for exhibitions at ICCB Dhaka and worldwide.",
  keywords: [
    "exhibition booth design",
    "trade show booth",
    "booth fabrication",
    "exhibition stand contractor",
    "event management Bangladesh",
    "ICCB Dhaka exhibition",
    "pavilion design",
    "brand activation",
    "3D booth design",
    "Country Communication",
    "Bangladesh exhibition company",
    "stall design",
    "expo booth builder",
  ],
  authors: [{ name: "Country Communication" }],
  creator: "Country Communication",
  publisher: "Country Communication",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    siteName: "Country Communication",
    title: "Country Communication | Exhibition Booth Design & Fabrication",
    description:
      "Bangladesh's leading exhibition booth design, fabrication, and event management company. Award-winning trade show stands and brand activations.",
    images: [
      {
        url: "/logo_COCO.png", // Your logo as OG image
        width: 1200,
        height: 630,
        alt: "Country Communication - Exhibition Booth Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Country Communication | Exhibition Booth Design & Fabrication",
    description:
      "Bangladesh's leading exhibition booth design, fabrication, and event management company.",
    images: ["/logo_COCO.png"],
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
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    // yandex: "your-yandex-code",
    // yahoo: "your-yahoo-code",
  },
  other: {
    "google-site-verification":
      process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    "msapplication-TileColor": "#da532c",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

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
