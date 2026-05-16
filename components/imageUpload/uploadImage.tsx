"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import {
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

// Types
export type UploadedImage = {
  url: string;
  publicId: string;
  previewUrl?: string; // Local preview URL
};

export type ImageUploadProps = {
  // Core props
  mode: "single" | "multiple";
  maxFiles?: number;
  accept?: string;

  // Existing images (for edit mode)
  existingImages?: UploadedImage[];

  // Callbacks
  onChange?: (images: UploadedImage[]) => void;
  onUploadStart?: () => void;
  onUploadComplete?: (images: UploadedImage[]) => void;
  onError?: (error: string) => void;
  onRemove?: (publicId: string) => void;

  // UI props
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  maxFileSize?: number; // in MB

  // Upload API
  uploadApi?: string; // default: "/api/upload/image"
  deleteApi?: string; // default: "/api/upload/image"
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
  setTimeout(onClose, 3000);
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

// Helper: Upload single file
const uploadSingleFile = async (
  file: File,
  api: string,
): Promise<UploadedImage> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(api, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Expected response: { url: string, publicId: string }
  const data = response.data;
  return {
    url: data.url || data.imageUrl || "",
    publicId: data.publicId || data.public_id || "",
  };
};

// Helper: Delete image by publicId
const deleteImage = async (publicId: string, api: string): Promise<void> => {
  await axios.delete(api, {
    data: { publicId },
  });
};


export default function ImageUpload({
  mode = "single",
  maxFiles = 10,
  accept = "image/*",
  existingImages = [],
  onChange,
  onUploadStart,
  onUploadComplete,
  onError,
  onRemove,
  label = "Upload Images",
  required = false,
  error,
  className = "",
  maxFileSize = 10, // 10MB default
  uploadApi = "/api/upload/image",
  deleteApi = "/api/upload/image",
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external images
  useState(() => {
    if (existingImages && existingImages.length > 0) {
      setImages(existingImages);
    }
  });

  // Notify parent of changes
  const notifyChange = useCallback(
    (updatedImages: UploadedImage[]) => {
      setImages(updatedImages);
      onChange?.(updatedImages);
    },
    [onChange],
  );

  // Validate file
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      onError?.("Only image files are allowed");
      setToast({ message: "Only image files are allowed", type: "error" });
      return false;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      const errorMsg = `File size should be less than ${maxFileSize}MB`;
      onError?.(errorMsg);
      setToast({ message: errorMsg, type: "error" });
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Filter valid files
    const validFiles = fileArray.filter(validateFile);
    if (validFiles.length === 0) return;

    // Check max files limit
    if (mode === "multiple" && images.length + validFiles.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} images allowed`;
      onError?.(errorMsg);
      setToast({ message: errorMsg, type: "error" });
      return;
    }

    // Start upload
    setUploading(true);
    onUploadStart?.();

    const newImages: UploadedImage[] = [];
    let hasError = false;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];

      // Create preview immediately
      const previewUrl = URL.createObjectURL(file);
      const tempImage: UploadedImage = {
        url: "",
        publicId: "",
        previewUrl,
      };

      if (mode === "single") {
        // For single mode, replace existing
        setImages([tempImage]);
        notifyChange([tempImage]);
      } else {
        // For multiple mode, add to array
        setImages((prev) => [...prev, tempImage]);
        notifyChange([...images, tempImage]);
      }

      try {
        // Upload to server
        const uploaded = await uploadSingleFile(file, uploadApi);
        newImages.push({
          ...uploaded,
          previewUrl,
        });

        // Update progress
        setUploadProgress(((i + 1) / validFiles.length) * 100);
      } catch (err: any) {
        console.error("Upload error:", err);
        hasError = true;
        onError?.(err.message || "Failed to upload image");
        setToast({
          message: `Failed to upload: ${file.name}`,
          type: "error",
        });
      }
    }

    // Update final state
    let finalImages: UploadedImage[];
    if (mode === "single") {
      finalImages = newImages.length > 0 ? [newImages[0]] : [];
    } else {
      finalImages = [...images.filter((img) => img.url), ...newImages];
    }

    setImages(finalImages);
    notifyChange(finalImages);
    setUploading(false);
    setUploadProgress(0);
    onUploadComplete?.(finalImages);

    if (!hasError && newImages.length > 0) {
      setToast({
        message: `${newImages.length} image(s) uploaded successfully!`,
        type: "success",
      });
    }

    // Clear input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Remove image
  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];

    // If image has publicId, delete from server
    if (imageToRemove.publicId) {
      setDeletingId(imageToRemove.publicId);
      try {
        await deleteImage(imageToRemove.publicId, deleteApi);
        onRemove?.(imageToRemove.publicId);
        setToast({ message: "Image removed successfully", type: "success" });
      } catch (err: any) {
        console.error("Delete error:", err);
        setToast({ message: "Failed to delete image", type: "error" });
        return;
      } finally {
        setDeletingId(null);
      }
    }

    // Revoke preview URL if exists
    if (imageToRemove.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    const updatedImages = images.filter((_, i) => i !== index);
    notifyChange(updatedImages);
  };

  // Get display URL (preview or actual)
  const getDisplayUrl = (image: UploadedImage): string => {
    return image.previewUrl || image.url || "";
  };

  const canAddMore = mode === "multiple" && images.length < maxFiles;
  const showAddButton = mode === "multiple" && canAddMore && !uploading;

  return (
    <div className={className}>
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

      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div
          className={`grid gap-3 mb-4 ${mode === "single" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}
        >
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.publicId || image.previewUrl || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                {/* Image Preview */}
                <div
                  className={`relative rounded-xl overflow-hidden bg-gray-100 border-2 ${!image.url && uploading ? "border-yellow-400" : "border-gray-200"} ${mode === "single" ? "h-64" : "h-40"}`}
                >
                  <Image
                    src={getDisplayUrl(image)}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes={
                      mode === "single"
                        ? "100vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                  />

                  {/* Uploading Overlay */}
                  {!image.url && uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}

                  {/* Deleting Overlay */}
                  {deletingId === image.publicId && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}

                  {/* Hover Actions */}
                  {image.url && !uploading && deletingId !== image.publicId && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {/* View full image */}
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition"
                        title="View full size"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </a>
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Uploaded Badge */}
                  {image.url && !uploading && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-green-500 drop-shadow-md" />
                    </div>
                  )}
                </div>

                {/* Image Info */}
                {image.publicId && image.url && (
                  <p className="text-xs text-gray-500 mt-1 truncate px-1">
                    ID: {image.publicId.substring(0, 15)}...
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Area */}
      {(images.length === 0 || (mode === "multiple" && canAddMore)) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 p-6 ${
            isDragging
              ? "border-primary bg-primary/5"
              : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
          } ${mode === "single" && images.length === 0 ? "h-64" : "h-40"}`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-gray-500">
                Uploading... {Math.round(uploadProgress)}%
              </p>
              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Upload
                className={`w-10 h-10 ${error ? "text-red-400" : "text-gray-400"}`}
              />
              <p
                className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}
              >
                {isDragging
                  ? "Drop images here"
                  : mode === "single"
                    ? "Click or drag image to upload"
                    : "Click or drag images to upload"}
              </p>
              <p className="text-xs text-gray-400">
                {accept.replace("image/", "").toUpperCase()}, max {maxFileSize}
                MB
              </p>
              {mode === "multiple" && (
                <p className="text-xs text-gray-400">
                  {images.length}/{maxFiles} uploaded
                </p>
              )}
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={mode === "multiple"}
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {/* Add More Button (Multiple mode) */}
      {showAddButton && images.length > 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add More Images ({images.length}/{maxFiles})
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
