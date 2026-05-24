"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import DeleteModal from "@/components/modal/deleteModal";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Filter,
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Clock,
  Heart,
} from "lucide-react";

// Types (matching API response)
type ImageItem = {
  url: string;
  publicId: string;
  _id?: string;
};

type PortfolioItem = {
  _id: string;
  title: string;
  exhibition_name: string;
  slug: string;
  status?: "draft" | "published";
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
  results?: {
    clientImage?: ImageItem;
  };
  views?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
};

// Toast Notification
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

// Skeleton Loader
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

// Status Badge
const StatusBadge = ({ status }: { status?: string }) => {
  const currentStatus = status || "published";
  const styles: any = {
    published: "bg-green-50 text-green-700 border-green-200",
    draft: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  const icons: any = { published: Globe, draft: Lock };
  const Icon = icons[currentStatus] || Globe;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[currentStatus] || styles.published}`}
    >
      <Icon className="w-3 h-3" />
      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
    </span>
  );
};

// Stats Card
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

// Get first image for thumbnail
const getThumbnail = (item: PortfolioItem): string => {
  if (item.process?.rendersImages?.[0]?.url)
    return item.process.rendersImages[0].url;
  if (item.process?.realImages?.[0]?.url) return item.process.realImages[0].url;
  if (item.results?.clientImage?.url) return item.results.clientImage.url;
  return "";
};

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: PortfolioItem | null;
  }>({ isOpen: false, item: null });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // ===== VIEWS & LIKES STATE =====
  const [statsView, setStatsView] = useState<"views" | "likes">("views");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/portfolio?admin=true&status=all");
      setData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setToast({ message: "Failed to load portfolio data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      await axios.delete(`/api/portfolio/${deleteModal.item._id}`);
      setData((prev) =>
        prev.filter((item) => item._id !== deleteModal.item?._id),
      );
      setToast({ message: "Deleted successfully", type: "success" });
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedItems) {
        await axios.delete(`/api/portfolio/${id}`);
      }
      setData((prev) =>
        prev.filter((item) => !selectedItems.includes(item._id)),
      );
      setToast({
        message: `${selectedItems.length} items deleted`,
        type: "success",
      });
      setSelectedItems([]);
      setSelectAll(false);
    } catch (err) {
      setToast({ message: "Failed to delete some items", type: "error" });
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await axios.put(`/api/portfolio/${itemId}`, { status: newStatus });
      setData((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, status: newStatus as PortfolioItem["status"] }
            : item,
        ),
      );
      setToast({ message: "Status updated", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.exhibition_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectInfo?.clientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.projectInfo?.location
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      published: data.filter((b) => b.status === "published").length,
      draft: data.filter((b) => b.status === "draft").length,
      totalViews: data.reduce((sum, b) => sum + (b.views || 0), 0),
      totalLikes: data.reduce((sum, b) => sum + (b.likes || 0), 0),
    }),
    [data],
  );

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map((b) => b._id));
    }
    setSelectAll(!selectAll);
  };
  const toggleSelect = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        itemTitle={deleteModal.item?.title || ""}
      />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Portfolio Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your exhibition portfolio items
          </p>
        </div>
        <Link href="/admin/portfolio/add">
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 text-sm shadow-md shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Portfolio
          </button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          label="Total Items"
          value={stats.total}
          icon={Package}
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
          icon={Eye}
          color="bg-cyan-50 text-cyan-600"
        />
        <StatsCard
          label="Total Likes"
          value={stats.totalLikes}
          icon={Heart}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, exhibition, client..."
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
              <Filter className="w-4 h-4" /> Filters{" "}
              {statusFilter !== "all" && (
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
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                {statusFilter !== "all" && (
                  <button
                    onClick={() => setStatusFilter("all")}
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

      {/* BULK ACTIONS */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between"
        >
          <span className="text-sm text-gray-700">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
            selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Selected
          </button>
        </motion.div>
      )}

      {/* TABLE */}
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
                  Portfolio
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  Client
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Booth Size
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Status
                </th>

                {/* ===== VIEWS & LIKES COLUMN ===== */}
                <th
                  className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden xl:table-cell cursor-pointer"
                  onClick={() =>
                    setStatsView(statsView === "views" ? "likes" : "views")
                  }
                >
                  <div className="flex items-center gap-1">
                    {statsView === "views" ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Views
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5" /> Likes
                      </>
                    )}
                    <span className="text-gray-400">↔</span>
                  </div>
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
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No portfolio items found</p>
                    {(searchTerm || statusFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
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
                paginatedData.map((item, i) => {
                  const thumbnail = getThumbnail(item);
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition group"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleSelect(item._id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            {thumbnail ? (
                              <Image
                                src={thumbnail}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/portfolio/${item.slug}`}
                              target="_blank"
                              className="text-gray-800 hover:text-primary transition-colors"
                            >
                              <p className="font-medium text-sm line-clamp-1">
                                {item.title}
                              </p>
                            </Link>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {item.exhibition_name}
                            </p>
                            {item.projectInfo?.location && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {item.projectInfo.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-gray-700">
                          {item.projectInfo?.clientName || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          {item.projectInfo?.boothSize || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <select
                          value={item.status || "published"}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value)
                          }
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white cursor-pointer"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </td>

                      {/* ===== VIEWS OR LIKES VALUE ===== */}
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <div className="flex items-center gap-1 text-sm">
                          {statsView === "views" ? (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-medium">
                                {(item.views || 0).toLocaleString()}
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              <span className="font-medium">
                                {(item.likes || 0).toLocaleString()}
                              </span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 hidden xl:table-cell">
                        <div className="text-sm text-gray-500">
                          <p className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/portfolio/${item.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded transition"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/portfolio/edit/${item.slug}`}
                            className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/5 rounded transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, item })
                            }
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} items
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
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-medium transition ${currentPage === pageNum ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}
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
