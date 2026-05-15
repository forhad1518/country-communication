"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

// Types
type ContentBlock = {
  id: string;
  type: "paragraph" | "heading" | "image" | "quote" | "list";
  content: string | string[];
  caption?: string;
};

type BlogFormData = {
  title: string;
  subtitle: string;
  category: string;
  image: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
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

// Drag & Drop Image Upload Component
const ImageUpload = ({
  label,
  value,
  onChange,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  error?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload to server
    setUploading(true);
    try {
      const slug = slugify(label + "_" + Date.now());
      const uploadedUrl = await uploadFiles({
        type: "single",
        files: file,
        slug: slug,
        api: "/api/upload/image",
      });

      if (uploadedUrl) {
        onChange(uploadedUrl);
        setToastMessage?.({
          message: "Image uploaded successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setToastMessage?.({ message: "Failed to upload image", type: "error" });
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
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
    onChange("");
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {preview ? (
        <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 group">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          {/* Overlay on hover */}
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
          className={`h-64 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
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
              <p className="text-sm text-gray-500">Uploading image...</p>
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
                  ? "Drop image here"
                  : "Click or drag image to upload"}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
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

// Toast message setter (shared across components)
let setToastMessage:
  | ((toast: { message: string; type: "success" | "error" }) => void)
  | null = null;

// Content Block Editor (Same as before - unchanged)
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
  const [showImageUrl, setShowImageUrl] = useState(false);

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
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setShowImageUrl(!showImageUrl)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition flex items-center gap-1"
            >
              <Link className="w-3 h-3" />
              {showImageUrl ? "Hide URL" : "Add Image URL"}
            </button>
          </div>

          {showImageUrl && (
            <input
              type="text"
              value={block.content as string}
              onChange={(e) => onChange({ ...block, content: e.target.value })}
              placeholder="Enter image URL..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            />
          )}

          {block.content && (
            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={block.content as string}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Image caption (optional)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
          />
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
            <Plus className="w-3 h-3" />
            Add Item
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
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
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
              <Tag className="w-3 h-3" />
              {tag}
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

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
};

// Main Component
export default function AddBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activeSection, setActiveSection] = useState("content");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set global toast
  setToastMessage = setToast;

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    subtitle: "",
    category: "Booth Design",
    image: "",
    authorName: "",
    authorRole: "",
    authorBio: "",
    authorAvatar: "",
    readTime: "5 min read",
    tags: [],
    content: [
      {
        id: "1",
        type: "paragraph",
        content: "",
      },
    ],
    status: "draft",
    slug: "",
  });

  // Handle input change
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === "title") {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
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
    if (!formData.image.trim()) newErrors.image = "Featured image is required";
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

  // Handle submit
  const handleSubmit = async (status: "draft" | "published") => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare data for API
      const blogData = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        image: formData.image,
        authorName: formData.authorName,
        authorRole: formData.authorRole,
        authorBio: formData.authorBio,
        authorAvatar: formData.authorAvatar,
        readTime: formData.readTime,
        tags: formData.tags,
        content: formData.content,
        status: status,
        slug: formData.slug || generateSlug(formData.title),
      };

      // Call API
      const response = await axios.post("/api/blog", blogData);

      setToast({
        message: `Blog ${status === "published" ? "published" : "saved as draft"} successfully!`,
        type: "success",
      });

      // Redirect to blog list after short delay
      setTimeout(() => {
        router.push("/admin/blog");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating blog:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to create blog";
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
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Add New Blog Post
            </h1>
            <p className="text-sm text-gray-500">Create a new blog article</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={loading}
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm flex items-center gap-2 disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 bg-white rounded-xl p-1 border shadow-sm">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeSection === section.id
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
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
                placeholder="Brief description of the blog..."
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
                      className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 hover:text-primary text-xs flex items-center gap-1"
                      title={`Add ${label}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
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
                      updateContentBlock(block.id, updated)
                    }
                    onDelete={() => deleteContentBlock(block.id)}
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

            <ImageUpload
              label="Featured Image"
              value={formData.image}
              onChange={(url) => handleChange("image", url)}
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

            <ImageUpload
              label="Author Avatar"
              value={formData.authorAvatar}
              onChange={(url) => handleChange("authorAvatar", url)}
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
                  {formData.subtitle ||
                    "Blog description will appear here in search results..."}
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
