"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  CalendarDays,
  HelpCircle,
} from "lucide-react";
import Heading1 from "@/components/Heading1";

type Exhibition = {
  _id: string;
  exhibitionName: string;
  location: string;
  description: string;
  startDate?: string;
  endDate?: string;
  logo: {
    url: string;
    publicId: string;
  };
  createdAt?: string;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "TBA";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateRange = (start?: string, end?: string): string => {
  if (!start && !end) return "Date TBA";
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  const startStr = s
    ? s.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : "?";
  const endStr = e
    ? e.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "?";
  return `${startStr} – ${endStr}`;
};

// Particle effect
const AnimatedParticles = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
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

// Skeleton
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
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/exhibition");
      setExhibitions(res.data.data || []);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const todayStart = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const { running, next, upcoming } = useMemo(() => {
    const runningList: Exhibition[] = [];
    const upcomingList: Exhibition[] = [];

    exhibitions.forEach((ex) => {
      if (!ex.startDate || !ex.endDate) {
        upcomingList.push(ex);
        return;
      }
      const start = new Date(ex.startDate);
      const end = new Date(ex.endDate);
      const startDay = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
      );
      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      if (startDay <= todayStart && endDay >= todayStart) {
        runningList.push(ex);
      } else if (startDay > todayStart) {
        upcomingList.push(ex);
      }
    });

    upcomingList.sort((a, b) => {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    const nextEvent = upcomingList.length > 0 ? upcomingList[0] : null;
    const remainingUpcoming = upcomingList.slice(1, 7); // limit to 6

    return {
      running: runningList,
      next: nextEvent,
      upcoming: remainingUpcoming,
    };
  }, [exhibitions, todayStart]);

  const handleAddToCalendar = (event: Exhibition) => {
    if (!event.startDate || !event.endDate) return;
    const start = new Date(event.startDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const end = new Date(event.endDate).toISOString().replace(/-|:|\.\d+/g, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.exhibitionName)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.location)}`;
    window.open(url, "_blank");
  };

  if (loading) return <CampaignSkeleton />;
  if (exhibitions.length === 0) return null;

  return (
    <section className="relative w-full min-h-125 md:min-h-150 overflow-hidden bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>
      <AnimatedParticles />

      <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto py-12 md:py-16">
        <div className="text-center mb-8">
          <Heading1 text="Exhibition Events" />
        </div>

        {/* RUNNING & NEXT EXHIBITIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Running */}
          {running.length > 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-white mb-3">
                  <Image
                    src={running[0].logo?.url || "/placeholder.png"}
                    alt={running[0].exhibitionName}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-500/80 rounded-full mb-2">
                  RUNNING NOW
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {running[0].exhibitionName}
                </h3>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-gray-300 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-accent" />
                  {running[0].location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary-light" />
                  {formatDateRange(running[0].startDate, running[0].endDate)}
                </span>
              </div>
              <div className="mt-auto pt-6 flex justify-center">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-3 px-8 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg flex items-center gap-2"
                  >
                    Visit Now <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400">
              <Calendar className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No Running Exhibition</p>
              <p className="text-sm mt-1">
                Check our next event or upcoming exhibitions below.
              </p>
            </div>
          )}

          {/* Next Exhibition */}
          {next ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-white mb-3">
                  <Image
                    src={next.logo?.url || "/placeholder.png"}
                    alt={next.exhibitionName}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-green-500/80 rounded-full mb-2">
                  NEXT EVENT
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {next.exhibitionName}
                </h3>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-gray-300 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-accent" />
                  {next.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary-light" />
                  {formatDateRange(next.startDate, next.endDate)}
                </span>
              </div>
              <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCalendar(next)}
                  className="py-3 px-6 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition flex items-center gap-2"
                >
                  <CalendarDays className="w-4 h-4" />
                  Add to Calendar
                </motion.button>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-3 px-8 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg flex items-center gap-2"
                  >
                    Book Your Stand <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400">
              <CalendarDays className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No Upcoming Event</p>
              <p className="text-sm mt-1">
                Once exhibition dates are added, they’ll appear here.
              </p>
            </div>
          )}
        </div>

        {/* UPCOMING EXHIBITIONS (max 6) */}
        {upcoming.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              More Upcoming Exhibitions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((event) => (
                <motion.div
                  key={event._id}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 transition-all duration-300 hover:border-primary/50"
                >
                  <div className="flex flex-col items-center text-center mb-3">
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-white mb-2">
                      <Image
                        src={event.logo?.url || "/placeholder.png"}
                        alt={event.exhibitionName}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-white line-clamp-1">
                      {event.exhibitionName}
                    </h4>
                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mb-3">
                    <Calendar className="w-4 h-4 text-primary-light" />
                    {event.startDate || event.endDate
                      ? formatDateRange(event.startDate, event.endDate)
                      : "Date TBA"}
                  </div>
                  {/* Description on hover */}
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-gray-200 text-sm text-center line-clamp-4">
                      {event.description || "No description available."}
                    </p>
                  </div>

                  {(!event.startDate || !event.endDate) && (
                    <p className="mt-2 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Date to be announced
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 inline-flex items-center gap-2"
            >
              Book Your Stand <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
