"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "lucide-react";
import Heading1 from "@/components/Heading1";

// TYPES
type ProjectInfo = {
  clientName?: string;
  boothSize?: string;
  projectOverview?: string;
  location?: string;
  year?: string;
  category?: string;
};

type PortfolioType = {
  _id: string;
  title: string;
  exhibition_name: string;
  slug: string;
  designImage: string;
  liveImage?: string;
  projectInfo?: ProjectInfo;
};

type Exhibition = {
  logo: any;
  _id: string;
  exhibitionName: string;
  location: string;
};

// Skeleton Loader Component
const PortfolioSkeleton = () => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-gray-900/50 border border-white/10 rounded-xl overflow-hidden animate-pulse"
        >
          <div className="w-full h-52 bg-gray-800" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
            <div className="h-4 bg-gray-800 rounded w-1/3" />
            <div className="h-8 bg-gray-800 rounded w-1/4 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Portfolio Card Component
const PortfolioCard = ({
  project,
  index,
}: {
  project: PortfolioType;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/portfolio/${project.slug}`} className="block h-full">
        <div className="h-full bg-linear-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group-hover:border-primary/30">
          <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-900">
            <Image
              src={project.designImage}
              alt={`${project.title} exhibition booth design`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 shadow-lg shadow-primary/30">
                <Eye className="w-4 h-4" />
                View Details
              </span>
            </div>
            {project.projectInfo?.category && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-primary-light text-xs font-medium rounded-full border border-primary/30 shadow-lg">
                  {project.projectInfo.category}
                </span>
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-primary-light transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400 mb-2 line-clamp-1">
              {project.exhibition_name}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              {project.projectInfo?.boothSize && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {project.projectInfo.boothSize} sqm
                </span>
              )}
              {project.projectInfo?.location && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {project.projectInfo.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Main Component
export default function Portfolio() {
  const searchParams = useSearchParams();
  const exhibitionFromUrl = searchParams.get("exhibition");

  const [data, setData] = useState<PortfolioType[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExhibition, setSelectedExhibition] = useState(
    exhibitionFromUrl || "All",
  );
  const [showFilters, setShowFilters] = useState(false);

  const perPage = 9;

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchPortfolio();
    fetchExhibitions();
  }, []);

  // ===== SET EXHIBITION FROM URL =====
  useEffect(() => {
    if (exhibitionFromUrl) {
      setSelectedExhibition(exhibitionFromUrl);
      setShowFilters(true);
    }
  }, [exhibitionFromUrl]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: PortfolioType[] }>("/api/portfolio");
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
      const exhibitionData = res.data.data || [];
      setExhibitions(exhibitionData);
    } catch (err) {
      console.error("Error fetching exhibitions:", err);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = data
      .map((p) => p.projectInfo?.category)
      .filter((c): c is string => !!c);
    return ["All", ...Array.from(new Set(cats))];
  }, [data]);

  // Get exhibition names for filter
  const exhibitionNames = useMemo(() => {
    const names = data
      .map((p) => p.exhibition_name)
      .filter((n): n is string => !!n);
    return ["All", ...Array.from(new Set(names))];
  }, [data]);

  // Filter and search logic
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

      const matchesCategory =
        selectedCategory === "All" ||
        project.projectInfo?.category === selectedCategory;

      const matchesExhibition =
        selectedExhibition === "All" ||
        project.exhibition_name === selectedExhibition;

      return matchesSearch && matchesCategory && matchesExhibition;
    });
  }, [data, searchTerm, selectedCategory, selectedExhibition]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / perPage);
  const start = (page - 1) * perPage;
  const currentProjects = filteredData.slice(start, start + perPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedExhibition]);

  // Get active exhibition info
  const activeExhibition = exhibitions.find(
    (e) => e.exhibitionName === selectedExhibition,
  );

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-primary/12 rounded-full blur-3xl" />
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
          {/* Active Exhibition Banner */}
          {selectedExhibition !== "All" && activeExhibition && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-primary/10 border border-primary/20 rounded-2xl mb-6"
            >
              {activeExhibition.logo?.url && (
                <Image
                  src={activeExhibition.logo.url}
                  alt={activeExhibition.exhibitionName}
                  width={40}
                  height={40}
                  className="rounded-lg object-contain bg-white p-1"
                />
              )}
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  {activeExhibition.exhibitionName}
                </p>
                <p className="text-gray-400 text-xs">
                  {activeExhibition.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedExhibition("All")}
                className="ml-2 p-1.5 hover:bg-red-500/20 rounded-lg transition"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </motion.div>
          )}

          <Heading1 text="Our Portfolio" />
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            {selectedExhibition !== "All"
              ? `Showing projects for ${selectedExhibition}`
              : "Explore our latest exhibition booth projects and brand experiences"}
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
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

            <div className="flex gap-2">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:border-primary hover:text-primary-light transition-colors w-full sm:w-auto justify-center"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(selectedCategory !== "All" ||
                  selectedExhibition !== "All") && (
                  <span className="w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Filter Panels */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Exhibition Filter */}
                <div className="pt-4">
                  <label className="text-xs text-gray-500 mb-2 block">
                    Filter by Exhibition
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {exhibitionNames.map((name) => (
                      <button
                        key={name}
                        onClick={() => setSelectedExhibition(name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedExhibition === name
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50 hover:text-primary-light"
                        }`}
                      >
                        {name === "All" ? "All Exhibitions" : name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear All Filters */}
                {(selectedCategory !== "All" ||
                  selectedExhibition !== "All") && (
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedExhibition("All");
                      }}
                      className="text-primary-light text-sm hover:text-accent transition"
                    >
                      Clear all filters →
                    </button>
                  </div>
                )}
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

        {/* Portfolio Grid */}
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
                ? `No projects found for ${selectedExhibition}. Try selecting a different exhibition.`
                : "Try adjusting your search or filter criteria"}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedExhibition("All");
              }}
              className="mt-4 text-primary-light hover:text-accent font-medium transition-colors"
            >
              Clear all filters →
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
                  : "text-primary-light border-white/10 hover:border-primary hover:bg-primary/10"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      page === pageNum
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-primary-light"
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
                    className="w-10 h-10 rounded-lg font-medium text-gray-400 hover:bg-white/5 hover:text-primary-light transition-all"
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
                  : "text-primary-light border-white/10 hover:border-primary hover:bg-primary/10"
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
