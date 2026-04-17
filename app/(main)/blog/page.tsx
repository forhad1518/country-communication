"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Search,
    Calendar,
    ArrowRight,
    TrendingUp,
    Clock,
    ChevronLeft,
    Filter,
    Tag
} from "lucide-react";
import Heading1 from "@/components/Heading1";

// Types
type BlogPost = {
    id: number | string;
    title: string;
    category: string;
    image: string;
    date: string;
    excerpt: string;
    readTime?: string;
    featured?: boolean;
};

// Sample Blog Data
const allBlogs: BlogPost[] = [
    {
        id: 1,
        title: "How to Design an Attractive Exhibition Booth",
        category: "Booth Design",
        image: "https://picsum.photos/600/400?1",
        date: "March 15, 2025",
        readTime: "5 min read",
        excerpt: "Learn the essential design principles that make exhibition booths stand out and attract more visitors.",
        featured: true,
    },
    {
        id: 2,
        title: "Top Exhibition Trends in 2025",
        category: "Industry Trends",
        image: "https://picsum.photos/600/400?2",
        date: "February 28, 2025",
        readTime: "4 min read",
        excerpt: "Explore the latest global exhibition trends that are shaping event marketing strategies.",
        featured: true,
    },
    {
        id: 3,
        title: "Modular Booth vs Custom Booth",
        category: "Booth Strategy",
        image: "https://picsum.photos/600/400?3",
        date: "January 10, 2025",
        readTime: "6 min read",
        excerpt: "Understand the difference between modular and custom exhibition booths.",
    },
];

// Generate more blog posts
const moreBlogs: BlogPost[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 4,
    title: [
        "Exhibition Marketing Guide",
        "Booth Lighting Tips",
        "Engaging Visitors at Trade Shows",
        "Sustainable Exhibition Practices",
        "Pre-Show Marketing Strategies",
        "Post-Event Follow-up Guide",
        "Virtual Exhibition Integration",
        "Budget-Friendly Booth Ideas",
    ][i % 8] + ` ${Math.floor(i / 8) + 1}`,
    category: ["Marketing", "Design", "Strategy", "Technology", "Sustainability"][i % 5],
    image: `https://picsum.photos/600/400?random=${i + 10}`,
    date: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    readTime: `${Math.floor(Math.random() * 8) + 3} min read`,
    excerpt: "Professional insights on how to improve brand visibility and engagement in exhibitions.",
}));

// Blog Card Component
const BlogCard = ({ blog, index }: { blog: BlogPost; index: number }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative bg-linear-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
        >
            <Link href={`/blog/${blog.id}`} className="block h-full">
                {/* Image Container */}
                <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-900">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">
                            {blog.category}
                        </span>
                    </div>

                    {/* Featured Badge */}
                    {blog.featured && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="flex items-center gap-1 px-3 py-1.5 bg-accent text-black text-xs font-medium rounded-full shadow-lg">
                                <TrendingUp className="w-3 h-3" />
                                Featured
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {blog.date}
                        </span>
                        {blog.readTime && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {blog.readTime}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-light transition-colors line-clamp-2">
                        {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                        {blog.excerpt}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center text-primary-light font-medium text-sm group/link">
                        <span className="group-hover/link:mr-1 transition-all">Read Article</span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>
        </motion.article>
    );
};

// Featured Post Component
const FeaturedPost = ({ blog }: { blog: BlogPost }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden h-100 md:h-125 group"
        >
            <Link href={`/blog/${blog.id}`}>
                <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

                {/* Brand Color Overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-3xl">
                        <span className="inline-block px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full mb-4">
                            Featured Post
                        </span>

                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {blog.title}
                        </h2>

                        <p className="text-gray-300 text-sm md:text-base mb-6 max-w-2xl">
                            {blog.excerpt}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {blog.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {blog.readTime}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

// Skeleton Loader
const BlogSkeleton = () => {
    return (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse border border-white/10">
                    <div className="w-full h-56 bg-gray-800" />
                    <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-800 rounded w-24" />
                        <div className="h-6 bg-gray-800 rounded w-3/4" />
                        <div className="h-4 bg-gray-800 rounded w-full" />
                        <div className="h-4 bg-gray-800 rounded w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main Component
export default function BlogPage() {
    const router = useRouter();
    const [visible, setVisible] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    const blogs = [...allBlogs, ...moreBlogs];
    const featuredPost = blogs.find(b => b.featured);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = blogs.map(b => b.category);
        return ["All", ...Array.from(new Set(cats))];
    }, []);

    // Filter blogs
    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesSearch =
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                blog.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [blogs, searchTerm, selectedCategory]);

    const displayedBlogs = filteredBlogs.slice(0, visible);
    const hasMore = visible < filteredBlogs.length;

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">

            {/* Background Glow Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Content Container - 80% Width */}
            <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">

                {/* Navigation */}
                <div className="pt-8">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-primary cursor-pointer transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>

                        <Link
                            href="/"
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            Home
                        </Link>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="pt-12 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm text-primary text-sm font-medium rounded-full mb-4 border border-primary/30">
                            Our Blog
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            <Heading1 text="Insights and Inspiration for Exhibition Design and Event Marketing" />
                        </h1>

                        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                            Discover the latest trends, tips, and strategies in exhibition design and event marketing.
                        </p>
                    </motion.div>
                </section>

                {/* Featured Post */}
                {!loading && featuredPost && (
                    <section className="mb-12">
                        <FeaturedPost blog={featuredPost} />
                    </section>
                )}

                {/* Search and Filter Bar */}
                <section className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:border-primary hover:text-primary-light transition-colors w-full sm:w-auto justify-center"
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
                </section>

                {/* Results Count */}
                {!loading && filteredBlogs.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">
                            Showing {displayedBlogs.length} of {filteredBlogs.length} articles
                        </p>
                    </div>
                )}

                {/* Blog Grid */}
                <section className="pb-16">
                    {loading ? (
                        <BlogSkeleton />
                    ) : filteredBlogs.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No articles found
                            </h3>
                            <p className="text-gray-400">
                                Try adjusting your search or filter criteria
                            </p>
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
                        <>
                            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {displayedBlogs.map((blog, index) => (
                                    <BlogCard key={blog.id} blog={blog} index={index} />
                                ))}
                            </div>

                            {/* See More Button */}
                            {hasMore && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center mt-12"
                                >
                                    <button
                                        onClick={() => setVisible(visible + 6)}
                                        className="group relative px-8 py-4 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Load More Articles
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </motion.div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}