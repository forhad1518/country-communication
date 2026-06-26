// app/admin/our_clients/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Copy,
  FileSpreadsheet,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import slugify from "@/utils/slugify";
import uploadFiles from "@/helpers/upload.image";

// Types
interface Client {
  _id: string;
  companyName: string;
  companyLogo: string;
  clientName: string;
  clientEmail: string;
  createdAt?: string;
  updatedAt?: string;
}

const ITEMS_PER_PAGE: number = 5;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Client>>({});
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editError, setEditError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/Our-Client/admin");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch clients");
      }
      const data = await res.json();
      // Assuming response has data array
      setClients(data.data || data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search
  const filteredClients: Client[] = clients.filter(
    (client) =>
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages: number = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex: number = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex: number = startIndex + ITEMS_PER_PAGE;
  const currentClients: Client[] = filteredClients.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Copy single email
  const copySingleEmail = (email: string): void => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Copy all emails
  const copyAllEmails = (): void => {
    const allEmails: string = clients
      .map((client) => client.clientEmail)
      .join(", ");
    navigator.clipboard.writeText(allEmails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download as Excel (CSV)
  const downloadExcel = (): void => {
    const headers: string[] = [
      "Serial",
      "Company Name",
      "Client Name",
      "Client Email",
    ];
    const rows: string[][] = clients.map((client, index) => [
      String(index + 1),
      client.companyName,
      client.clientName,
      client.clientEmail,
    ]);

    let csvContent: string = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob: Blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link: HTMLAnchorElement = document.createElement("a");
    const url: string = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "clients_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ----- DELETE -----
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`/api/Our-Client/admin/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      // Refresh list
      await fetchClients();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ----- EDIT -----
  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setEditFormData({
      companyName: client.companyName,
      companyLogo: client.companyLogo,
      clientName: client.clientName,
      clientEmail: client.clientEmail,
    });
    setEditImagePreview(client.companyLogo);
    setEditImageFile(null);
    setEditError("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingClient(null);
    setEditFormData({});
    setEditImagePreview("");
    setEditImageFile(null);
    setEditError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setEditError("Please select a valid image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setEditError("Image size must be less than 5MB");
        return;
      }
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
      setEditError("");
    }
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview(editingClient?.companyLogo || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setEditLoading(true);
    setEditError("");

    const { companyName, clientName, clientEmail, companyLogo } = editFormData;
    if (!companyName || !clientName || !clientEmail) {
      setEditError("All fields are required");
      setEditLoading(false);
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(clientEmail)) {
      setEditError("Invalid email format");
      setEditLoading(false);
      return;
    }

    try {
      let logoUrl = companyLogo;

      // If a new image was uploaded, upload it first
      if (editImageFile) {
        const uploadResult = await uploadFiles({
          type: "single",
          files: editImageFile,
          slug: slugify(companyName || "client"),
          api: "/api/upload/image",
        });
        logoUrl = uploadResult?.data?.url || uploadResult?.url;
        if (!logoUrl) {
          throw new Error("Image upload failed");
        }
      }

      const payload = {
        companyName,
        companyLogo: logoUrl,
        clientName,
        clientEmail,
      };

      const res = await fetch(`/api/Our-Client/admin/${editingClient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      // Refresh list
      await fetchClients();
      closeEditModal();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-4 md:py-6 bg-white">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6"
        >
          <Link
            href="/admin/our_clients/add"
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-primary hover:bg-primary-hover text-white text-xs md:text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Add Client</span>
          </Link>

          <button
            onClick={copyAllEmails}
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs md:text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
          >
            <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Copy All Emails</span>
            {copiedAll && (
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
            )}
          </button>

          <button
            onClick={downloadExcel}
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs md:text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Sheet List</span>
          </button>

          {/* Search Bar */}
          <div className="ml-auto w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full sm:w-44 md:w-52 pl-8 pr-3 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-150">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Serial
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client Email
                  </th>
                  <th className="px-3 md:px-5 py-2.5 md:py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentClients.length > 0 ? (
                  currentClients.map((client: Client, index: number) => (
                    <motion.tr
                      key={client._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 md:px-5 py-3 md:py-4 text-sm text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-7 h-7 md:w-9 md:h-9 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                            <Image
                              src={client.companyLogo}
                              alt={client.companyName}
                              width={36}
                              height={36}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <span className="text-sm md:text-base text-gray-800 font-medium">
                            {client.companyName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4 text-sm md:text-base text-gray-700">
                        {client.clientName}
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <span className="text-sm md:text-base text-gray-700">
                            {client.clientEmail}
                          </span>
                          <button
                            onClick={() => copySingleEmail(client.clientEmail)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy email"
                          >
                            {copiedEmail === client.clientEmail ? (
                              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(client)}
                            className="inline-flex items-center gap-1 text-primary hover:text-primary-hover text-sm font-medium transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 md:px-5 py-8 text-center text-gray-500"
                    >
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="text-sm text-gray-500 order-2 sm:order-1">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredClients.length)} of{" "}
              {filteredClients.length} clients
            </div>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: totalPages }, (_, i: number) => i + 1).map(
                (page: number) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-8 h-8 md:min-w-9 md:h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex justify-end text-xs text-gray-400"
        >
          <span>Total Clients: {clients.length}</span>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Edit Client
              </h2>
              <button
                onClick={closeEditModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                ❌ {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={editFormData.companyName || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    {editImagePreview ? (
                      <Image
                        src={editImagePreview}
                        alt="Logo preview"
                        width={64}
                        height={64}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                      id="edit-logo-upload"
                    />
                    <label
                      htmlFor="edit-logo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Change Image</span>
                    </label>
                    {editImageFile && (
                      <button
                        type="button"
                        onClick={removeEditImage}
                        className="ml-2 text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, SVG (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={editFormData.clientName || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={editFormData.clientEmail || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
