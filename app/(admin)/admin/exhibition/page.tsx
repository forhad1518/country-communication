"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DeleteModal from "@/components/modal/deleteModal";
import axios from "axios";
import SubmitLoading from "@/components/skeleton/SubmitLoading";
import { TableSkeleton } from "@/components/skeleton/TableSkeleton";
import slugify from "@/utils/slugify";
import uploadFiles from "@/helpers/upload.image";
import {
  Search,
  Trash2,
  Edit,
  X,
  AlertCircle,
  CheckCircle,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Package,
  Upload,
  Plus,
} from "lucide-react";

// Types
type Exhibition = {
  _id: string;
  exhibitionName: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  logo: {
    url: string;
    publicId: string;
  };
  createdAt?: string;
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
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      {message}
    </motion.div>
  );
};

// ===== DRAG & DROP IMAGE UPLOAD COMPONENT =====
const ImageUpload = ({
  label,
  value,
  onChange,
  required = false,
  error,
}: {
  label: string;
  value: { url: string; publicId: string } | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value?.url || null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value?.url) {
      setPreview(value.url);
    }
  }, [value]);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Notify parent component
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null); // Signal to delete
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {preview ? (
        <div className="relative h-40 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 group">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain p-2"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
            >
              Change
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-700">Uploading...</span>
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? "border-primary bg-primary/5"
              : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <Upload
                className={`w-8 h-8 ${error ? "text-red-400" : "text-gray-400"}`}
              />
              <p
                className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}
              >
                {isDragging ? "Drop image here" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// ===== EDIT MODAL WITH DRAG & DROP =====
const EditModal = ({
  isOpen,
  onClose,
  onSave,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  item: Exhibition | null;
}) => {
  const [formData, setFormData] = useState({
    exhibitionName: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        exhibitionName: item.exhibitionName,
        location: item.location,
        description: item.description,
        startDate: item.startDate?.split("T")[0] || "",
        endDate: item.endDate?.split("T")[0] || "",
      });
      setNewImageFile(null);
      setRemoveImage(false);
    }
  }, [item]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setNewImageFile(file);
      setRemoveImage(false);
    } else {
      setNewImageFile(null);
      setRemoveImage(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        newImageFile,
        removeImage,
        oldPublicId: item?.logo.publicId,
      };
      await onSave(data);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Exhibition
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Exhibition Name
                </label>
                <input
                  type="text"
                  value={formData.exhibitionName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      exhibitionName: e.target.value,
                    }))
                  }
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={3}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              {/* Date fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    required
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    required
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Image Upload in Edit Modal */}
              <ImageUpload
                label="Logo"
                value={removeImage ? null : item.logo}
                onChange={handleImageChange}
              />

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main Component
export default function ExhibitionPage() {
  const [loading, setLoading] = useState(true);
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const [data, setData] = useState<Exhibition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: Exhibition | null;
  }>({
    isOpen: false,
    item: null,
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: Exhibition | null;
  }>({
    isOpen: false,
    item: null,
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Add form state
  const [addFormData, setAddFormData] = useState({
    exhibitionName: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);

  const itemsPerPage = 5;

  // Fetch exhibitions
  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/exhibition");
      setData(res.data.data);
    } catch (error) {
      console.error(error);
      setToast({ message: "Error fetching exhibitions", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.exhibitionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ===== DELETE HANDLER =====
  const handleDelete = async () => {
    if (!deleteModal.item) return;

    setSkeletonLoading(true);
    try {
      // Delete exhibition from database
      await axios.delete("/api/exhibition", {
        data: { id: deleteModal.item._id },
      });

      // Delete image from server
      if (deleteModal.item.logo.publicId) {
        await axios.delete("/api/upload/image", {
          data: { publicId: deleteModal.item.logo.publicId },
        });
      }

      setData((prev) =>
        prev.filter((item) => item._id !== deleteModal.item?._id),
      );
      setToast({ message: "Exhibition deleted successfully", type: "success" });
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error(error);
      setToast({ message: "Error deleting exhibition", type: "error" });
    } finally {
      setSkeletonLoading(false);
    }
  };

  // ===== EDIT HANDLER (with image delete + upload logic) =====
  const handleEdit = async (editData: any) => {
    if (!editModal.item) return;

    const {
      exhibitionName,
      location,
      description,
      startDate,
      endDate,
      newImageFile,
      removeImage,
      oldPublicId,
    } = editData;

    let logoData = editModal.item.logo; // Keep existing by default

    try {
      // Case 1: User removed the image
      if (removeImage && oldPublicId) {
        await axios.delete("/api/upload/image", {
          data: { publicId: oldPublicId },
        });
        logoData = { url: "", publicId: "" };
      }

      // Case 2: User uploaded a new image
      if (newImageFile) {
        // First delete old image if exists
        if (oldPublicId) {
          await axios.delete("/api/upload/image", {
            data: { publicId: oldPublicId },
          });
        }

        // Upload new image
        const uploadedLogo = await uploadFiles({
          type: "single",
          files: newImageFile,
          slug: slugify(exhibitionName),
          api: "/api/upload/image",
        });

        logoData = uploadedLogo;
      }

      const updatedData = {
        id: editModal.item._id,
        exhibitionName,
        location,
        description,
        startDate,
        endDate,
        logo: logoData,
      };

      await axios.put("/api/exhibition", updatedData);
      setData((prev) =>
        prev.map((item) =>
          item._id === editModal.item?._id ? { ...item, ...updatedData } : item,
        ),
      );
      setToast({ message: "Exhibition updated successfully", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Error updating exhibition", type: "error" });
      throw error;
    }
  };

  // ===== ADD HANDLER =====
  const handleAddImageChange = (file: File | null) => {
    if (file) {
      setAddImageFile(file);
      setAddImagePreview(URL.createObjectURL(file));
    } else {
      setAddImageFile(null);
      setAddImagePreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSkeletonLoading(true);

    if (!addImageFile) {
      setToast({ message: "Please upload a logo image", type: "error" });
      setSkeletonLoading(false);
      return;
    }

    try {
      // Upload image first
      const uploadedLogo = await uploadFiles({
        type: "single",
        files: addImageFile,
        slug: slugify(addFormData.exhibitionName),
        api: "/api/upload/image",
      });

      const newData = {
        exhibitionName: addFormData.exhibitionName,
        location: addFormData.location,
        description: addFormData.description,
        startDate: addFormData.startDate,
        endDate: addFormData.endDate,
        logo: uploadedLogo,
      };

      const response = await axios.post("/api/exhibition", newData);
      setData((prev) => [...prev, response.data.data]);

      // Reset form
      setAddFormData({
        exhibitionName: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      setAddImageFile(null);
      setAddImagePreview(null);
      setShowForm(false);
      setToast({ message: "Exhibition added successfully", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Error adding exhibition", type: "error" });
    } finally {
      setSkeletonLoading(false);
    }
  };

  // Helper to format date (YYYY-MM-DD → readable)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

      {/* Modals */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        itemTitle={deleteModal.item?.exhibitionName || ""}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null })}
        onSave={handleEdit}
        item={editModal.item}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-700">Exhibitions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage exhibition events</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 shadow-md shadow-primary/20"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel" : "Add Exhibition"}
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-5 text-gray-700 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Add New Exhibition
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Exhibition Name"
                  required
                  value={addFormData.exhibitionName}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      exhibitionName: e.target.value,
                    }))
                  }
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />

                <input
                  type="text"
                  placeholder="Location"
                  required
                  value={addFormData.location}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />

                {/* Date inputs */}
                <input
                  type="date"
                  placeholder="Start Date"
                  required
                  value={addFormData.startDate}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  required
                  value={addFormData.endDate}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />

                <input
                  type="text"
                  placeholder="Description"
                  required
                  value={addFormData.description}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none md:col-span-2"
                />

                {/* Image Upload in Add Form */}
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Upload Logo"
                    value={
                      addImagePreview
                        ? { url: addImagePreview, publicId: "" }
                        : null
                    }
                    onChange={handleAddImageChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition"
                >
                  Add Exhibition
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State for Form Submission */}
      {skeletonLoading && <SubmitLoading />}

      {/* Table */}
      <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <h2 className="text-lg font-semibold text-gray-700">
            All Exhibitions
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exhibitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border p-4 rounded-lg animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded" />
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
              <p className="text-gray-500">No exhibitions found</p>
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
                className="border p-4 rounded-lg"
              >
                <div className="flex gap-3 items-center">
                  <Image
                    src={item.logo.url}
                    alt={item.exhibitionName}
                    width={60}
                    height={60}
                    className="rounded object-cover bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.exhibitionName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.startDate)} → {formatDate(item.endDate)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={() => setEditModal({ isOpen: true, item })}
                    className="px-3 py-1.5 bg-accent text-white rounded text-sm hover:bg-accent/90 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, item })}
                    className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <TableSkeleton />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 border-b text-sm">
                  <th className="py-3 w-12">#</th>
                  <th className="w-24">Image</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No exhibitions found</p>
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
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 text-gray-500">
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>
                      <td>
                        <Image
                          src={item.logo.url}
                          alt={item.exhibitionName}
                          width={60}
                          height={40}
                          className="rounded object-cover bg-gray-100"
                        />
                      </td>
                      <td className="font-medium">{item.exhibitionName}</td>
                      <td className="text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {item.location}
                        </span>
                      </td>
                      <td className="text-gray-600 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(item.startDate)} →{" "}
                          {formatDate(item.endDate)}
                        </span>
                      </td>
                      <td className="text-gray-600 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditModal({ isOpen: true, item })}
                            className="p-1.5 text-accent hover:bg-accent/10 rounded transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, item })
                            }
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
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
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
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
