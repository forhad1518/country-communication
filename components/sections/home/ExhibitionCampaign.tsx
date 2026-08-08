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
  Users,
  LayoutGrid,
  List,
  Building2,
  Clock,
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

// --- Helper Functions ---
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

// Calculate progress percentage based on start and end date
const calculateProgress = (start?: string, end?: string): number => {
  if (!start || !end) return 0;
  const now = new Date().getTime();
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (now < startTime) return 0;
  if (now > endTime) return 100;

  const total = endTime - startTime;
  const current = now - startTime;
  return Math.round((current / total) * 100);
};

// --- Countdown Timer Component ---
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col w-full">
      <div className="text-xs text-gray-300 uppercase tracking-wider mb-2 text-center lg:text-left">
        Starts In
      </div>
      <div className="flex justify-center lg:justify-start items-center gap-3 lg:gap-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.mins },
          { label: "Secs", value: timeLeft.secs },
        ].map((unit, idx) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="flex items-end gap-1">
              <span className="text-2xl md:text-3xl font-bold font-mono text-white tabular-nums bg-black/30 backdrop-blur px-2 py-1 rounded-lg shadow-inner border border-white/10">
                {String(unit.value).padStart(2, "0")}
              </span>
              {idx < 3 && (
                <span className="text-gray-500 font-bold text-lg hidden sm:block">
                  :
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase text-gray-400 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Component ---
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
    const remainingUpcoming = upcomingList.slice(1, 6);

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
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.exhibitionName,
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      event.description || "",
    )}&location=${encodeURIComponent(event.location)}`;
    window.open(url, "_blank");
  };

  if (loading)
    return <div className="min-h-screen bg-[#070d16] animate-pulse" />;

  return (
    <section className="relative w-full min-h-screen bg-[#070d16] text-white py-12 md:py-20 overflow-hidden font-sans">
      {/* Background Image with Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/37895825/pexels-photo-37895825/free-photo-of-colorful-shopping-mall-atrium-in-dhaka.jpeg')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="absolute inset-0 bg-linear-to-b from-[#070d16] via-transparent to-[#070d16]" />
        {/* App-specific Primary/Accent Color Glows (No extra colors) */}
        <div className="absolute top-1/4 left-1/4 w-150 h-150 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-175 h-175 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-[90%] lg:w-[80%] max-w-7xl mx-auto">
        {/* Header with "Discover Bangladesh" */}
        <div className="text-center mb-12 md:mb-16 relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 w-full h-full" />
          <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-2">
            Exhibition Events
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Discover Bangladesh&apos;s <br />
            <span className="text-primary">Leading Trade Exhibitions</span>
          </h1>
          <p className="mt-4 text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Explore ongoing, upcoming and future trade fairs across Bangladesh.
          </p>
        </div>

        {/* Main Timeline Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* 1. LEFT: Timeline Sidebar */}
          <div className="lg:w-40 shrink-0 flex flex-row lg:flex-col items-start lg:items-center gap-4 lg:gap-0 relative pb-8 lg:pb-0">
            {/* Timeline Line */}
            <div className="absolute left-3 lg:left-1/2 top-2 bottom-4 w-px bg-white/10 lg:-translate-x-1/2 hidden lg:block" />
            <div className="absolute left-3 lg:left-1/2 top-2 h-full w-px bg-linear-to-b from-primary/0 via-primary/20 to-primary/0 lg:-translate-x-1/2 block lg:hidden" />

            {/* Running Status */}
            <div className="relative z-10 flex items-center gap-3 lg:flex-col lg:gap-2 mb-0 lg:mb-16 group cursor-pointer w-full lg:w-auto">
              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-primary ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all shadow-lg shadow-primary/30" />
              <div className="text-xs font-medium text-white bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                RUNNING
              </div>
            </div>

            {/* Next Status */}
            <div className="relative z-10 flex items-center gap-3 lg:flex-col lg:gap-2 mb-0 lg:mb-16 group cursor-pointer w-full lg:w-auto">
              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-accent ring-4 ring-accent/20 group-hover:ring-accent/40 transition-all shadow-lg shadow-accent/30" />
              <div className="text-xs font-medium text-white bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                NEXT
              </div>
            </div>

            {/* Upcoming Status */}
            <div className="relative z-10 flex items-center gap-3 lg:flex-col lg:gap-2 group cursor-pointer w-full lg:w-auto">
              <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-gray-600 ring-4 ring-gray-600/20 group-hover:ring-gray-600/40 transition-all" />
              <div className="text-xs font-medium text-gray-400 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                UPCOMING
              </div>
            </div>
          </div>

          {/* 2. RIGHT: Content Area */}
          <div className="flex-1">
            {/* A. Running Expo (Big Card) */}
            {running.length > 0 ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Logo */}
                  <div className="shrink-0 w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg relative mx-auto md:mx-0">
                    <Image
                      src={running[0].logo?.url || "/placeholder.png"}
                      alt={running[0].exhibitionName}
                      fill
                      className="object-contain p-3"
                    />
                    <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-[#070d16]">
                      LIVE NOW
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {running[0].exhibitionName}
                      </h3>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        {running[0].location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {formatDateRange(
                          running[0].startDate,
                          running[0].endDate,
                        )}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary-light" />
                        15,000+ Visitors
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 max-w-xl mx-auto md:mx-0">
                      {running[0].description ||
                        "International exhibition on beauty, cosmetics, and lifestyle technology."}
                    </p>

                    {/* Calculated Progress Bar */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 max-w-md mx-auto md:mx-0">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${calculateProgress(running[0].startDate, running[0].endDate)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 max-w-md mx-auto md:mx-0">
                      <span>Expo is Running</span>
                      <span>
                        {calculateProgress(
                          running[0].startDate,
                          running[0].endDate,
                        )}
                        % Completed
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                      <Link
                        href={`/portfolio?exhibition=${encodeURIComponent(running[0].exhibitionName)}`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2.5 bg-linear-to-r from-primary to-primary-hover text-white font-medium rounded-lg shadow-lg hover:shadow-primary/30 transition"
                        >
                          Visit Expo →
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition flex items-center gap-2"
                      >
                        <LayoutGrid className="w-4 h-4" /> Floor Plan →
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 mb-8">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No Running Exhibition</p>
              </div>
            )}

            {/* B. Next Expo + Countdown (Big Card) */}
            {next ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-8 justify-between items-center lg:items-stretch">
                  {/* Left: Details */}
                  <div className="flex-1 flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full">
                    <div className="shrink-0 w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg relative">
                      <Image
                        src={next.logo?.url || "/placeholder.png"}
                        alt={next.exhibitionName}
                        fill
                        className="object-contain p-3"
                      />
                    </div>
                    <div className="space-y-3 w-full sm:w-auto text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="px-2 py-1 text-xs font-semibold text-accent bg-accent/10 rounded-full border border-accent/20">
                          NEXT EXPO
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {next.exhibitionName}
                      </h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-gray-300">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />{" "}
                          {next.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />{" "}
                          {formatDateRange(next.startDate, next.endDate)}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {["Business", "Technology", "Innovation"].map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCalendar(next)}
                          className="px-5 py-2 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition flex items-center gap-2"
                        >
                          <CalendarDays className="w-4 h-4" /> Add to Calendar
                        </motion.button>
                        <Link href="/contact">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-linear-to-r from-primary to-primary-hover text-white font-medium rounded-lg shadow-lg hover:shadow-primary/30 transition flex items-center gap-2"
                          >
                            Book Your Stand →
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Right: Countdown */}
                  <div className="lg:w-80 w-full shrink-0 bg-black/40 backdrop-blur rounded-xl p-4 border border-white/5 flex flex-col justify-center items-center mt-4 lg:mt-0">
                    {next.startDate && (
                      <CountdownTimer targetDate={next.startDate} />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 mb-8">
                <CalendarDays className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  No Upcoming Event Scheduled
                </p>
              </div>
            )}

            {/* C. Upcoming Exhibitions Grid (Max 6 Cards) */}
            {upcoming.length > 0 && (
              <div className="mb-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Upcoming Exhibitions
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 rounded-lg text-white">
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/5 rounded-lg text-gray-500">
                      <List className="w-4 h-4" />
                    </button>
                    <Link
                      href="/portfolio"
                      className="text-xs text-gray-400 hover:text-white transition ml-2 underline underline-offset-4"
                    >
                      View All
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((event) => (
                    <motion.div
                      key={event._id}
                      whileHover={{
                        y: -5,
                        borderColor: "rgba(255,255,255,0.3)",
                      }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 transition-all duration-300 flex flex-col h-full relative"
                    >
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden shrink-0 mb-3">
                          <Image
                            src={event.logo?.url || "/placeholder.png"}
                            alt={event.exhibitionName}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <h4 className="text-base font-semibold text-white truncate w-full">
                          {event.exhibitionName}
                        </h4>
                        <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-accent" />{" "}
                          {event.location}
                        </p>
                      </div>

                      <div className="space-y-2 flex-1 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                          <Calendar className="w-3 h-3 text-primary" />
                          <span>
                            {event.startDate || event.endDate
                              ? formatDateRange(event.startDate, event.endDate)
                              : "Date TBA"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        {/* Auto-generated Tag using Primary/Accent (No extra colors) */}
                        <span className="text-[10px] px-2 py-1 rounded-full border border-primary/50 text-primary bg-primary/10">
                          {event.exhibitionName.split(" ")[0] || "Event"}
                        </span>
                        <Link
                          href={`/portfolio?exhibition=${encodeURIComponent(event.exhibitionName)}`}
                          className="text-xs text-accent hover:text-accent/80 transition flex items-center gap-1 group"
                        >
                          Learn More{" "}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* D. Bottom CTA Banner */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="flex items-center gap-4 z-10 text-center md:text-left">
                <div className="p-3 bg-primary/20 rounded-full hidden sm:block">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Want to Exhibit?
                  </h4>
                  <p className="text-sm text-gray-300">
                    Book your stand in Bangladesh's leading trade exhibitions
                    and grow your business.
                  </p>
                </div>
              </div>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-lg shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 z-10 whitespace-nowrap w-full md:w-auto justify-center"
                >
                  Book Your Stand Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
