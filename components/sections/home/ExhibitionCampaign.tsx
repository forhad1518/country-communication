"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    Calendar,
    MapPin,
    Users,
    ArrowRight,
    Building2,
    Timer,
    Sparkles,
    Bell,
    CalendarDays
} from "lucide-react";
import Heading1 from "@/components/Heading1";

// Types
type CampaignData = {
    _id: string;
    title: string;
    exhibitionName: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    bannerImage: string;
    boothNumber?: string;
    hallNumber?: string;
    ctaText: string;
    ctaLink: string;
    tags: string[];
    isActive?: boolean;
    stats?: {
        exhibitors: string;
        visitors: string;
        countries: string;
    };
};

// Countdown Timer Component
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                // Event started
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timeUnits = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds }
    ];

    return (
        <div className="flex gap-3 md:gap-6 justify-center">
            {timeUnits.map((unit, index) => (
                <motion.div
                    key={unit.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                >
                    <div className="relative">
                        <motion.div
                            className="w-16 md:w-24 h-16 md:h-24 bg-linear-to-br from-primary/20 to-accent/20 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20 shadow-xl backdrop-blur-sm"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={unit.value}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-3xl md:text-5xl font-bold text-white absolute"
                                >
                                    {String(unit.value).padStart(2, '0')}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl -z-10" />
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium uppercase tracking-wider">
                        {unit.label}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

// Particle Component - Fixed
const AnimatedParticles = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isClient || dimensions.width === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => {
                const startX = Math.random() * dimensions.width;
                const startY = Math.random() * dimensions.height;

                return (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        initial={{
                            x: startX,
                            y: startY,
                            opacity: 0
                        }}
                        animate={{
                            y: [startY, startY - 200, startY - 400],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: Math.random() * 8 + 6,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                    />
                );
            })}
        </div>
    );
};

// Skeleton Loader
const CampaignSkeleton = () => {
    return (
        <div className="relative w-full min-h-150 md:min-h-175 bg-linear-to-br from-gray-900 to-black animate-pulse">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto py-16 md:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="h-8 w-48 bg-white/10 rounded-full mx-auto mb-6" />
                    <div className="h-16 w-3/4 bg-white/10 rounded-lg mx-auto mb-4" />
                    <div className="h-8 w-1/2 bg-white/10 rounded-lg mx-auto mb-8" />
                    <div className="flex gap-4 justify-center mb-12">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Component
export default function ExhibitionCampaign() {
    const [campaign, setCampaign] = useState<CampaignData | null>({
        _id: "camp_001",
        title: "Experience the Future of Exhibition",
        exhibitionName: "Dubai Expo 2026",
        location: "Dubai World Trade Centre, UAE",
        startDate: "2026-03-15T09:00:00Z",
        endDate: "2026-04-20T18:00:00Z",
        description: "Join us at the world's largest exhibition showcase. Discover innovative booth designs, cutting-edge technology, and unparalleled networking opportunities.",
        bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop",
        boothNumber: "A-42",
        hallNumber: "Hall 3",
        ctaText: "Book Your Stand",
        ctaLink: "/contact",
        tags: ["Technology", "Innovation", "Networking", "Global Event"],
        isActive: true,
        stats: {
            exhibitors: "200+",
            visitors: "50k+",
            countries: "15+"
        }
    });
    const [loading, setLoading] = useState(false);
    const [isNotified, setIsNotified] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // useEffect(() => {
    //     fetchCampaign();
    // }, []);

    // const fetchCampaign = async () => {
    //     try {
    //         const res = await axios.get("/api/campaign");
    //         setCampaign(res.data.data);
    //     } catch (error) {
    //         console.error("Error fetching campaign:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleNotify = () => {
        setIsNotified(true);
        setTimeout(() => setIsNotified(false), 3000);
    };

    const handleAddToCalendar = () => {
        if (!campaign) return;

        const startDate = new Date(campaign.startDate).toISOString().replace(/-|:|\.\d+/g, '');
        const endDate = new Date(campaign.endDate).toISOString().replace(/-|:|\.\d+/g, '');

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(campaign.exhibitionName)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(campaign.description)}&location=${encodeURIComponent(campaign.location)}`;

        window.open(googleCalendarUrl, '_blank');
    };

    if (!isMounted) return <CampaignSkeleton />;
    if (loading) return <CampaignSkeleton />;
    if (!campaign) return null;

    const eventDate = new Date(campaign.startDate);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <section className="relative w-full min-h-150 md:min-h-175 overflow-hidden bg-linear-to-br from-gray-900 via-black to-gray-900">

            {/* Background Image with Parallax */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <Image
                    src={campaign.bannerImage}
                    alt={campaign.exhibitionName}
                    fill
                    className="object-cover opacity-40"
                    priority
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
                <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-transparent to-accent/20" />
            </motion.div>

            {/* Animated Particles - Fixed */}
            <AnimatedParticles />

            {/* Content */}
            <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto py-8 md:py-10">
                 <div>
                <Heading1 text="Next Exhibition" />
            </div>
                <div className="max-w-5xl mx-auto">

                    {/* Tags */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex flex-wrap gap-2 justify-center mb-6"
                    >
                        {campaign.tags.map((tag, i) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs md:text-sm rounded-full border border-white/20"
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex justify-center mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm text-primary text-sm font-medium rounded-full border border-primary/30">
                            <Sparkles className="w-4 h-4" />
                            Upcoming Exhibition
                            <Sparkles className="w-4 h-4" />
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4"
                    >
                        <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                            {campaign.title}
                        </span>
                    </motion.h1>

                    {/* Exhibition Name */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-300 text-center mb-4"
                    >
                        {campaign.exhibitionName}
                    </motion.h2>

                    {/* Location & Date */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-gray-300 mb-8"
                    >
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-accent" />
                            <span className="text-sm md:text-base">{campaign.location}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full hidden md:block" />
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary-light" />
                            <span className="text-sm md:text-base">{formattedDate}</span>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-gray-400 text-center max-w-3xl mx-auto mb-12 text-sm md:text-base"
                    >
                        {campaign.description}
                    </motion.p>

                    {/* Countdown Timer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mb-12"
                    >
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Timer className="w-5 h-5 text-accent" />
                            <span className="text-white font-medium">Event Starts In</span>
                        </div>
                        <CountdownTimer targetDate={campaign.startDate} />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href={campaign.ctaLink}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="group relative px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {campaign.ctaText}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-linear-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={false}
                                />
                            </motion.button>
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={handleNotify}
                            className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <AnimatePresence mode="wait">
                                {isNotified ? (
                                    <motion.div
                                        key="notified"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Bell className="w-5 h-5 fill-current" />
                                        Notified!
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="remind"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Bell className="w-5 h-5" />
                                        Remind Me
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={handleAddToCalendar}
                            className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <CalendarDays className="w-5 h-5" />
                            Add to Calendar
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/10"
                    >
                        <div className="text-center">
                            <div className="flex items-center gap-2 text-accent mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-2xl font-bold text-white">
                                    {campaign.stats?.exhibitors || "200+"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">Expected Exhibitors</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-2 text-primary-light mb-1">
                                <MapPin className="w-4 h-4" />
                                <span className="text-2xl font-bold text-white">
                                    {campaign.stats?.visitors || "50k+"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">Expected Visitors</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-2 text-accent mb-1">
                                <Building2 className="w-4 h-4" />
                                <span className="text-2xl font-bold text-white">
                                    {campaign.stats?.countries || "15+"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">Countries</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}