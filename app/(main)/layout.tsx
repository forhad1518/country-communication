import FloatingContact from "@/components/FloatingChat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/home/Footer";
import { div } from "framer-motion/client";

export default function fublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <FloatingContact />
            <Footer />
        </>
    );
}