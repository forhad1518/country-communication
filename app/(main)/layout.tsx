import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "@/app/globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto"
})

export const metadata: Metadata = {
  title: "Country Communication",
  description: "Bangladeshi Best Event Management Company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased px-3`}
      >
        {/* Top Bar */}
        <TopBar />
        {/* Nav Bar */}
        <Navbar/>
        {children}
        {/* Footer */}
        <Footer/>
      </body>
    </html>
  );
}
