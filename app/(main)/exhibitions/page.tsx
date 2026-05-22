"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

// Types
type Exhibition = {
  _id: string;
  exhibitionName: string;
  location: string;
  description: string;
  logo: {
    url: string;
    publicId: string;
  };
  createdAt: string;
};

// Helper: Get optimized Cloudinary URL
const getOptimizedUrl = (
url: string, p0: number, p1: number,
): string => {
  if (!url) return "";
  if (url.includes("cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/w_auto,h_300,c_fill,q_auto,f_auto/`,
    );
  }
  return url;
};

// Skeleton Loader
const ExhibitionSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={i}
        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 animate-pulse h-87.5"
      >
        <div className="h-52 bg-gray-800" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Empty State
const EmptyState = () => (
  <div className="text-center py-20">
    <div className="text-8xl mb-6">🏢</div>
    <h2 className="text-2xl font-bold text-white mb-3">No Exhibitions Yet</h2>
    <p className="text-gray-400 max-w-md mx-auto">
      Exhibition events will appear here once they are added from the admin
      panel.
    </p>
  </div>
);

export default function AllExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== FETCH ALL EXHIBITIONS =====
  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/exhibition");
      const data = res.data.data || [];
      setExhibitions(data);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-150 h-150 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
              Explore All Exhibitions
            </span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Discover our exhibition portfolio across different events and
            locations worldwide. Click on any exhibition to view related
            projects.
          </p>

          {/* Stats */}
          {!loading && exhibitions.length > 0 && (
            <div className="flex items-center justify-center gap-8 mt-6 text-sm text-gray-500">
              <span>{exhibitions.length} Exhibitions</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>
                {
                  [...new Set(exhibitions.map((e) => e.location))].filter(
                    (l) => l,
                  ).length
                }{" "}
                Locations
              </span>
            </div>
          )}
        </motion.div>

        {/* Exhibitions Grid */}
        {loading ? (
          <ExhibitionSkeleton />
        ) : exhibitions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <Link
                  href={`/portfolio?exhibition=${encodeURIComponent(exhibition.exhibitionName)}`}
                  className="block h-full"
                >
                  <div className="relative bg-linear-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full cursor-pointer">
                    {/* Logo/Image Section */}
                    <div className="relative h-52 bg-white flex items-center justify-center p-6 overflow-hidden">
                      {exhibition.logo?.url ? (
                        <>
                          <Image
                            src={getOptimizedUrl(exhibition.logo.url, 400, 300)}
                            alt={exhibition.exhibitionName}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </>
                      ) : (
                        <span className="text-7xl">🏢</span>
                      )}

                      {/* Brand color overlay on hover */}
                      <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="p-5 relative">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-light transition-colors line-clamp-1">
                        {exhibition.exhibitionName}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {exhibition.location}
                      </p>

                      {/* Hover Description - Slides Up */}
                      <div className="absolute inset-0 bg-linear-to-br from-gray-900/95 to-black/95 backdrop-blur-sm flex items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 text-center">
                          {exhibition.description || "No description available"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {exhibitions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-gray-500 text-sm mb-4">
              {exhibitions.length} exhibitions loaded
            </p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
            >
              <span>View All Portfolio</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
