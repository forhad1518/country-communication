"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  Trash2,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
  Mail,
  Phone,
  Building2,
  MapPin,
  FileText,
  Filter,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Layers,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Tag,
  Sparkles,
} from "lucide-react";
import DeleteModal from "@/components/modal/deleteModal";

// Types matching Quote schema
type QuoteItem = {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  exhibitionName: string;
  stallNumber?: string;
  boothSize: string;
  boothType?: string;
  budget?: string;
  services: string[];
  eventDate?: string;
  message?: string;
  attachment?: {
    url: string;
    publicId: string;
  };
  status: "pending" | "reviewed" | "contacted" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

// Toast notification
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
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium ${
        type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span>{message}</span>
    </motion.div>
  );
};

// Status badge styling helper
const getStatusBadge = (status: QuoteItem["status"]) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        bg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
      };
    case "reviewed":
      return {
        label: "Reviewed",
        bg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        dot: "bg-blue-500",
      };
    case "contacted":
      return {
        label: "Contacted",
        bg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        dot: "bg-purple-500",
      };
    case "completed":
      return {
        label: "Completed",
        bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        dot: "bg-emerald-500",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        dot: "bg-gray-400",
      };
    default:
      return {
        label: status,
        bg: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        dot: "bg-gray-400",
      };
  }
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    quote: QuoteItem | null;
  }>({ isOpen: false, quote: null });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Fetch quotes from API
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/quote");
      setQuotes(res.data.data || []);
    } catch (err) {
      console.error("Error loading quotes:", err);
      setToast({ message: "Failed to load quote requests", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Update status
  const handleUpdateStatus = async (id: string, newStatus: QuoteItem["status"]) => {
    try {
      setUpdatingStatusId(id);
      const res = await axios.put(`/api/quote/${id}`, { status: newStatus });
      if (res.data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
        );
        if (selectedQuote && selectedQuote._id === id) {
          setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setToast({ message: `Status updated to ${newStatus}`, type: "success" });
      }
    } catch (err) {
      console.error("Failed to update quote status:", err);
      setToast({ message: "Could not update status", type: "error" });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Delete quote
  const handleDeleteQuote = async () => {
    if (!deleteModal.quote) return;
    try {
      const res = await axios.delete(`/api/quote/${deleteModal.quote._id}`);
      if (res.data.success) {
        setQuotes((prev) => prev.filter((q) => q._id !== deleteModal.quote?._id));
        setToast({ message: "Quote inquiry deleted", type: "success" });
        if (selectedQuote?._id === deleteModal.quote._id) {
          setSelectedQuote(null);
        }
      }
    } catch (err) {
      console.error("Error deleting quote:", err);
      setToast({ message: "Failed to delete quote", type: "error" });
    } finally {
      setDeleteModal({ isOpen: false, quote: null });
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = quotes.length;
    const pending = quotes.filter((q) => q.status === "pending").length;
    const inProgress = quotes.filter(
      (q) => q.status === "reviewed" || q.status === "contacted"
    ).length;
    const completed = quotes.filter((q) => q.status === "completed").length;
    return { total, pending, inProgress, completed };
  }, [quotes]);

  // Filtering
  const filteredQuotes = useMemo(() => {
    return quotes.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        item.exhibitionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.boothSize.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quotes & Inquiries</h1>
          <p className="text-sm text-gray-500">
            View, review, and contact incoming exhibition booth leads and requests.
          </p>
        </div>
        <button
          onClick={fetchQuotes}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Inquiries
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <span className="text-xs text-gray-400">All received quotes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Review
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">{stats.pending}</p>
          <span className="text-xs text-amber-600 font-medium">Action needed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs bg-purple-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              In Discussion
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-2">{stats.inProgress}</p>
          <span className="text-xs text-purple-600 font-medium">Reviewed / Contacted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Completed Deals
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-900 mt-2">{stats.completed}</p>
          <span className="text-xs text-emerald-600 font-medium">Confirmed projects</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client, company, exhibition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "reviewed", label: "Reviewed" },
            { id: "contacted", label: "Contacted" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 px-4">Client & Company</th>
                <th className="py-3.5 px-4">Exhibition & Booth</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Budget & Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="h-6 bg-gray-100 rounded-md w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-600">No quote requests found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {searchTerm ? "Try clearing your search keyword." : "New leads from the quote form will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedQuotes.map((quote) => {
                  const badge = getStatusBadge(quote.status);
                  const formattedDate = new Date(quote.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={quote._id} className="hover:bg-gray-50/70 transition">
                      {/* Client Name & Company */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-red-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                            {quote.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{quote.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                              <Building2 className="w-3 h-3 text-gray-400" />
                              {quote.companyName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Exhibition & Booth */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-800 line-clamp-1">{quote.exhibitionName}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-medium text-primary">{quote.boothSize}</span>
                          <span>•</span>
                          <span className="text-gray-400 line-clamp-1">{quote.boothType}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <a
                          href={`mailto:${quote.email}`}
                          className="text-xs text-gray-700 hover:text-primary font-medium flex items-center gap-1.5 transition"
                        >
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="line-clamp-1">{quote.email}</span>
                        </a>
                        <a
                          href={`tel:${quote.phone.replace(/\s/g, "")}`}
                          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1.5 mt-1 transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{quote.phone}</span>
                        </a>
                      </td>

                      {/* Budget & Date */}
                      <td className="py-4 px-4">
                        {quote.budget ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {quote.budget}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not set</span>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </p>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={quote.status}
                          disabled={updatingStatusId === quote._id}
                          onChange={(e) =>
                            handleUpdateStatus(quote._id, e.target.value as QuoteItem["status"])
                          }
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none transition cursor-pointer ${badge.bg}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-primary rounded-lg transition cursor-pointer"
                            title="View full quote details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* WhatsApp Chat */}
                          <a
                            href={`https://wa.me/${quote.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, quote })}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                            title="Delete inquiry"
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} quotes
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 font-bold text-gray-800">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Details Modal */}
      <AnimatePresence>
        {selectedQuote && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
              onClick={() => setSelectedQuote(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-gray-200"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    Exhibition Booth Inquiry
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-0.5">{selectedQuote.companyName}</h2>
                  <p className="text-xs text-gray-500">Contact Person: {selectedQuote.name}</p>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fast Actions Banner */}
              <div className="my-5 p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Current Status:</span>
                  <select
                    value={selectedQuote.status}
                    disabled={updatingStatusId === selectedQuote._id}
                    onChange={(e) =>
                      handleUpdateStatus(selectedQuote._id, e.target.value as QuoteItem["status"])
                    }
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border bg-white shadow-xs focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="pending">⏳ Pending Review</option>
                    <option value="reviewed">👀 Reviewed</option>
                    <option value="contacted">💬 Contacted Client</option>
                    <option value="completed">🏆 Completed / Won Deal</option>
                    <option value="cancelled">✖ Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedQuote.email}?subject=Re:%20Exhibition%20Booth%20Quote%20-%20${encodeURIComponent(selectedQuote.exhibitionName)}`}
                    className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Reply Email
                  </a>
                  <a
                    href={`https://wa.me/${selectedQuote.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#20bd5a] transition flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="space-y-6 text-sm">
                {/* Section 1: Client & Contact */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Client & Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">Email Address:</span>
                      <a
                        href={`mailto:${selectedQuote.email}`}
                        className="font-medium text-gray-800 hover:text-primary"
                      >
                        {selectedQuote.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Phone / WhatsApp:</span>
                      <a
                        href={`tel:${selectedQuote.phone}`}
                        className="font-medium text-gray-800 hover:text-primary"
                      >
                        {selectedQuote.phone}
                      </a>
                    </div>
                    {(selectedQuote.city || selectedQuote.country) && (
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500 block">Location:</span>
                        <span className="font-medium text-gray-800">
                          {[selectedQuote.city, selectedQuote.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Exhibition & Booth */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Exhibition & Booth Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">Exhibition / Expo:</span>
                      <span className="font-bold text-gray-900 text-base">{selectedQuote.exhibitionName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Booth Size:</span>
                      <span className="font-bold text-primary text-base">{selectedQuote.boothSize}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Booth Type / Sides:</span>
                      <span className="font-medium text-gray-800">{selectedQuote.boothType || "Standard"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Stall / Booth #:</span>
                      <span className="font-medium text-gray-800">
                        {selectedQuote.stallNumber || "Not assigned yet"}
                      </span>
                    </div>
                    {selectedQuote.budget && (
                      <div>
                        <span className="text-xs text-gray-500 block">Budget:</span>
                        <span className="font-bold text-emerald-700">{selectedQuote.budget}</span>
                      </div>
                    )}
                    {selectedQuote.eventDate && (
                      <div>
                        <span className="text-xs text-gray-500 block">Event Setup Date:</span>
                        <span className="font-medium text-gray-800">{selectedQuote.eventDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Services Requested */}
                {selectedQuote.services && selectedQuote.services.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Required Services ({selectedQuote.services.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuote.services.map((service) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-red-50 text-primary border border-red-200 text-xs font-semibold rounded-full flex items-center gap-1.5"
                        >
                          <span>✓</span>
                          <span>{service}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: Client Message */}
                {selectedQuote.message && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Client Message & Notes
                    </h3>
                    <div className="p-4 bg-amber-50/40 border border-amber-200/80 rounded-xl text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedQuote.message}
                    </div>
                  </div>
                )}

                {/* Section 5: Attachment Reference */}
                {selectedQuote.attachment?.url && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Attached Layout / Drawing
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <ExternalLink className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800">Client Reference File Attached</p>
                        <a
                          href={selectedQuote.attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Open / Download Attachment File →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, quote: null })}
        onConfirm={handleDeleteQuote}
        itemTitle={`${deleteModal.quote?.companyName} (${deleteModal.quote?.name})`}
      />
    </div>
  );
}
