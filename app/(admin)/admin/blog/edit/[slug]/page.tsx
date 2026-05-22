"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import uploadFiles from "@/helpers/upload.image";
import slugify from "@/utils/slugify";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Quote,
  List,
  Heading1,
  AlignLeft,
  Save,
  Send,
  Tag,
  User,
  Globe,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  FileText,
  Link,
  Loader2,
} from "lucide-react";
import ImageUpload, {
  UploadedImage,
} from "@/components/imageUpload/uploadImage";

// Types
type ContentBlock = {
  id?: string;
  _id?: string;
  type: "paragraph" | "heading" | "image" | "quote" | "list";
  content: any;
  caption?: string;
};

type ImageData = {
  url: string;
  publicId: string;
};

type BlogFormData = {
  title: string;
  subtitle: string;
  category: string;
  image: ImageData;
  imageFile: File | null;
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: ImageData;
  authorAvatarFile: File | null;
  readTime: string;
  tags: string[];
  content: ContentBlock[];
  status: "draft" | "published";
  slug: string;
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

// Image Upload Component
const LazyImageUpload = ({
  label,
  previewUrl,
  onChange,
  required = false,
  error,
}: {
  label: string;
  previewUrl: string;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(
    previewUrl || null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalPreview(previewUrl || null);
  }, [previewUrl]);

  const handleFile = (file: File) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeImage = () => {
    setLocalPreview(null);
    onChange(null);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {localPreview ? (
        <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 group">
          <Image
            src={localPreview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`h-64 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? "border-primary bg-primary/5"
              : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
        >
          <Upload
            className={`w-10 h-10 ${error ? "text-red-400" : "text-gray-400"}`}
          />
          <p className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}>
            {isDragging ? "Drop image here" : "Click or drag image to upload"}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Content Block Editor
const ContentBlockEditor = ({
  block,
  onChange,
  onDelete,
  index,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onDelete: () => void;
  index: number;
}) => {
  const [featuredImage, setFeaturedImage] = useState<UploadedImage[]>([]);

  useEffect(() => {
    if (
      block.type === "image" &&
      block.content &&
      typeof block.content === "object" &&
      block.content.url
    ) {
      setFeaturedImage([
        {
          url: block.content.url,
          publicId: block.content.publicId || "",
        },
      ]);
    }
  }, []);

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-primary/30 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <select
            value={block.type}
            onChange={(e) =>
              onChange({
                ...block,
                type: e.target.value as ContentBlock["type"],
              })
            }
            className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-primary"
          >
            <option value="paragraph">📝 Paragraph</option>
            <option value="heading">📌 Heading</option>
            <option value="image">🖼️ Image</option>
            <option value="quote">💬 Quote</option>
            <option value="list">📋 List</option>
          </select>
          <span className="text-xs text-gray-400">Block #{index + 1}</span>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {block.type === "paragraph" && (
        <textarea
          value={block.content as string}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Write your paragraph here..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none bg-white"
        />
      )}

      {block.type === "heading" && (
        <input
          type="text"
          value={block.content as string}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Enter heading text..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:border-primary bg-white"
        />
      )}

      {block.type === "image" && (
        <div>
          <ImageUpload
            mode="single"
            label={`Image Block #${index + 1}`}
            existingImages={featuredImage}
            onChange={(images) => {
              setFeaturedImage(images);
              if (images.length > 0) {
                onChange({
                  ...block,
                  content: { url: images[0].url, publicId: images[0].publicId },
                });
              } else {
                onChange({ ...block, content: { url: "", publicId: "" } });
              }
            }}
            onRemove={(publicId) => {
              console.log("Removed:", publicId);
            }}
            onError={(error) => {
              console.error("Error:", error);
            }}
          />
          {block.caption !== undefined && (
            <input
              type="text"
              value={block.caption || ""}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              placeholder="Image caption (optional)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white mt-2"
            />
          )}
        </div>
      )}

      {block.type === "quote" && (
        <textarea
          value={block.content as string}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Enter quote text..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm italic focus:outline-none focus:border-primary resize-none bg-white"
        />
      )}

      {block.type === "list" && (
        <div className="space-y-2">
          {(block.content as string[]).map((item, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2.5 shrink-0" />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newList = [...(block.content as string[])];
                    newList[i] = e.target.value;
                    onChange({ ...block, content: newList });
                  }}
                  placeholder={`List item ${i + 1}`}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
                />
                <button
                  onClick={() => {
                    const newList = (block.content as string[]).filter(
                      (_, idx) => idx !== i,
                    );
                    onChange({ ...block, content: newList });
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newList = [...(block.content as string[]), ""];
              onChange({ ...block, content: newList });
            }}
            className="flex items-center gap-1 text-primary text-xs hover:text-primary-hover transition"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
      )}
    </div>
  );
};

// Tag Input Component
const TagInput = ({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
}) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add tag and press Enter"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition cursor-pointer"
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
            >
              <Tag className="w-3 h-3" /> {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Skeleton Loader
const EditBlogSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded mt-2" />
        </div>
      </div>
    </div>
    <div className="flex gap-2 bg-white rounded-xl p-1 border">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 flex-1 bg-gray-200 rounded-lg" />
      ))}
    </div>
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="h-12 bg-gray-200 rounded-lg" />
      <div className="h-12 bg-gray-200 rounded-lg" />
      <div className="h-40 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

// Main Component
export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [blogId, setBlogId] = useState<string>(""); // Store _id for update
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activeSection, setActiveSection] = useState("content");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalBlog, setOriginalBlog] = useState<any>(null);

  const emptyImage: ImageData = { url: "", publicId: "" };

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    subtitle: "",
    category: "Booth Design",
    image: emptyImage,
    imageFile: null,
    authorName: "",
    authorRole: "",
    authorBio: "",
    authorAvatar: emptyImage,
    authorAvatarFile: null,
    readTime: "5 min read",
    tags: [],
    content: [{ id: "1", type: "paragraph", content: "" }],
    status: "draft",
    slug: "",
  });

  // ===== FETCH BLOG BY SLUG =====
  useEffect(() => {
    if (slug) fetchBlog(slug);
  }, [slug]);

  const fetchBlog = async (blogSlug: string) => {
    setPageLoading(true);
    try {
      const res = await axios.get(`/api/blog/${blogSlug}`);
      const blogData = res.data.data;
      setOriginalBlog(blogData);

      // Store the MongoDB _id for update
      setBlogId(blogData._id);

      // Pre-fill form with blog data
      setFormData({
        title: blogData.title || "",
        subtitle: blogData.subtitle || "",
        category: blogData.category || "Booth Design",
        image: blogData.image || emptyImage,
        imageFile: null,
        authorName: blogData.authorName || "",
        authorRole: blogData.authorRole || "",
        authorBio: blogData.authorBio || "",
        authorAvatar: blogData.authorAvatar || emptyImage,
        authorAvatarFile: null,
        readTime: blogData.readTime || "5 min read",
        tags: blogData.tags || [],
        content: (blogData.content || []).map((block: any, i: number) => ({
          ...block,
          id: block._id || block.id || `existing-${i}`,
        })),
        status: blogData.status || "draft",
        slug: blogData.slug || "",
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      setToast({ message: "Failed to load blog data", type: "error" });
    } finally {
      setPageLoading(false);
    }
  };

  // Handle input change
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "title") {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle image file change
  const handleImageFile = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image: {
          url: URL.createObjectURL(file),
          publicId: prev.image.publicId,
        },
      }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        imageFile: null,
        image: emptyImage,
      }));
    }
  };

  // Handle author avatar file change
  const handleAvatarFile = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        authorAvatarFile: file,
        authorAvatar: {
          url: URL.createObjectURL(file),
          publicId: prev.authorAvatar.publicId,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        authorAvatarFile: null,
        authorAvatar: emptyImage,
      }));
    }
  };

  // Add content block
  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: type === "list" ? [""] : "",
      caption: type === "image" ? "" : undefined,
    };
    setFormData((prev) => ({ ...prev, content: [...prev.content, newBlock] }));
  };

  // Update content block
  const updateContentBlock = (blockId: string, updatedBlock: ContentBlock) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((b) => (b.id === blockId ? updatedBlock : b)),
    }));
  };

  // Delete content block
  const deleteContentBlock = (blockId: string) => {
    if (formData.content.length <= 1) {
      setToast({
        message: "At least one content block is required",
        type: "error",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((b) => b.id !== blockId),
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Blog title is required";
    if (!formData.image.url && !formData.imageFile)
      newErrors.image = "Featured image is required";
    if (!formData.authorName.trim())
      newErrors.authorName = "Author name is required";
    if (
      formData.content.some(
        (b) =>
          !b.content || (typeof b.content === "string" && !b.content.trim()),
      )
    ) {
      newErrors.content = "All content blocks must have content";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setToast({ message: "Please fill all required fields", type: "error" });
      return false;
    }
    return true;
  };

  // ===== UPLOAD IMAGES ON SUBMIT =====
  const uploadImagesOnSubmit = async (): Promise<{
    imageData: ImageData;
    avatarData: ImageData;
  }> => {
    let imageData: ImageData = formData.image;
    let avatarData: ImageData = formData.authorAvatar;
    const blogSlug = formData.slug || slugify(formData.title);

    // Upload featured image if new file selected
    if (formData.imageFile) {
      // Delete old image if exists
      if (originalBlog?.image?.publicId) {
        try {
          await axios.delete("/api/upload/image", {
            data: { publicId: originalBlog.image.publicId },
          });
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      // Upload new image
      const uploaded = await uploadFiles({
        type: "single",
        files: formData.imageFile,
        slug: `${blogSlug}_featured`,
        api: "/api/upload/image",
      });
      if (uploaded && typeof uploaded === "object") {
        imageData = {
          url: uploaded.url || "",
          publicId: uploaded.publicId || "",
        };
      }
    }

    // Upload author avatar if new file selected
    if (formData.authorAvatarFile) {
      if (originalBlog?.authorAvatar?.publicId) {
        try {
          await axios.delete("/api/upload/image", {
            data: { publicId: originalBlog.authorAvatar.publicId },
          });
        } catch (err) {
          console.error("Error deleting old avatar:", err);
        }
      }
      const uploaded = await uploadFiles({
        type: "single",
        files: formData.authorAvatarFile,
        slug: `${blogSlug}_author`,
        api: "/api/upload/image",
      });
      if (uploaded && typeof uploaded === "object") {
        avatarData = {
          url: uploaded.url || "",
          publicId: uploaded.publicId || "",
        };
      }
    }

    return { imageData, avatarData };
  };

  // ===== HANDLE SUBMIT (UPDATE BY ID) =====
  const handleSubmit = async (status: "draft" | "published") => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { imageData, avatarData } = await uploadImagesOnSubmit();

      const blogData = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        image: imageData,
        authorName: formData.authorName,
        authorRole: formData.authorRole,
        authorBio: formData.authorBio,
        authorAvatar: avatarData,
        readTime: formData.readTime,
        tags: formData.tags,
        content: formData.content,
        status: status,
        slug: formData.slug || slugify(formData.title),
      };

      // ===== UPDATE BY ID =====
      await axios.put(`/api/blog/${blogId}`, blogData);

      setToast({
        message: `Blog ${status === "published" ? "published" : "saved as draft"} successfully!`,
        type: "success",
      });

      setTimeout(() => {
        router.push("/admin/blog");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating blog:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to update blog";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "content", label: "Content", icon: FileText },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "author", label: "Author", icon: User },
    { id: "seo", label: "SEO", icon: Globe },
  ];

  if (pageLoading) return <EditBlogSkeleton />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Edit Blog Post
            </h1>
            <p className="text-sm text-gray-500">
              Editing: {formData.title || slug}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={loading}
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm flex items-center gap-2 disabled:opacity-50 shadow-md shadow-primary/20 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading
              ? "Saving..."
              : originalBlog?.status === "published"
                ? "Update"
                : "Publish"}
          </button>
        </div>
      </div>

      {/* Rest of the form (same as before) */}
      {/* Section Navigation */}
      <div className="flex gap-2 bg-white rounded-xl p-1 border shadow-sm">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center cursor-pointer ${
              activeSection === section.id
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <section.icon className="w-4 h-4" /> {section.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        {/* Content Section */}
        {activeSection === "content" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Blog Content
            </h3>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter blog title..."
                className={`w-full px-4 py-2.5 border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? "border-red-300 bg-red-50 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-primary/20 focus:border-primary"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="blog-post-slug"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Brief description..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Category & Read Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Booth Design">Booth Design</option>
                  <option value="Industry Trends">Industry Trends</option>
                  <option value="Booth Strategy">Booth Strategy</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Technology">Technology</option>
                  <option value="Event Management">Event Management</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => handleChange("readTime", e.target.value)}
                  placeholder="5 min read"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Tags
              </label>
              <TagInput
                tags={formData.tags}
                setTags={(tags) => handleChange("tags", tags)}
              />
            </div>

            {/* Content Blocks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Content Blocks
                </label>
                <div className="flex gap-1">
                  {[
                    {
                      type: "paragraph" as const,
                      icon: AlignLeft,
                      label: "Paragraph",
                    },
                    {
                      type: "heading" as const,
                      icon: Heading1,
                      label: "Heading",
                    },
                    { type: "image" as const, icon: ImageIcon, label: "Image" },
                    { type: "quote" as const, icon: Quote, label: "Quote" },
                    { type: "list" as const, icon: List, label: "List" },
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addContentBlock(type)}
                      className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 hover:text-primary text-xs flex items-center gap-1 cursor-pointer"
                      title={`Add ${label}`}
                    >
                      <Icon className="w-3.5 h-3.5" />{" "}
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
                {formData.content.map((block, index) => (
                  <ContentBlockEditor
                    key={block.id}
                    block={block}
                    index={index}
                    onChange={(updated) =>
                      updateContentBlock(block.id!, updated)
                    }
                    onDelete={() => deleteContentBlock(block.id!)}
                  />
                ))}
              </div>
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Media Section */}
        {activeSection === "media" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Featured Image
            </h3>
            <LazyImageUpload
              label="Featured Image"
              previewUrl={formData.image.url}
              onChange={handleImageFile}
              required
              error={errors.image}
            />
          </motion.div>
        )}

        {/* Author Section */}
        {activeSection === "author" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Author Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleChange("authorName", e.target.value)}
                  placeholder="Iqbal Mahmud"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.authorName
                      ? "border-red-300 bg-red-50 focus:ring-red-500/20"
                      : "border-gray-300 focus:ring-primary/20 focus:border-primary"
                  }`}
                />
                {errors.authorName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.authorName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Author Role
                </label>
                <input
                  type="text"
                  value={formData.authorRole}
                  onChange={(e) => handleChange("authorRole", e.target.value)}
                  placeholder="Senior Exhibition Designer"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Author Bio
              </label>
              <textarea
                value={formData.authorBio}
                onChange={(e) => handleChange("authorBio", e.target.value)}
                placeholder="Brief bio of the author..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
            <LazyImageUpload
              label="Author Avatar"
              previewUrl={formData.authorAvatar.url}
              onChange={handleAvatarFile}
            />
          </motion.div>
        )}

        {/* SEO Section */}
        {activeSection === "seo" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              SEO Settings
            </h3>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Google Search Preview
              </h4>
              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <p className="text-blue-600 text-lg font-medium line-clamp-1">
                  {formData.title || "Blog Title"}
                </p>
                <p className="text-green-700 text-sm">
                  https://www.countrycomm.com/blog/
                  {formData.slug || "blog-slug"}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                  {formData.subtitle || "Blog description..."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Slug:</span>{" "}
                  {formData.slug || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tags:</span>{" "}
                  {formData.tags.length > 0
                    ? formData.tags.join(", ")
                    : "No tags"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
