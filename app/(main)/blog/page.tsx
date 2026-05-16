"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import {
  Search,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronLeft,
  Filter,
} from "lucide-react";

// Types
type ImageData = {
  url: string;
  publicId: string;
};

type BlogPost = {
  _id: string;
  title: string;
  category: string;
  image: ImageData | string;
  createdAt: string;
  excerpt?: string;
  subtitle?: string;
  readTime?: string;
  featured?: boolean;
  slug: string;
  authorName?: string;
  authorAvatar?: ImageData | string;
};

// Helper: Get image URL from ImageData or string
const getImageUrl = (image: ImageData | string | undefined): string => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || "";
};

// Helper: Get Cloudinary optimized URL
const getOptimizedUrl = (
  url: string,
  width: number = 800,
  height: number = 600,
): string => {
  if (!url) return "";
  if (url.includes("cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`,
    );
  }
  return url;
};

// Helper: Get excerpt from content
const getExcerpt = (blog: any): string => {
  if (blog.excerpt) return blog.excerpt;
  if (blog.subtitle) return blog.subtitle;
  if (blog.content && Array.isArray(blog.content)) {
    const firstParagraph = blog.content.find(
      (b: any) => b.type === "paragraph",
    );
    if (firstParagraph && typeof firstParagraph.content === "string") {
      return firstParagraph.content.substring(0, 150) + "...";
    }
  }
  return "Read more about this article...";
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

// Blog Card Component
const BlogCard = ({ blog, index }: { blog: BlogPost; index: number }) => {
  const imageUrl = getImageUrl(blog.image);
  const optimizedUrl = getOptimizedUrl(imageUrl, 600, 400);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-linear-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full">
        {/* Image Container */}
        <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-900">
          {imageUrl ? (
            <Image
              src={optimizedUrl}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <span className="text-4xl">📝</span>
            </div>
          )}

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
              {formatDate(blog.createdAt)}
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
            {getExcerpt(blog)}
          </p>

          {/* Author */}
          {blog.authorName && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {blog.authorName.charAt(0)}
                </span>
              </div>
              <span className="text-xs text-gray-500">{blog.authorName}</span>
            </div>
          )}

          {/* Read More Link */}
          <div className="flex items-center text-primary font-medium text-sm group/link">
            <span className="group-hover/link:mr-1 transition-all">
              Read Article
            </span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

// Featured Post Component
const FeaturedPost = ({ blog }: { blog: BlogPost }) => {
  const imageUrl = getImageUrl(blog.image);
  const optimizedUrl = getOptimizedUrl(imageUrl, 1200, 600);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden h-100 md:h-125 group"
    >
      <Link href={`/blog/${blog.slug}`}>
        {imageUrl ? (
          <Image
            src={optimizedUrl}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-6xl">📝</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

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
              {getExcerpt(blog)}
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.createdAt)}
              </span>
              {blog.readTime && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {blog.readTime}
                </span>
              )}
              {blog.authorName && (
                <span className="flex items-center gap-2">
                  By {blog.authorName}
                </span>
              )}
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
        <div
          key={i}
          className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse border border-white/10"
        >
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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [visible, setVisible] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== FETCH BLOGS FROM API =====
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/blog", {
        params: { status: "published", limit: 50 },
      });
      const blogData = res.data.data || [];
      setBlogs(blogData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredPost = blogs.find((b) => b.featured) || blogs[0];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = blogs.map((b) => b.category);
    return ["All", ...Array.from(new Set(cats))];
  }, [blogs]);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getExcerpt(blog).toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const displayedBlogs = filteredBlogs.slice(0, visible);
  const hasMore = visible < filteredBlogs.length;

  // Remove featured post from grid if it's shown as featured
  const gridBlogs = displayedBlogs.filter((b) => b._id !== featuredPost?._id);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
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
              className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-primary-light transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <Link
              href="/"
              className="text-gray-400 hover:text-primary-light transition-colors"
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
          
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                Insights & Inspiration
              </span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Discover the latest trends, tips, and strategies in exhibition
              design and event marketing.
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
              <span className="text-primary-light font-medium ml-1">
                ({selectedCategory})
              </span>
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
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category
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
              Showing {gridBlogs.length} of {filteredBlogs.length} articles
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
                {gridBlogs.map((blog, index) => (
                  <BlogCard key={blog._id} blog={blog} index={index} />
                ))}
              </div>

              {/* Load More Button */}
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
