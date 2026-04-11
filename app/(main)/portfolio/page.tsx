"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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

// Skeleton Loader Component (Dark Theme)
const PortfolioSkeleton = () => {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-900/50 border border-white/10 rounded-xl overflow-hidden animate-pulse">
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

// Portfolio Card Component (Dark Theme)
const PortfolioCard = ({ project, index }: { project: PortfolioType; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative"
        >
            <Link href={`/portfolio/${project.slug}`} className="block h-full">
                <div className="h-full bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group-hover:border-primary/30">

                    {/* Image Container */}
                    <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-900">
                        <Image
                            src={project.designImage}
                            alt={`${project.title} exhibition booth design`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 shadow-lg shadow-primary/30">
                                <Eye className="w-4 h-4" />
                                View Details
                            </span>
                        </div>

                        {/* Category Badge */}
                        {project.projectInfo?.category && (
                            <div className="absolute top-3 left-3 z-10">
                                <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-primary-light text-xs font-medium rounded-full border border-primary/30 shadow-lg">
                                    {project.projectInfo.category}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <h3 className="font-bold text-white text-lg mb-1 group-hover:text-primary-light transition-colors line-clamp-1">
                            {project.title}
                        </h3>

                        <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                            {project.exhibition_name}
                        </p>

                        {/* Meta Info */}
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
    const [data, setData] = useState<PortfolioType[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    const perPage = 9;

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, []);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = data
            .map(p => p.projectInfo?.category)
            .filter((c): c is string => !!c);
        return ["All", ...Array.from(new Set(cats))];
    }, [data]);

    // Filter and search logic
    const filteredData = useMemo(() => {
        return data.filter(project => {
            const matchesSearch =
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.exhibition_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.projectInfo?.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                project.projectInfo?.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [data, searchTerm, selectedCategory]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / perPage);
    const start = (page - 1) * perPage;
    const currentProjects = filteredData.slice(start, start + perPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [searchTerm, selectedCategory]);

    return (
        <div className="relative bg-black min-h-screen overflow-hidden">

            {/* Background Glow Effects */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top-left glow */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />

                {/* Top-right glow */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

                {/* Center subtle glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

                {/* Bottom-left glow */}
                <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />

                {/* Bottom-right glow */}
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary/12 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto py-12 md:py-16">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <Heading1 text="Our Portfolio" />
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        Explore our latest exhibition booth projects and brand experiences
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

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:border-primary hover:text-primary-light transition-colors w-full sm:w-auto justify-center"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter by Category</span>
                            <span className="text-primary-light font-medium ml-1">({selectedCategory})</span>
                        </button>
                    </div>

                    {/* Category Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50 hover:text-primary-light"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Results Count */}
                {!loading && filteredData.length > 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                        Showing {start + 1}-{Math.min(start + perPage, filteredData.length)} of {filteredData.length} projects
                    </p>
                )}

                {/* Portfolio Grid */}
                {loading ? (
                    <PortfolioSkeleton />
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                            }}
                            className="mt-4 text-primary-light hover:text-accent font-medium transition-colors"
                        >
                            Clear all filters →
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {currentProjects.map((project, index) => (
                            <PortfolioCard key={project._id} project={project} index={index} />
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
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`p-2 rounded-lg border transition-all ${page === 1
                                ? "text-gray-600 border-gray-700 cursor-not-allowed"
                                : "text-primary-light border-white/10 hover:border-primary hover:bg-primary/10"
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Page Numbers */}
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
                                        className={`w-10 h-10 rounded-lg font-medium transition-all ${page === pageNum
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
                                    <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
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
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className={`p-2 rounded-lg border transition-all ${page === totalPages
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