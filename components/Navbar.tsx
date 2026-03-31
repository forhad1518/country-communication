"use client";

import { useState } from "react";
import logo from "../public/logo_COCO.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { Slide } from "react-awesome-reveal";


export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathName = usePathname();
    const isActive = (link: string) => {
        return pathName.startsWith(link) && (link === "/" ? pathName === "/" : true);
    }
    return (
        <Slide direction="down" >
            <nav className="bg-gray-200 shadow-md text-sm">
                <div className="w-10/12 mx-auto flex items-center justify-between py-3">
                    <Link href="/">
                        <div className="w-32.5">
                            <img className="w-full" src={logo.src} alt="Country Communication Logo" />
                        </div>
                    </Link>

                    {/* Desktop / tablet menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <ul className="flex gap-x-4 uppercase text-black/80 font-semibold">
                            <Link className={`hover:text-primary-hover transition cursor-pointer ${isActive("/") ? "text-primary" : ""}`} href={""}>About Us</Link>
                            <Link className={`hover:text-primary-hover transition cursor-pointer ${isActive("/services") ? "text-primary" : ""}`} href={""}>Services</Link>
                            <Link className={`hover:text-primary-hover transition cursor-pointer ${isActive("/portfolio") ? "text-primary" : ""}`} href={"/portfolio"}>Portfolio</Link>
                            <Link className={`hover:text-primary-hover transition cursor-pointer ${isActive("/blog") ? "text-primary" : ""}`} href={"/blog"}>Blog/News</Link>
                        </ul>
                        <div>
                            <button className="bg-black rounded-full text-white px-4 py-1">Let&apos;s Talk</button>
                        </div>
                    </div>

                    {/* Mobile actions: hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setOpen((s) => !s)}
                            aria-expanded={open}
                            aria-label={open ? "Close menu" : "Open menu"}
                            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {open ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 6L18 18" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H21" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 12H21" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 18H21" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                {/* Mobile menu panel */}
                <div className={`md:hidden transition-max-h duration-300 ease-in-out overflow-hidden ${open ? "max-h-screen" : "max-h-0"}`}>
                    <div className={`w-10/12 mx-auto bg-white py-4 ${open ? "opacity-100" : "opacity-0"}`}>
                        <ul className="flex flex-col gap-3 uppercase text-black/80 font-semibold">
                            <Link className={`py-2 px-4 border-b border-gray-100 hover:text-primary-hover transition cursor-pointer ${isActive("/") ? "text-primary" : ""}`} href={""}>About Us</Link>
                            <Link className={`py-2 px-4 border-b border-gray-100 hover:text-primary-hover transition cursor-pointer ${isActive("/services") ? "text-primary" : ""}`} href={""}>Services</Link>
                            <Link className={`py-2 px-4 border-b border-gray-100 hover:text-primary-hover transition cursor-pointer ${isActive("/portfolio") ? "text-primary" : ""}`} href={"/portfolio"}>Portfolio</Link>
                            <Link className={`py-2 px-4 hover:text-primary-hover transition cursor-pointer ${isActive("/blog") ? "text-primary" : ""}`} href={"/blog"}>Blog/News</Link>
                        </ul>
                        <div className="mt-4 px-4">
                            <button className="w-full bg-black rounded-full text-white px-4 py-2">Let&apos;s Talk</button>
                        </div>
                    </div>
                </div>
            </nav>
        </Slide>
    );
}