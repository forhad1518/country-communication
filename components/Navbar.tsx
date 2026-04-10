"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "../public/logo_COCO.png";

// Navigation links type
interface NavLink {
    href: string;
    label: string;
    hasDropdown?: boolean;
    dropdownItems?: Array<{ href: string; label: string }>;
}

const navLinks: NavLink[] = [
    { href: "/", label: "About Us" },
    {
        href: "/services",
        label: "Services",
        hasDropdown: true,
        dropdownItems: [
            { href: "/services/exhibition", label: "Exhibition Stands" },
            { href: "/services/event-management", label: "Event Management" },
            { href: "/services/interior", label: "Interior Design" },
        ]
    },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog/News" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const pathName = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setOpen(false);
        setDropdownOpen(null);
    }, [pathName]);

    // Check if link is active
    const isActive = (href: string) => {
        if (href === "/") {
            return pathName === "/";
        }
        return pathName.startsWith(href);
    };

    // Toggle dropdown on mobile
    const toggleDropdown = (label: string) => {
        setDropdownOpen(dropdownOpen === label ? null : label);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-lg"
                    : "bg-gray-100"
                }`}
        >
            <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
                <div className="flex items-center justify-between py-3 lg:py-4">
                    {/* Logo */}
                    <Link href="/" className="relative z-10">
                        <div className="w-28 sm:w-32 lg:w-36 transition-transform hover:scale-105">
                            <Image
                                src={logo}
                                alt="Country Communication Logo"
                                width={144}
                                height={48}
                                priority
                                className="w-full h-auto"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <ul className="flex gap-x-8">
                            {navLinks.map((link) => (
                                <li key={link.href} className="relative group">
                                    <Link
                                        href={link.href}
                                        className={`relative text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${isActive(link.href)
                                                ? "text-primary"
                                                : "text-gray-700 hover:text-primary"
                                            }`}
                                    >
                                        {link.label}

                                        {/* Active Indicator */}
                                        {isActive(link.href) && (
                                            <motion.span
                                                layoutId="activeNav"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>

                                    {/* Dropdown for Services */}
                                    {link.hasDropdown && link.dropdownItems && (
                                        <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px]">
                                                {link.dropdownItems.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/contact"
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
                            >
                                Let's Talk
                            </Link>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setOpen(!open)}
                            aria-expanded={open}
                            aria-label={open ? "Close menu" : "Open menu"}
                            className="p-2 rounded-lg hover:bg-gray-200/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {open ? (
                                <X className="w-6 h-6 text-gray-800" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-800" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="lg:hidden overflow-hidden border-t border-gray-200"
                        >
                            <div className="py-4 space-y-2">
                                {navLinks.map((link) => (
                                    <div key={link.href} className="px-2">
                                        {link.hasDropdown ? (
                                            // Mobile Dropdown
                                            <div>
                                                <button
                                                    onClick={() => toggleDropdown(link.label)}
                                                    className="w-full flex items-center justify-between py-3 px-4 text-left text-gray-800 font-semibold uppercase text-sm hover:bg-primary/5 rounded-lg transition-colors"
                                                >
                                                    <span className={isActive(link.href) ? "text-primary" : ""}>
                                                        {link.label}
                                                    </span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen === link.label ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {dropdownOpen === link.label && link.dropdownItems && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="ml-4 space-y-1 overflow-hidden"
                                                        >
                                                            {link.dropdownItems.map((item) => (
                                                                <Link
                                                                    key={item.href}
                                                                    href={item.href}
                                                                    className="block py-2 px-4 text-sm text-gray-600 hover:text-primary transition-colors"
                                                                >
                                                                    {item.label}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            // Regular Mobile Link
                                            <Link
                                                href={link.href}
                                                className={`block py-3 px-4 text-sm font-semibold uppercase rounded-lg transition-colors ${isActive(link.href)
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-gray-800 hover:bg-primary/5 hover:text-primary"
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </div>
                                ))}

                                {/* Mobile CTA */}
                                <div className="px-2 pt-4">
                                    <Link
                                        href="/contact"
                                        className="block w-full bg-primary hover:bg-primary-hover text-white text-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Let's Talk
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}