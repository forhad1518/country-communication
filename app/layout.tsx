import { Roboto } from "next/font/google";
import logo from "@/public/logo_COCO.png";

import "@/app/globals.css";
import TopBar from "@/components/TopBar";
import Footer from "@/components/sections/home/Footer";
import Navbar from "@/components/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/6a3dc81c54.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
