import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";

import "./globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// const robot = Roboto({
//   variable: "--robot"
// })

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased px-3`}
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
