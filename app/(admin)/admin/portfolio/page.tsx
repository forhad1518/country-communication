"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Package
} from "lucide-react";

export interface PortfolioItem {
  _id: string;
  designImage: string;
  title: string;
  exhibition_name: string;
  slug: string;
  projectInfo?: {
    clientName?: string;
    boothSize?: string;
    location?: string;
  };
}

// Delete Confirmation Modal
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
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
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">"{itemTitle}"</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Toast Notification
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
    >
      {message}
    </motion.div>
  );
};

// Skeleton Loader
const TableSkeleton = () => {
  return (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100">
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
};

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: PortfolioItem | null }>({
    isOpen: false,
    item: null
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const itemsPerPage = 10;

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/portfolio");
      setData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
      setToast({ message: "Failed to load portfolio data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!deleteModal.item) return;

    try {
      await axios.delete(`/api/portfolio/${deleteModal.item._id}`);
      setData(data.filter(item => item._id !== deleteModal.item?._id));
      setToast({ message: "Portfolio item deleted successfully", type: "success" });
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      console.error("Error deleting portfolio item:", err);
      setToast({ message: "Failed to delete portfolio item", type: "error" });
    }
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exhibition_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectInfo?.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        itemTitle={deleteModal.item?.title || ""}
      />

      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-700">
            All Portfolio
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your exhibition portfolio items
          </p>
        </div>

        <Link
          href="/admin/portfolio/add"
          className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-md shadow-primary/20"
        >
          <span className="text-lg">+</span> Add Portfolio
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title, exhibition, or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* TABLE / CARD */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">

        {/* Stats */}
        {!loading && filteredData.length > 0 && (
          <div className="mb-4 text-sm text-gray-500">
            Showing {paginatedData.length} of {filteredData.length} items
          </div>
        )}

        {/* MOBILE VIEW */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border p-4 rounded-lg animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-20 h-16 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No portfolio items found</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-primary hover:text-primary-hover text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            paginatedData.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3">
                  <Image
                    src={item.designImage}
                    alt={item.title}
                    width={80}
                    height={60}
                    className="rounded object-cover bg-gray-100"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.exhibition_name}</p>
                    {item.projectInfo?.boothSize && (
                      <p className="text-xs text-gray-400 mt-1">
                        {item.projectInfo.boothSize} sqm
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    {item.projectInfo?.clientName || "—"}
                  </span>

                  <div className="space-x-1">
                    <Link
                      href={`/portfolio/${item.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2 py-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/portfolio/edit/${item._id}`}
                      className="inline-flex items-center gap-1 px-2 py-1.5 text-accent hover:bg-accent/10 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, item })}
                      className="inline-flex items-center gap-1 px-2 py-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="py-3 px-2 w-12">#</th>
                <th className="py-3 px-2 w-24">Image</th>
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Exhibition</th>
                <th className="py-3 px-2">Client</th>
                <th className="py-3 px-2 w-32">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8">
                    <TableSkeleton />
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No portfolio items found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-primary hover:text-primary-hover text-sm"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, i) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-2 text-gray-500">
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>

                    <td className="py-3 px-2">
                      <Image
                        src={item.designImage}
                        alt={item.title}
                        width={60}
                        height={45}
                        className="rounded object-cover bg-gray-100"
                      />
                    </td>

                    <td className="py-3 px-2 font-medium text-gray-800">
                      {item.title}
                      {item.projectInfo?.boothSize && (
                        <span className="ml-2 text-xs text-gray-400 font-normal">
                          {item.projectInfo.boothSize} sqm
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-gray-600">
                      {item.exhibition_name}
                      {item.projectInfo?.location && (
                        <span className="block text-xs text-gray-400">
                          {item.projectInfo.location}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-gray-600">
                      {item.projectInfo?.clientName || "—"}
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/portfolio/${item.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/portfolio/edit/${item._id}`}
                          className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, item })}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
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
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}