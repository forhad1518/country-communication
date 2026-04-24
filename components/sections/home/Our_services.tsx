"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Heading1 from "@/components/Heading1"; // Updated heading component
import exibition from "@/public/images/service_vector/stole.png";
import logistics from "@/public/images/service_vector/logistics.webp";
import interior from "@/public/images/service_vector/interior.png";
import promotion from "@/public/images/service_vector/promotion.jpg";

// Service data with descriptions and links
const servicesData = [
    {
        img: exibition,
        title: "Exhibition Stands",
        description: "Custom-designed exhibition booths that captivate and engage your audience",
        link: "/services/exhibition",
        color: "from-primary/20 to-primary/5",
        iconColor: "text-primary-light",
        stats: "200+ Projects"
    },
    {
        img: logistics,
        title: "Events & Logistics",
        description: "Seamless event planning and logistics management for flawless execution",
        link: "/services/events",
        color: "from-accent/20 to-accent/5",
        iconColor: "text-accent",
        stats: "24/7 Support"
    },
    {
        img: interior,
        title: "Interior & Exterior",
        description: "Innovative interior and exterior design solutions for commercial spaces",
        link: "/services/interior",
        color: "from-primary/20 to-primary/5",
        iconColor: "text-primary-light",
        stats: "100+ Designs"
    },
    {
        img: promotion,
        title: "Branding & Promotion",
        description: "Strategic branding and promotional campaigns that drive business growth",
        link: "/services/branding",
        color: "from-accent/20 to-accent/5",
        iconColor: "text-accent",
        stats: "500+ Campaigns"
    }
];

// Individual Service Card Component
const ServiceCard = ({ service, index }: { service: typeof servicesData[0]; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative"
        >
            <Link href={service.link} className="block h-full">
                <div className={`
                    h-full bg-linear-to-br ${service.color} 
                    rounded-2xl p-6 md:p-8 
                    border border-white/10 
                    backdrop-blur-sm
                    shadow-xl hover:shadow-2xl 
                    transition-all duration-500
                    hover:border-primary/30
                `}>

                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4">
                        <span className="text-xs font-semibold px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white/80 border border-white/10">
                            {service.stats}
                        </span>
                    </div>

                    {/* Image Container */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40  mx-auto mb-6">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-primary/30 to-accent/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Image */}
                        <Image
                            src={service.img}
                            alt={service.title}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                            {service.title}
                            <motion.span
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                className={`inline-block ${service.iconColor} transition-colors`}
                            >
                                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.span>
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                            {service.description}
                        </p>

                        {/* Learn More Link */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold">
                            <span className={`${service.iconColor} group-hover:translate-x-1 transition-transform`}>
                                Learn More
                            </span>
                            <ArrowRight className={`w-4 h-4 ${service.iconColor} group-hover:translate-x-2 transition-transform`} />
                        </div>
                    </div>

                    {/* Hover Gradient Border */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/0 via-primary/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
            </Link>
        </motion.div>
    );
};

// Main Component
export default function OurServices() {
    return (
        <section className="py-16 md:py-24 bg-linear-to-b from-black via-gray-900 to-black overflow-hidden">
            <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">

                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold"
                    >
                        <Heading1 text="Our Services" />
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 mt-4 text-sm md:text-base max-w-2xl mx-auto"
                    >
                        Comprehensive exhibition and event solutions tailored to your brand's unique needs
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {servicesData.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 md:mt-20 text-center"
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
                    >
                        <span>View All Services</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}