"use client";

import { ChangeEvent, FormEvent, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
    Plus
} from "lucide-react";

// Types
type Exhibition = {
    _id: string;
    exhibitionName: string;
    location: string;
    description: string;
    logo: string;
    createdAt?: string;
};

// Delete Confirmation Modal
const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
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
                                Are you sure you want to delete <span className="font-semibold">"{itemName}"</span>?
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
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${type === "success" ? "bg-green-500" : "bg-red-500"
                } text-white`}
        >
            {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message}
        </motion.div>
    );
};

// Edit Modal
const EditModal = ({
    isOpen,
    onClose,
    onSave,
    item
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    item: Exhibition | null;
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setPreview(item.logo);
        }
    }, [item]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            await onSave(formData);
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
                            <h3 className="text-lg font-semibold text-gray-800">Edit Exhibition</h3>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Exhibition Name</label>
                                <input
                                    type="text"
                                    name="exhibiton_name"
                                    defaultValue={item.exhibitionName}
                                    required
                                    className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    defaultValue={item.location}
                                    required
                                    className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={item.description}
                                    required
                                    rows={3}
                                    className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="logo"
                                    onChange={handleImageChange}
                                    className="mt-1 w-full border p-2 rounded-lg"
                                />
                                {preview && (
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={100}
                                        height={80}
                                        className="mt-2 rounded object-cover"
                                    />
                                )}
                            </div>

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
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
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
    const [preview, setPreview] = useState<string | null>(null);
    const [data, setData] = useState<Exhibition[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: Exhibition | null }>({
        isOpen: false,
        item: null
    });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; item: Exhibition | null }>({
        isOpen: false,
        item: null
    });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [showForm, setShowForm] = useState(false);

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
        return data.filter(item =>
            item.exhibitionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Delete handler
    const handleDelete = async () => {
        if (!deleteModal.item) return;

        setSkeletonLoading(true);
        try {
            await axios.delete("/api/exhibition", { data: { id: deleteModal.item._id } });
            setData(prev => prev.filter(item => item._id !== deleteModal.item?._id));
            setToast({ message: "Exhibition deleted successfully", type: "success" });
            setDeleteModal({ isOpen: false, item: null });
        } catch (error) {
            console.error(error);
            setToast({ message: "Error deleting exhibition", type: "error" });
        } finally {
            setSkeletonLoading(false);
        }
    };

    // Edit handler
    const handleEdit = async (formData: FormData) => {
        if (!editModal.item) return;

        const exhibitionName = formData.get("exhibiton_name")?.toString() ?? "";
        const location = formData.get("location")?.toString() ?? "";
        const description = formData.get("description")?.toString() ?? "";
        const file = formData.get("logo") as File | null;

        let logoUrl = editModal.item.logo;

        if (file && file.size > 0) {
            logoUrl = await uploadFiles({
                type: "single",
                files: file,
                slug: slugify(exhibitionName),
                api: "/api/upload/image",
            });
        }

        const updatedData = {
            id: editModal.item._id,
            exhibitionName,
            location,
            description,
            logo: logoUrl,
        };

        await axios.put("/api/exhibition", updatedData);
        setData(prev => prev.map(item =>
            item._id === editModal.item?._id ? { ...item, ...updatedData } : item
        ));
        setToast({ message: "Exhibition updated successfully", type: "success" });
    };

    // Preview image
    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // Submit handler
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSkeletonLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const exhibitionName = formData.get("exhibiton_name")?.toString() ?? "";
        const location = formData.get("location")?.toString() ?? "";
        const description = formData.get("description")?.toString() ?? "";
        const file = formData.get("logo") as File | null;

        if (!file) {
            setToast({ message: "Please upload an image", type: "error" });
            setSkeletonLoading(false);
            return;
        }

        try {
            const imageUrl = await uploadFiles({
                type: "single",
                files: file,
                slug: slugify(exhibitionName),
                api: "/api/upload/image",
            });

            const newData = {
                exhibitionName,
                location,
                description,
                logo: imageUrl,
            };

            const response = await axios.post("/api/exhibition", newData);
            setData(prev => [...prev, response.data.data]);
            setPreview(null);
            form.reset();
            setShowForm(false);
            setToast({ message: "Exhibition added successfully", type: "success" });
        } catch (error) {
            console.error(error);
            setToast({ message: "Error adding exhibition", type: "error" });
        } finally {
            setSkeletonLoading(false);
        }
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
                itemName={deleteModal.item?.exhibitionName || ""}
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

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Exhibition Name"
                                    required
                                    name="exhibiton_name"
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />

                                <input
                                    type="text"
                                    placeholder="Location"
                                    required
                                    name="location"
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />

                                <input
                                    type="text"
                                    placeholder="Description"
                                    required
                                    name="description"
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-600">Upload Logo</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            name="logo"
                                            onChange={handleImage}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-3 rounded-lg cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <Upload className="w-5 h-5 text-gray-400" />
                                            <span className="text-sm text-gray-600">Choose file</span>
                                        </label>
                                    </div>
                                    {preview && (
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            width={100}
                                            height={80}
                                            className="rounded object-cover"
                                        />
                                    )}
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
                    <h2 className="text-lg font-semibold text-gray-700">All Exhibitions</h2>

                    {/* Search */}
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
                                        src={item.logo}
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
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
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
                                    <th>Description</th>
                                    <th className="text-center w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center">
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
                                        <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 text-gray-500">
                                                {(currentPage - 1) * itemsPerPage + i + 1}
                                            </td>
                                            <td>
                                                <Image
                                                    src={item.logo}
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
                                            <td className="text-gray-600 max-w-xs truncate">{item.description}</td>
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
                                                        onClick={() => setDeleteModal({ isOpen: true, item })}
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
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
                            ))}
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