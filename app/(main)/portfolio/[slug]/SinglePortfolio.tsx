"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
    ArrowRight,
    Calendar,
    MapPin,
    Users,
    Clock,
    Award,
    ChevronRight,
    Play,
    Pause
} from "lucide-react";

// ===== BEFORE/AFTER SLIDER COMPONENT =====
const BeforeAfterSlider = ({ beforeImage, afterImage }: { beforeImage?: string; afterImage?: string }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging) handleMove(e.touches[0].clientX);
    };

    // Default placeholder images
    const defaultImage = "https://picsum.photos/800/600?placeholder";

    return (
        <div
            ref={containerRef}
            className="relative w-full h-100 sm:h-125 md:h-150 overflow-hidden rounded-xl sm:rounded-2xl cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
        >
            {/* BEFORE IMAGE (Design) */}
            <div className="absolute inset-0">
                <Image
                    src={beforeImage || defaultImage}
                    alt="Design"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium z-10">
                    DESIGN
                </div>
            </div>

            {/* AFTER IMAGE (Live) - Clipped */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <Image
                    src={afterImage || defaultImage}
                    alt="Live"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/90 backdrop-blur-sm text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium z-10">
                    REALITY
                </div>
            </div>

            {/* SLIDER LINE */}
            <div
                className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white shadow-lg pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="w-5 h-5 sm:w-8 sm:h-8 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <div className="flex gap-0.5 sm:gap-1">
                            <div className="w-0.5 sm:w-1 h-3 sm:h-4 bg-white rounded-full" />
                            <div className="w-0.5 sm:w-1 h-3 sm:h-4 bg-white rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* INSTRUCTION OVERLAY */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap">
                ← Drag to compare →
            </div>
        </div>
    );
};

// ===== STAT CARD COMPONENT =====
const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10"
    >
        <div className="p-2 sm:p-3 bg-linear-to-br from-primary/20 to-accent/20 rounded-lg">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-light" />
        </div>
        <div>
            <p className="text-lg sm:text-2xl font-bold">{value}</p>
            <p className="text-xs sm:text-sm text-gray-400">{label}</p>
        </div>
    </motion.div>
);

// ===== MAIN COMPONENT =====
interface PortfolioData {
    title?: string;
    exhibition_name?: string;
    liveImage?: string;
    designImage?: string;
    videoUrl?: string;
    projectInfo?: {
        clientName?: string;
        boothSize?: string;
        location?: string;
        buildTime?: number;
        projectOverview?: string;
        industry?: string;
    };
    process?: {
        renders?: string[];
        processText?: string;
        timeline?: Array<{ phase: string; duration: string }>;
    };
    materials?: string[];
    technologies?: string[];
    results?: {
        visitors?: number;
        engagement?: string;
        testimonial?: string;
        clientName?: string;
        leads?: number;
        roi?: string;
    };
    galleryImage?: string[];
    team?: Array<{ name: string; role: string; image: string }>;
}

export default function SinglePortfolio({
    data,
    next
}: {
    data: PortfolioData;
    next?: any;
}) {
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    // ===== SAFE DEFAULTS =====
    const safeData = {
        title: data?.title || "Untitled Project",
        exhibition_name: data?.exhibition_name || "Exhibition",
        liveImage: data?.liveImage || "https://picsum.photos/1200/800?live",
        designImage: data?.designImage || "https://picsum.photos/1200/800?design",
        projectInfo: {
            clientName: data?.projectInfo?.clientName || "Client",
            boothSize: data?.projectInfo?.boothSize || "N/A",
            location: data?.projectInfo?.location || "Location",
            buildTime: data?.projectInfo?.buildTime || 0,
            projectOverview: data?.projectInfo?.projectOverview || "No overview available.",
            industry: data?.projectInfo?.industry,
        },
        process: {
            renders: data?.process?.renders || [],
            processText: data?.process?.processText || "Process details coming soon.",
            timeline: data?.process?.timeline || [],
        },
        materials: data?.materials || [],
        technologies: data?.technologies || [],
        results: {
            visitors: data?.results?.visitors || 0,
            engagement: data?.results?.engagement || "N/A",
            testimonial: data?.results?.testimonial || "No testimonial yet.",
            clientName: data?.results?.clientName || "Client",
        },
        galleryImage: data?.galleryImage || [],
        team: data?.team || [],
    };

    return (
        <div ref={containerRef} className="bg-linear-to-b from-black via-gray-900 to-black text-white">
            {/* PROGRESS BAR */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center">
                <motion.div
                    className="absolute inset-0"
                    style={{ opacity: backgroundOpacity }}
                >
                    <Image
                        src={safeData.liveImage}
                        alt={safeData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
                </motion.div>

                <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                            <span className="text-xs sm:text-sm">Featured Project</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight max-w-5xl">
                            {safeData.title}
                        </h1>

                        <p className="text-base sm:text-xl md:text-2xl text-gray-300 mt-3 sm:mt-4 max-w-3xl">
                            {safeData.exhibition_name}
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
                            <StatCard icon={Users} label="Client" value={safeData.projectInfo.clientName} />
                            <StatCard icon={MapPin} label="Location" value={safeData.projectInfo.location} />
                            <StatCard icon={Calendar} label="Booth Size" value={safeData.projectInfo.boothSize} />
                            <StatCard icon={Clock} label="Build Time" value={`${safeData.projectInfo.buildTime} hrs`} />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-400">Scroll to explore</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center"
                        >
                            <div className="w-1 h-1.5 sm:h-2 bg-white/60 rounded-full mt-1.5 sm:mt-2" />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* OVERVIEW SECTION */}
            <section className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-300 mx-auto px-4 sm:px-6 py-20 sm:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8 bg-linear-to-r from-primary-light to-accent bg-clip-text text-transparent">
                        Project Overview
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
                        "{safeData.projectInfo.projectOverview}"
                    </p>

                    {safeData.projectInfo.industry && (
                        <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full">
                            <span className="text-primary-light text-sm sm:text-base">Industry:</span>
                            <span className="font-medium text-sm sm:text-base">{safeData.projectInfo.industry}</span>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* BEFORE/AFTER COMPARISON SLIDER */}
            <section className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto px-4 sm:px-6 py-16 sm:py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4">
                            Design <span className="text-gray-400">vs</span> Reality
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
                            Drag the slider to see how our 3D visualization compares to the final built booth
                        </p>
                    </div>

                    <BeforeAfterSlider
                        beforeImage={safeData.designImage}
                        afterImage={safeData.liveImage}
                    />
                </motion.div>
            </section>

            {/* PROCESS SECTION - Only show if renders exist */}
            {safeData.process.renders.length > 0 && (
                <section className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto px-4 sm:px-6 py-20 sm:py-32">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Design Process</h2>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {safeData.process.renders.map((img: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`relative ${
                                            i === 0 ? "col-span-2 h-64 sm:h-80" : "h-40 sm:h-48"
                                        } rounded-lg sm:rounded-xl overflow-hidden group`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Process render ${i + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6 sm:space-y-8"
                        >
                            <div className="prose prose-invert">
                                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                    {safeData.process.processText}
                                </p>
                            </div>

                            {safeData.process.timeline.length > 0 && (
                                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Project Timeline</h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        {safeData.process.timeline.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm sm:text-base">{item.phase}</p>
                                                    <p className="text-xs sm:text-sm text-gray-400">{item.duration}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* MATERIALS & TECHNOLOGIES - Only show if data exists */}
            {(safeData.materials.length > 0 || safeData.technologies.length > 0) && (
                <section className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto px-4 sm:px-6 py-16 sm:py-20">
                    <div className="bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-white/10">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">Materials & Technologies</h2>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            {[...safeData.materials, ...safeData.technologies].map((item: string, i: number) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.05, backgroundColor: "#009999", color: "#fff" }}
                                    className="px-4 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm font-medium cursor-default transition-all duration-300"
                                >
                                    {item}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* RESULTS & TESTIMONIAL */}
            <section className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto px-4 sm:px-6 py-20 sm:py-32">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Results That Speak</h2>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white/5 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
                                <p className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-primary-light to-accent bg-clip-text text-transparent">
                                    {safeData.results.visitors.toLocaleString()}+
                                </p>
                                <p className="text-gray-400 mt-2 text-sm sm:text-base">Total Visitors</p>
                            </div>
                            <div className="bg-white/5 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
                                <p className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-primary-light to-accent bg-clip-text text-transparent">
                                    {safeData.results.engagement}
                                </p>
                                <p className="text-gray-400 mt-2 text-sm sm:text-base">Engagement Rate</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -top-6 sm:-top-10 -left-6 sm:-left-10 text-6xl sm:text-8xl text-primary/20">"</div>
                        <div className="bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-8 sm:p-10 border border-white/10">
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed italic">
                                "{safeData.results.testimonial}"
                            </p>
                            <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-base sm:text-lg">
                                        {safeData.results.clientName.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm sm:text-base">{safeData.results.clientName}</p>
                                    <p className="text-xs sm:text-sm text-gray-400">{safeData.projectInfo.clientName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 sm:-bottom-10 -right-6 sm:-right-10 text-6xl sm:text-8xl text-primary/20">"</div>
                    </motion.div>
                </div>
            </section>

            {/* GALLERY - Only show if images exist */}
            {safeData.galleryImage.length > 0 && (
                <section className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto px-4 sm:px-6 py-16 sm:py-20">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Gallery</h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative h-75 sm:h-100 md:h-125 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4"
                    >
                        <Image
                            src={safeData.galleryImage[activeGalleryIndex] || safeData.galleryImage[0]}
                            alt={`Gallery image ${activeGalleryIndex + 1}`}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
                        {safeData.galleryImage.map((img: string, i: number) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setActiveGalleryIndex(i)}
                                className={`relative h-16 sm:h-20 rounded-lg overflow-hidden transition-all ${
                                    activeGalleryIndex === i
                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-black"
                                        : "opacity-60 hover:opacity-100"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.button>
                        ))}
                    </div>
                </section>
            )}

            {/* NEXT PROJECT */}
            {next && (
                <section className="border-t border-white/10">
                    <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto px-4 sm:px-6 py-16 sm:py-20">
                        <p className="text-gray-500 mb-2 text-sm sm:text-base">Next Project</p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 group-hover:text-primary-light transition-colors">
                                {next.title || "Next Project"}
                            </h3>
                            {next.liveImage && (
                                <div className="relative h-62.5 sm:h-87.5 md:h-100 rounded-xl sm:rounded-2xl overflow-hidden">
                                    <Image
                                        src={next.liveImage}
                                        alt={next.title || "Next"}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA SECTION */}
            <section className="border-t border-white/10">
                <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-250 mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                            Ready to build your <br />
                            <span className="bg-linear-to-r from-primary-light to-accent bg-clip-text text-transparent">
                                next exhibition booth?
                            </span>
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Let's create an immersive experience that captivates your audience and drives results
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <motion.a
                                href="/contact"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-hover text-white rounded-full font-semibold text-base sm:text-lg shadow-lg shadow-primary/20 transition-all"
                            >
                                Get Free Proposal
                            </motion.a>
                            <motion.a
                                href="/portfolio"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 sm:px-8 py-3 sm:py-4 border border-white/30 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                View Portfolio <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}