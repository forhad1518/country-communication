"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import Heading1 from "@/components/Heading1";
import bg from "@/public/fair_bg.webp";

// Types
type ExhibitionService = {
  _id: string;
  exhibitionName: string;
  location: string;
  description: string;
  logo: {
    url: string;
    publicId: string;
  };
};

// Skeleton Loader
const ServiceSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 h-full border border-white/20 shadow-lg animate-pulse"
      >
        <div className="w-full aspect-4/3 mb-3 md:mb-4 bg-gray-200 rounded-lg" />
        <div className="text-center space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default function Offer_service() {
  const [services, setServices] = useState<ExhibitionService[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== FETCH EXHIBITIONS FROM API =====
  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/exhibition");
      const data = res.data.data || [];
      setServices(data);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get optimized image URL
  const getImageUrl = (
    logo: { url: string; publicId: string } | undefined,
  ): string => {
    if (!logo || !logo.url) return "";
    if (logo.url.includes("cloudinary.com")) {
      return logo.url.replace(
        "/upload/",
        "/upload/w_auto,h_225,c_fill,q_auto,f_auto/",
      );
    }
    return logo.url;
  };

  return (
    <section
      className="relative py-16 md:py-24 bg-fixed bg-cover bg-center"
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
          {loading ? (
            <ServiceSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 40px -10px rgba(0, 153, 153, 0.3)",
                  }}
                  className="group cursor-pointer"
                >
                  <Link
                    href={`/portfolio?exhibition=${encodeURIComponent(service.exhibitionName)}`}
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 h-full border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Logo Container */}
                      <div className="relative w-full aspect-4/3 mb-3 md:mb-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-3 group-hover:from-primary/5 group-hover:to-accent/5 transition-colors">
                        {service.logo?.url ? (
                          <Image
                            src={getImageUrl(service.logo)}
                            alt={service.exhibitionName}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">🏢</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                          {service.exhibitionName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {service.location}
                        </p>
                      </div>

                      {/* Hover Indicator */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          {services.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-12 md:mt-16"
            >
              <Link
                href="/exhibitions"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-primary hover:border-primary transition-all duration-300 group shadow-lg cursor-pointer"
              >
                <span>Explore All Exhibitions</span>
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
    </section>
  );
}
