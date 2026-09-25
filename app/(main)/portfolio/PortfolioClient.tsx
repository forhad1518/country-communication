"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Heart,
  MapPin,
  Calendar,
} from "lucide-react";
import Heading1 from "@/components/Heading1";

// TYPES (matching real API response)
type ImageItem = {
  url: string;
  publicId: string;
  _id?: string;
};

type PortfolioType = {
  _id: string;
  title: string;
  exhibition_name: string;
  slug: string;
  thumbnailImage?: ImageItem;
  status?: string;
  projectInfo?: {
    clientName?: string;
    boothSize?: string;
    location?: string;
    buildTime?: string;
    overview?: string;
  };
  process?: {
    rendersImages?: ImageItem[];
    realImages?: ImageItem[];
    moodboardImages?: ImageItem[];
  };
  views?: number;
  likes?: number;
  createdAt?: string;
};

type Exhibition = {
  _id: string;
  exhibitionName: string;
  location: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  logo?: { url: string; publicId: string };
};

// Helper: Format date range
const formatDateRange = (start?: string, end?: string): string => {
  if (!start && !end) return "";
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  const startStr = s
    ? s.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
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

// Helper: Get thumbnail (prioritizes dedicated thumbnailImage)
const getThumbnail = (item: PortfolioType): string => {
  if (item.thumbnailImage?.url) return item.thumbnailImage.url;
  if (item.process?.rendersImages?.[0]?.url)
    return item.process.rendersImages[0].url;
  if (item.process?.realImages?.[0]?.url) return item.process.realImages[0].url;
  return "";
};

// Skeleton Loader (uniform grid)
const PortfolioSkeleton = () => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="aspect-[4/3] bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="w-full h-full bg-gradient-to-b from-gray-800/40 via-gray-900/60 to-black/80" />
        </div>
      ))}
    </div>
  );
};

// Portfolio Card
const PortfolioCard = ({
  project,
  index,
}: {
  project: PortfolioType;
  index: number;
}) => {
  const thumbnail = getThumbnail(project);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05 }}
      className="group relative h-full"
    >
      <Link href={`/portfolio/${project.slug}`} className="block h-full">
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-primary/50 shadow-md group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
          {/* Thumbnail Image - Only thumbnail visible normally */}
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2 bg-neutral-950">
              <span className="text-4xl">🏢</span>
              <span className="text-xs text-gray-500">No preview</span>
            </div>
          )}

          {/* Hover Overlay - Portfolio Information appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 z-10">
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {project.exhibition_name ? (
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/15 backdrop-blur-md text-white rounded-full border border-white/20 line-clamp-1 max-w-[70%] shadow-sm">
                  {project.exhibition_name}
                </span>
              ) : (
                <span />
              )}

              {project.projectInfo?.boothSize && (
                <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-primary text-white rounded-full shadow-sm shrink-0">
                  {project.projectInfo.boothSize} sqm
                </span>
              )}
            </div>

            {/* Hover Center Button */}
            <div className="flex items-center justify-center transform scale-85 group-hover:scale-100 transition-transform duration-300 pointer-events-none">
              <span className="px-4 py-2 bg-primary/95 backdrop-blur-md text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xl shadow-primary/40">
                <Eye className="w-3.5 h-3.5" /> View Details
              </span>
            </div>

            {/* Bottom Info */}
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 space-y-1.5">
              <h3 className="font-bold text-white text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {project.title}
              </h3>

              {project.projectInfo?.clientName && (
                <p className="text-xs text-gray-300 line-clamp-1">
                  <span className="text-gray-400">Client:</span>{" "}
                  {project.projectInfo.clientName}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/15">
                <div className="flex items-center gap-2">
                  {project.projectInfo?.location ? (
                    <span className="flex items-center gap-1 text-[11px] text-gray-300">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">
                        {project.projectInfo.location}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400">Exhibition Stall</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 shrink-0">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {project.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {project.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ===== MAIN CLIENT COMPONENT =====
function PortfolioContent() {
  const searchParams = useSearchParams();
  const exhibitionFromUrl = searchParams.get("exhibition");

  const [data, setData] = useState<PortfolioType[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExhibition, setSelectedExhibition] = useState(
    exhibitionFromUrl || "All",
  );
  const [showFilters, setShowFilters] = useState(false);

  const perPage = 12;

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchPortfolio();
    fetchExhibitions();
  }, []);

  useEffect(() => {
    if (exhibitionFromUrl) {
      setSelectedExhibition(exhibitionFromUrl);
      setShowFilters(true);
    }
  }, [exhibitionFromUrl]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/portfolio");
      setData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExhibitions = async () => {
    try {
      const res = await axios.get("/api/exhibition");
      setExhibitions(res.data.data || []);
    } catch (err) {
      console.error("Error fetching exhibitions:", err);
    }
  };

  // Get exhibition names for filter
  const exhibitionNames = useMemo(() => {
    const names = data
      .map((p) => p.exhibition_name)
      .filter((n): n is string => !!n);
    return ["All", ...Array.from(new Set(names))];
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.exhibition_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project.projectInfo?.clientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesExhibition =
        selectedExhibition === "All" ||
        project.exhibition_name === selectedExhibition;

      return matchesSearch && matchesExhibition;
    });
  }, [data, searchTerm, selectedExhibition]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / perPage);
  const start = (page - 1) * perPage;
  const currentProjects = filteredData.slice(start, start + perPage);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedExhibition]);

  const activeExhibition = exhibitions.find(
    (e) => e.exhibitionName === selectedExhibition,
  );

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          {selectedExhibition !== "All" && activeExhibition && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden"
            >
              {/* Background glow effect for logo */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Logo with glow */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-accent/30 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white backdrop-blur rounded-2xl p-3 border border-white/20 shadow-2xl flex items-center justify-center">
                    {activeExhibition.logo?.url ? (
                      <Image
                        src={activeExhibition.logo.url}
                        alt={activeExhibition.exhibitionName}
                        fill
                        className="object-contain p-3"
                      />
                    ) : (
                      <span className="text-4xl">🏢</span>
                    )}
                  </div>
                </div>

                {/* Exhibition Details */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20">
                      EXHIBITION
                    </span>
                    <button
                      onClick={() => setSelectedExhibition("All")}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg transition group"
                      title="Clear filter"
                    >
                      <X className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {activeExhibition.exhibitionName}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-300 mb-3">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {activeExhibition.location}
                    </span>
                    {(activeExhibition.startDate ||
                      activeExhibition.endDate) && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        {formatDateRange(
                          activeExhibition.startDate,
                          activeExhibition.endDate,
                        )}
                      </span>
                    )}
                  </div>
                  {activeExhibition.description && (
                    <p className="text-gray-400 text-sm text-justify leading-relaxed">
                      {activeExhibition.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          <Heading1 text="Our Portfolio" />
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            {selectedExhibition !== "All"
              ? `Showing projects for ${selectedExhibition}`
              : "Explore our latest exhibition booth projects and brand experiences"}
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:border-primary hover:text-primary transition-colors w-full sm:w-auto justify-center"
            >
              <Filter className="w-4 h-4" /> Filters{" "}
              {selectedExhibition !== "All" && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <label className="text-xs text-gray-500 mb-2 block">
                    Filter by Exhibition
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {exhibitionNames.map((name) => (
                      <button
                        key={name}
                        onClick={() => setSelectedExhibition(name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          selectedExhibition === name
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {name === "All" ? "All Exhibitions" : name}
                      </button>
                    ))}
                  </div>
                  {selectedExhibition !== "All" && (
                    <div className="pt-4">
                      <button
                        onClick={() => setSelectedExhibition("All")}
                        className="text-primary text-sm hover:text-accent transition"
                      >
                        Clear filter →
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        {!loading && filteredData.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Showing {start + 1}-{Math.min(start + perPage, filteredData.length)}{" "}
            of {filteredData.length} projects
            {selectedExhibition !== "All" && ` for ${selectedExhibition}`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <PortfolioSkeleton />
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-400">
              {selectedExhibition !== "All"
                ? `No projects for ${selectedExhibition}.`
                : "Try adjusting your search."}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedExhibition("All");
              }}
              className="mt-4 text-primary hover:text-accent font-medium transition-colors"
            >
              Clear all filters →
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {currentProjects.map((project, index) => (
              <PortfolioCard
                key={project._id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredData.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg border transition-all ${
                page === 1
                  ? "text-gray-600 border-gray-700 cursor-not-allowed"
                  : "text-primary border-white/10 hover:border-primary hover:bg-primary/10"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      page === pageNum
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="w-10 h-10 flex items-center justify-center text-gray-500">
                    ...
                  </span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-10 h-10 rounded-lg font-medium text-gray-400 hover:bg-white/5 hover:text-primary transition-all"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`p-2 rounded-lg border transition-all ${
                page === totalPages
                  ? "text-gray-600 border-gray-700 cursor-not-allowed"
                  : "text-primary border-white/10 hover:border-primary hover:bg-primary/10"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ===== EXPORT WRAPPED IN SUSPENSE =====
export default function PortfolioClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}
