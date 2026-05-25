"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Building2,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import Heading1 from "@/components/Heading1";

// Types
type ExhibitionEventData = {
  running: {
    exhibitionName: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  next: {
    exhibitionName: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
};

// Helper: Format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Helper: Format date range
const formatDateRange = (start: string, end: string): string => {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const endStr = endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} - ${endStr}`;
};

// Particle Component
const AnimatedParticles = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
            initial={{ x: startX, y: startY, opacity: 0 }}
            animate={{
              y: [startY, startY - 200, startY - 400],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

// Skeleton Loader
const CampaignSkeleton = () => (
  <div className="relative w-full min-h-125 md:min-h-150 bg-linear-to-br from-gray-900 to-black animate-pulse">
    <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto py-16">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="h-8 w-48 bg-white/10 rounded-full mx-auto" />
        <div className="h-16 w-3/4 bg-white/10 rounded-lg mx-auto" />
        <div className="h-8 w-1/2 bg-white/10 rounded-lg mx-auto" />
        <div className="h-4 w-full bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

export default function ExhibitionCampaign() {
  const [events, setEvents] = useState<ExhibitionEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"running" | "next">("next");

  // ===== FETCH EVENTS =====
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/exhibition-event");
      setEvents(res.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    const event = activeTab === "running" ? events?.running : events?.next;
    if (!event) return;

    const startDate = new Date(event.startDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const endDate = new Date(event.endDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.exhibitionName)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(googleCalendarUrl, "_blank");
  };

  if (loading) return <CampaignSkeleton />;

  // Check if any event exists
  const hasRunningEvent =
    events?.running?.exhibitionName && events?.running?.isActive;
  const hasNextEvent = events?.next?.exhibitionName && events?.next?.isActive;

  if (!hasRunningEvent && !hasNextEvent) return null;

  const currentEvent = activeTab === "running" ? events?.running : events?.next;
  if (!currentEvent?.exhibitionName) return null;

  return (
    <section className="relative w-full min-h-125 md:min-h-150 overflow-hidden bg-linear-to-br from-gray-900 via-black to-gray-900">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>

      {/* Particles */}
      <AnimatedParticles />

      {/* Content */}
      <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto py-12 md:py-16">
        {/* Heading */}
        <div className="text-center mb-8">
          <Heading1 text="Exhibition Events" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {hasRunningEvent && (
            <button
              onClick={() => setActiveTab("running")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "running"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50"
              }`}
            >
              🔴 Running Event
            </button>
          )}
          {hasNextEvent && (
            <button
              onClick={() => setActiveTab("next")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "next"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50"
              }`}
            >
              🟢 Next Event
            </button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm text-primary text-sm font-medium rounded-full border border-primary/30">
              <Sparkles className="w-4 h-4" />
              {activeTab === "running"
                ? "Currently Running"
                : "Upcoming Exhibition"}
              <Sparkles className="w-4 h-4" />
            </span>
          </motion.div>

          {/* Exhibition Name */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-4"
          >
            <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
              {currentEvent.exhibitionName}
            </span>
          </motion.h2>

          {/* Location & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-gray-300 mb-6"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-sm md:text-base">
                {currentEvent.location}
              </span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full hidden md:block" />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-light" />
              <span className="text-sm md:text-base">
                {formatDateRange(currentEvent.startDate, currentEvent.endDate)}
              </span>
            </div>
          </motion.div>

          {/* Description */}
          {currentEvent.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-center max-w-3xl mx-auto mb-8 text-sm md:text-base leading-relaxed"
            >
              {currentEvent.description}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {activeTab === "running" ? "Visit Now" : "Book Your Stand"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCalendar}
              className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarDays className="w-5 h-5" />
              Add to Calendar
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
