"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Clock,
  User,
  Tag,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
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

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  status: BlogStatus;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  comments: number;
  readTime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

// Sample Blog Data
const sampleBlogs: BlogPost[] = [
  {
    _id: "1",
    title:
      "How to Design an Attractive Exhibition Booth That Drives Engagement",
    slug: "how-to-design-attractive-exhibition-booth",
    excerpt:
      "Learn the essential design principles that make exhibition booths stand out and attract more visitors.",
    content: "Full content here...",
    category: "Booth Design",
    tags: ["Exhibition", "Design", "Booth"],
    image: "https://picsum.photos/800/400?booth1",
    status: "published",
    author: {
      _id: "user1",
      name: "Iqbal Mahmud",
      avatar: "https://picsum.photos/50/50?author1",
    },
    views: 2547,
    likes: 342,
    comments: 28,
    readTime: "8 min read",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-20T14:00:00Z",
    publishedAt: "2025-01-15T10:30:00Z",
  },
  {
    _id: "2",
    title: "Top Exhibition Trends in 2025 That You Need to Know",
    slug: "top-exhibition-trends-2025",
    excerpt:
      "Explore the latest global exhibition trends that are shaping event marketing strategies.",
    content: "Full content here...",
    category: "Industry Trends",
    tags: ["Trends", "2025", "Marketing"],
    image: "https://picsum.photos/800/400?trends",
    status: "published",
    author: {
      _id: "user2",
      name: "Fatima Ahmed",
      avatar: "https://picsum.photos/50/50?author2",
    },
    views: 1823,
    likes: 256,
    comments: 15,
    readTime: "6 min read",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-12T11:00:00Z",
    publishedAt: "2025-01-10T08:00:00Z",
  },
  {
    _id: "3",
    title: "Modular Booth vs Custom Booth: Which is Right for You?",
    slug: "modular-vs-custom-booth",
    excerpt:
      "Understand the difference between modular and custom exhibition booths and make the right choice.",
    content: "Full content here...",
    category: "Booth Strategy",
    tags: ["Modular", "Custom", "Comparison"],
    image: "https://picsum.photos/800/400?modular",
    status: "draft",
    author: {
      _id: "user3",
      name: "Tanvir Hasan",
      avatar: "https://picsum.photos/50/50?author3",
    },
    views: 0,
    likes: 0,
    comments: 0,
    readTime: "5 min read",
    createdAt: "2025-01-18T15:00:00Z",
    updatedAt: "2025-01-19T09:00:00Z",
  },
  {
    _id: "4",
    title: "Sustainable Exhibition Practices for Eco-Friendly Brands",
    slug: "sustainable-exhibition-practices",
    excerpt:
      "Discover how to make your exhibition booth sustainable and environmentally friendly.",
    content: "Full content here...",
    category: "Sustainability",
    tags: ["Sustainable", "Green", "Eco-Friendly"],
    image: "https://picsum.photos/800/400?sustainable",
    status: "published",
    author: {
      _id: "user1",
      name: "Iqbal Mahmud",
      avatar: "https://picsum.photos/50/50?author1",
    },
    views: 956,
    likes: 178,
    comments: 12,
    readTime: "7 min read",
    createdAt: "2025-01-05T12:00:00Z",
    updatedAt: "2025-01-08T16:00:00Z",
    publishedAt: "2025-01-05T12:00:00Z",
  },
  {
    _id: "5",
    title: "Pre-Show Marketing Strategies to Maximize Booth Traffic",
    slug: "pre-show-marketing-strategies",
    excerpt:
      "Effective marketing tactics to drive visitors to your exhibition booth before the event begins.",
    content: "Full content here...",
    category: "Marketing",
    tags: ["Marketing", "Strategy", "Traffic"],
    image: "https://picsum.photos/800/400?marketing",
    status: "archived",
    author: {
      _id: "user2",
      name: "Fatima Ahmed",
      avatar: "https://picsum.photos/50/50?author2",
    },
    views: 3210,
    likes: 489,
    comments: 35,
    readTime: "10 min read",
    createdAt: "2024-12-20T09:00:00Z",
    updatedAt: "2025-01-02T10:00:00Z",
    publishedAt: "2024-12-20T09:00:00Z",
  },
];

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

// Delete Confirmation Modal
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

// Status Badge Component
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

// Stats Card Component
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

// Main Component
export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(sampleBlogs);
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

  // Get unique categories
  const categories = useMemo(() => {
    const cats = blogs.map((b) => b.category);
    return ["all", ...Array.from(new Set(cats))];
  }, [blogs]);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  // Stats
  const stats = useMemo(
    () => ({
      total: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      draft: blogs.filter((b) => b.status === "draft").length,
      totalViews: blogs.reduce((sum, b) => sum + b.views, 0),
    }),
    [blogs],
  );

  // Handlers
  const handleDelete = () => {
    if (!deleteModal.blog) return;
    setBlogs((prev) => prev.filter((b) => b._id !== deleteModal.blog?._id));
    setToast({ message: "Blog deleted successfully", type: "success" });
    setDeleteModal({ isOpen: false, blog: null });
  };

  const handleBulkDelete = () => {
    setBlogs((prev) => prev.filter((b) => !selectedBlogs.includes(b._id)));
    setToast({
      message: `${selectedBlogs.length} blogs deleted`,
      type: "success",
    });
    setSelectedBlogs([]);
    setSelectAll(false);
  };

  const handleDuplicate = (blog: BlogPost) => {
    const newBlog: BlogPost = {
      ...blog,
      _id: Date.now().toString(),
      title: `${blog.title} (Copy)`,
      slug: `${blog.slug}-copy`,
      status: "draft",
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined,
    };
    setBlogs((prev) => [newBlog, ...prev]);
    setToast({ message: "Blog duplicated successfully", type: "success" });
  };

  const handleStatusChange = (blogId: string, newStatus: BlogStatus) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === blogId
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
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(paginatedBlogs.map((b) => b._id));
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
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
              {paginatedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No blog posts found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-primary text-sm hover:text-primary-hover"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog) => (
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
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="text-gray-800 hover:text-primary transition-colors"
                          >
                            <p className="font-medium text-sm line-clamp-1">
                              {blog.title}
                            </p>
                          </Link>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {blog.excerpt}
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
                        {blog.author.avatar ? (
                          <Image
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-7 h-7 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {blog.author.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-700">
                          {blog.author.name}
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
                            blog._id,
                            e.target.value as BlogStatus,
                          )
                        }
                        className="text-xs border-0 bg-transparent cursor-pointer"
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
                          {blog.comments}
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
                          href={`/admin/blog/edit/${blog._id}`}
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
        {totalPages > 1 && (
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
