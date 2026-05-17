"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  Copy,
  TrendingUp,
  MessageCircle,
  Heart,
  BookOpen,
  Globe,
  Lock,
} from "lucide-react";

// Types
type BlogStatus = "published" | "draft" | "archived";

type ImageData = {
  url: string;
  publicId: string;
};

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  tags: string[];
  image: ImageData | string;
  status: BlogStatus;
  authorName: string;
  authorAvatar?: ImageData | string;
  views: number;
  likes: number;
  comments: any[];
  readTime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

// Helper function to get image URL from ImageData or string
const getImageUrl = (image: ImageData | string | undefined): string => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || "";
};

// Helper function to get Cloudinary optimized URL
const getOptimizedImageUrl = (
  url: string,
  width: number = 100,
  height: number = 75,
): string => {
  if (!url) return "";

  // For Cloudinary URLs, add transformation
  if (url.includes("cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`,
    );
  }

  // For other URLs, return as is
  return url;
};

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-white text-gray-800"
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      {message}
    </motion.div>
  );
};

// Delete Confirmation Modal (Same)
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  blogTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blogTitle: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-96 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Delete
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete this blog post?
                </p>
                <p className="text-gray-800 font-medium text-sm mt-1 line-clamp-2">
                  "{blogTitle}"
                </p>
                <p className="text-red-500 text-xs mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Delete Blog
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Status Badge Component (Same)
const StatusBadge = ({ status }: { status: BlogStatus }) => {
  const styles = {
    published: "bg-green-100 text-green-700 border-green-200",
    draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
    archived: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const icons = {
    published: Globe,
    draft: Lock,
    archived: BookOpen,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Stats Card Component (Same)
const StatsCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-xl p-4 border shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

// Loading Skeleton (Same)
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="flex items-center gap-4 py-3 border-b border-gray-100"
      >
        <div className="w-8 h-4 bg-gray-200 rounded" />
        <div className="w-16 h-12 bg-gray-200 rounded" />
        <div className="flex-1 h-4 bg-gray-200 rounded" />
        <div className="flex-1 h-4 bg-gray-200 rounded" />
        <div className="flex-1 h-4 bg-gray-200 rounded" />
        <div className="w-24 h-8 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

// Blog Image Component with Error Handling
const BlogImage = ({
  image,
  alt,
  className,
}: {
  image: ImageData | string | undefined;
  alt: string;
  className?: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getImageUrl(image);
  const optimizedUrl = getOptimizedImageUrl(imageUrl, 100, 75);

  if (!imageUrl || imgError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <ImageIcon className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <Image
      src={optimizedUrl}
      alt={alt}
      width={64}
      height={48}
      className={`object-cover ${className}`}
      onError={() => setImgError(true)}
      unoptimized={!imageUrl.includes("cloudinary.com")}
    />
  );
};

// Author Avatar Component
const AuthorAvatar = ({
  avatar,
  name,
}: {
  avatar: ImageData | string | undefined;
  name: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = getImageUrl(avatar);

  if (!avatarUrl || imgError) {
    return (
      <div className="w-7 h-7 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-semibold">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={getOptimizedImageUrl(avatarUrl, 50, 50)}
      alt={name}
      width={28}
      height={28}
      className="rounded-full object-cover shrink-0"
      onError={() => setImgError(true)}
      unoptimized={!avatarUrl.includes("cloudinary.com")}
    />
  );
};

// Missing ImageIcon import add korte hobe
import { ImageIcon } from "lucide-react";

// Main Component
export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blog: BlogPost | null;
  }>({ isOpen: false, blog: null });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const itemsPerPage = 10;

  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/blog");
      const blogData = res.data.data || [];
      setBlogs(blogData);
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      setToast({ message: "Failed to load blogs", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = blogs.map((b) => b.category);
    return ["all", ...Array.from(new Set(cats))];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategory =
        categoryFilter === "all" || blog.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || blog.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      draft: blogs.filter((b) => b.status === "draft").length,
      totalViews: blogs.reduce((sum, b) => sum + (b.views || 0), 0),
    }),
    [blogs],
  );

  const handleDelete = async () => {
    if (!deleteModal.blog) return;
    try {
      await axios.delete(`/api/blog/${deleteModal.blog.slug}`);
      setBlogs((prev) => prev.filter((b) => b.slug !== deleteModal.blog?.slug));
      setToast({ message: "Blog deleted successfully", type: "success" });
      setDeleteModal({ isOpen: false, blog: null });
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      setToast({
        message: error.response?.data?.error || "Failed to delete blog",
        type: "error",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const slug of selectedBlogs) {
        await axios.delete(`/api/blog/${slug}`);
      }
      setBlogs((prev) => prev.filter((b) => !selectedBlogs.includes(b.slug)));
      setToast({
        message: `${selectedBlogs.length} blogs deleted`,
        type: "success",
      });
      setSelectedBlogs([]);
      setSelectAll(false);
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
      setToast({ message: "Failed to delete some blogs", type: "error" });
    }
  };

  const handleDuplicate = async (blog: BlogPost) => {
    try {
      const newBlogData = {
        title: `${blog.title} (Copy)`,
        subtitle: "",
        category: blog.category,
        image: blog.image,
        authorName: blog.authorName,
        authorRole: "",
        authorBio: "",
        authorAvatar: blog.authorAvatar || { url: "", publicId: "" },
        readTime: blog.readTime,
        tags: blog.tags,
        content: [{ id: "1", type: "paragraph", content: "Content here..." }],
        status: "draft" as BlogStatus,
        slug: `${blog.slug}-copy-${Date.now()}`,
      };

      const res = await axios.post("/api/blog", newBlogData);
      setBlogs((prev) => [res.data.data, ...prev]);
      setToast({ message: "Blog duplicated successfully", type: "success" });
    } catch (error: any) {
      console.error("Error duplicating blog:", error);
      setToast({
        message: error.response?.data?.error || "Failed to duplicate blog",
        type: "error",
      });
    }
  };

  const handleStatusChange = async (slug: string, newStatus: BlogStatus) => {
    try {
      await axios.put(`/api/blog/${slug}`, {
        status: newStatus,
        publishedAt:
          newStatus === "published" ? new Date().toISOString() : undefined,
      });

      setBlogs((prev) =>
        prev.map((b) =>
          b.slug === slug
            ? {
                ...b,
                status: newStatus,
                publishedAt:
                  newStatus === "published"
                    ? new Date().toISOString()
                    : b.publishedAt,
              }
            : b,
        ),
      );
      setToast({ message: "Blog status updated", type: "success" });
    } catch (error: any) {
      console.error("Error updating status:", error);
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(paginatedBlogs.map((b) => b.slug));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId],
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCommentCount = (comments: any[]): number => {
    if (!comments) return 0;
    let count = comments.length;
    comments.forEach((c: any) => {
      if (c.replies) count += c.replies.length;
    });
    return count;
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blog: null })}
        onConfirm={handleDelete}
        blogTitle={deleteModal.blog?.title || ""}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Blog Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your blog posts and articles
          </p>
        </div>
        <Link href="/admin/blog/add">
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 text-sm shadow-md shadow-primary/20">
            <Plus className="w-4 h-4" />
            Add New Blog
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Blogs"
          value={stats.total}
          icon={BookOpen}
          color="bg-blue-50 text-blue-600"
        />
        <StatsCard
          label="Published"
          value={stats.published}
          icon={Globe}
          color="bg-green-50 text-green-600"
        />
        <StatsCard
          label="Drafts"
          value={stats.draft}
          icon={Lock}
          color="bg-yellow-50 text-yellow-600"
        />
        <StatsCard
          label="Total Views"
          value={stats.totalViews}
          icon={TrendingUp}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(categoryFilter !== "all" || statusFilter !== "all") && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 pt-4 border-t mt-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as BlogStatus | "all")
                    }
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {(categoryFilter !== "all" || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setStatusFilter("all");
                    }}
                    className="text-primary text-sm hover:text-primary-hover transition self-end"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between"
        >
          <span className="text-sm text-gray-700">
            {selectedBlogs.length} blog{selectedBlogs.length > 1 ? "s" : ""}{" "}
            selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Selected
          </button>
        </motion.div>
      )}

      {/* Blog Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Blog
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  Author
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Category
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">
                  Stats
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden xl:table-cell">
                  Date
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <TableSkeleton />
                  </td>
                </tr>
              ) : paginatedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No blog posts found</p>
                    {(searchTerm ||
                      categoryFilter !== "all" ||
                      statusFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("all");
                          setStatusFilter("all");
                        }}
                        className="mt-2 text-primary text-sm hover:text-primary-hover"
                      >
                        Clear search & filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog, i) => (
                  <tr
                    key={blog._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition group"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedBlogs.includes(blog._id)}
                        onChange={() => toggleSelect(blog._id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* Fixed: Blog Image with proper width/height */}
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <BlogImage
                            image={blog.image}
                            alt={blog.title}
                            className="w-16 h-12"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm line-clamp-1 text-gray-800">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {blog.excerpt || "No excerpt"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {blog.readTime}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">
                              {blog.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {/* Fixed: Author Avatar with proper width/height */}
                        <AuthorAvatar
                          avatar={blog.authorAvatar}
                          name={blog.authorName}
                        />
                        <span className="text-sm text-gray-700">
                          {blog.authorName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <select
                        value={blog.status}
                        onChange={(e) =>
                          handleStatusChange(
                            blog.slug,
                            e.target.value as BlogStatus,
                          )
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white cursor-pointer focus:outline-none focus:border-primary"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1" title="Likes">
                          <Heart className="w-3.5 h-3.5" />
                          {blog.likes}
                        </span>
                        <span
                          className="flex items-center gap-1"
                          title="Comments"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {getCommentCount(blog.comments)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <div className="text-sm text-gray-500">
                        <p>{formatDate(blog.createdAt)}</p>
                        <p className="text-xs text-gray-400">
                          {blog.status === "published" && blog.publishedAt
                            ? `Published ${formatDate(blog.publishedAt)}`
                            : `Updated ${formatDate(blog.updatedAt)}`}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(blog)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/blog/edit/${blog.slug}`}
                          className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/5 rounded transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, blog })}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of{" "}
              {filteredBlogs.length} blogs
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-medium transition ${
                      currentPage === pageNum
                        ? "bg-primary text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="w-7 h-7 flex items-center justify-center text-gray-400">
                    ...
                  </span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-7 h-7 rounded text-xs font-medium text-gray-500 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
