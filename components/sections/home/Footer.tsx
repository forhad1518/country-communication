"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import logo from "@/public/logo_COCO.png";

// Custom Social Icons Component
const SocialIcon = ({ platform }: { platform: string }) => {
    const icons: Record<string, JSX.Element> = {
        facebook: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
        ),
        twitter: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
        ),
        linkedin: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        instagram: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
                <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                <circle cx="18.406" cy="5.594" r="1.44" />
            </svg>
        ),
        youtube: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    };
    return icons[platform] || null;
};

// Social links configuration
const socialLinks = [
    {
        name: "Facebook",
        href: "https://facebook.com/countrycommunication",
        platform: "facebook",
        hoverColor: "hover:text-[#1877F2] hover:bg-[#1877F2]/10"
    },
    {
        name: "Twitter",
        href: "https://twitter.com/countrycomm",
        platform: "twitter",
        hoverColor: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/company/countrycommunication",
        platform: "linkedin",
        hoverColor: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
    },
    {
        name: "Instagram",
        href: "https://instagram.com/countrycommunication",
        platform: "instagram",
        hoverColor: "hover:text-[#E4405F] hover:bg-[#E4405F]/10"
    },
    {
        name: "YouTube",
        href: "https://youtube.com/@countrycommunication",
        platform: "youtube",
        hoverColor: "hover:text-[#FF0000] hover:bg-[#FF0000]/10"
    },
];

// Footer links configuration
const footerLinks = {
    company: [
        { label: "About Us", href: "/about" },
        { label: "Our Team", href: "/team" },
        { label: "Careers", href: "/careers" },
        { label: "Contact Us", href: "/contact" },
    ],
    services: [
        { label: "Exhibition Stands", href: "/services/exhibition" },
        { label: "Event Management", href: "/services/events" },
        { label: "Interior Design", href: "/services/interior" },
        { label: "Brand Activation", href: "/services/brand-activation" },
    ],
    resources: [
        { label: "Portfolio", href: "/portfolio" },
        { label: "Blog & News", href: "/blog" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "FAQs", href: "/faqs" },
    ],
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Main Footer */}
            <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Company Info - 4 columns on large */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Logo */}
                            <Link href="/" className="inline-block mb-6">
                                <div className="w-44 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                    <Image
                                        src={logo}
                                        alt="Country Communication"
                                        width={176}
                                        height={48}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </Link>

                            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
                                Country Communication provides creative digital solutions — branding, web,
                                and marketing to help your business grow and stand out in the digital landscape.
                            </p>

                            {/* Newsletter Signup */}
                            <div className="mt-6">
                                <h5 className="text-sm font-semibold mb-3 text-white">Subscribe to our newsletter</h5>
                                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="px-4 py-2.5 bg-primary hover:bg-primary-hover rounded-lg transition-colors"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>

                    {/* Company Links */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h4 className="text-lg font-semibold mb-4 text-white relative inline-block">
                                Company
                                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-accent"></span>
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 inline-flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-200 mr-0 group-hover:mr-2"></span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Services Links */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h4 className="text-lg font-semibold mb-4 text-white relative inline-block">
                                Services
                                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-accent"></span>
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.services.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 inline-flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-200 mr-0 group-hover:mr-2"></span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h4 className="text-lg font-semibold mb-4 text-white relative inline-block">
                                Get In Touch
                                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-accent"></span>
                            </h4>

                            <address className="not-italic space-y-3">
                                {/* Address */}
                                <div className="flex items-start gap-3 text-gray-300 group">
                                    <MapPin className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5 group-hover:text-accent transition-colors" />
                                    <span className="text-sm">
                                        123 Main Street, Gulshan Avenue<br />
                                        Dhaka 1212, Bangladesh
                                    </span>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3 text-gray-300 group">
                                    <Mail className="w-5 h-5 text-primary-light flex-shrink-0 group-hover:text-accent transition-colors" />
                                    <a
                                        href="mailto:info@countrycomm.com"
                                        className="text-sm hover:text-accent transition-colors"
                                    >
                                        info@countrycomm.com
                                    </a>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-3 text-gray-300 group">
                                    <Phone className="w-5 h-5 text-primary-light flex-shrink-0 group-hover:text-accent transition-colors" />
                                    <a
                                        href="tel:+880123456789"
                                        className="text-sm hover:text-accent transition-colors"
                                    >
                                        +880 1234 56789
                                    </a>
                                </div>
                            </address>

                            {/* Social Links */}
                            <div className="mt-6">
                                <h5 className="text-sm font-semibold mb-3 text-white">Follow Us</h5>
                                <div className="flex gap-2">
                                    {socialLinks.map((social) => (
                                        <motion.a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.name}
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 ${social.hoverColor}`}
                                        >
                                            <SocialIcon platform={social.platform} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 pt-8 border-t border-white/10"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {currentYear} Country Communication. All rights reserved.
                        </p>

                        {/* Legal Links */}
                        <div className="flex gap-4 sm:gap-6">
                            <Link
                                href="/privacy-policy"
                                className="text-gray-400 hover:text-accent text-sm transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms-of-service"
                                className="text-gray-400 hover:text-accent text-sm transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/cookie-policy"
                                className="text-gray-400 hover:text-accent text-sm transition-colors"
                            >
                                Cookie Policy
                            </Link>
                        </div>

                        {/* Made with love */}
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                            Made with
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-red-500"
                            >
                                ❤️
                            </motion.span>
                            in Bangladesh
                        </p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}