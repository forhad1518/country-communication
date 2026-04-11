"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Heading1 from "@/components/Heading1";
import bg from "@/public/fair_bg.webp";

import logo1 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.36 (1).jpeg";
import logo2 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.36 (2).jpeg";
import logo3 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (3).jpeg";
import logo4 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (4).jpeg";
import logo5 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (5).jpeg";
import logo6 from "@/public/images/fetures_logo/WhatsApp Image 2026-03-14 at 16.14.37 (6).jpeg";
import { div } from "framer-motion/client";

export default function Offer_service() {
    // Remove duplicates - only unique services
    const all_services = [
        { logo: logo1, title: "Exhibition Design", description: "Custom 3D exhibition stand designs" },
        { logo: logo2, title: "Booth Construction", description: "Premium quality booth fabrication" },
        { logo: logo3, title: "Event Management", description: "End-to-end event planning & execution" },
        { logo: logo4, title: "Logistics Support", description: "Transportation & warehousing solutions" },
        { logo: logo5, title: "Graphic Design", description: "Visual branding & signage" },
        { logo: logo6, title: "On-Site Supervision", description: "Professional project management" }
    ];

    return (
        <section 
            className="relative py-16 md:py-14 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: `url(${bg.src})` }}
        >
            {/* Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
            
            {/* Brand Color Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />

            {/* Content */}
            <div className="relative z-10">
                <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
                    
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <Heading1 text="We offer services at exhibitions and events." />
                    </motion.div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {all_services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                whileHover={{ 
                                    y: -5,
                                    boxShadow: "0 20px 40px -10px rgba(0, 153, 153, 0.3)"
                                }}
                                className="group"
                            >
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 h-full border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                                    
                                    {/* Logo Container */}
                                    <div className="relative w-full aspect-4/3 mb-3 md:mb-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-3 group-hover:from-primary/5 group-hover:to-accent/5 transition-colors">
                                        <Image
                                            src={service.logo}
                                            alt={service.title}
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                    </div>

                                    {/* Hover Indicator */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-12 md:mt-16"
                    >
                        <a
                            href="/services"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-primary hover:border-primary transition-all duration-300 group shadow-lg"
                        >
                            <span>Explore All Services</span>
                            <svg 
                                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}