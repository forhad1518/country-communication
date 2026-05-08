"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Type,
  Quote,
  List,
  Heading1,
  Heading2,
  AlignLeft,
  Save,
  Eye,
  Send,
  Clock,
  Calendar,
  Tag,
  User,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ArrowLeft,
  FileText,
  Link,
  Bold,
  Italic,
  Underline,
} from "lucide-react";

// Types (Same as blog detail page)
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
  const [showImageUrl, setShowImageUrl] = useState(false);

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-primary/30 transition-colors group">
      {/* Block Type Selector & Actions */}
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

      {/* Block Content */}
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

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
    if (!formData.title.trim()) {
      setToast({ message: "Blog title is required", type: "error" });
      return false;
    }
    if (!formData.image.trim()) {
      setToast({ message: "Featured image URL is required", type: "error" });
      return false;
    }
    if (!formData.authorName.trim()) {
      setToast({ message: "Author name is required", type: "error" });
      return false;
    }
    if (
      formData.content.some(
        (b) =>
          !b.content || (typeof b.content === "string" && !b.content.trim()),
      )
    ) {
      setToast({
        message: "All content blocks must have content",
        type: "error",
      });
      return false;
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async (status: "draft" | "published") => {
    if (!validateForm()) return;

    setLoading(true);

    const finalData = {
      ...formData,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt:
        status === "published" ? new Date().toISOString() : undefined,
    };

    // Simulate API call
    setTimeout(() => {
      console.log("Blog data:", finalData);
      setLoading(false);
      setToast({
        message: `Blog ${status === "published" ? "published" : "saved as draft"} successfully!`,
        type: "success",
      });

      setTimeout(() => {
        router.push("/admin/blog");
      }, 1500);
    }, 1500);
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Featured Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => {
                  handleChange("image", e.target.value);
                  setPreviewImage(e.target.value);
                }}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                <Image
                  src={formData.image}
                  alt="Featured preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {!formData.image && (
              <div className="h-64 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">Image preview will appear here</p>
                <p className="text-xs mt-1">Enter an image URL above</p>
              </div>
            )}
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Author Avatar URL
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={formData.authorAvatar}
                  onChange={(e) => {
                    handleChange("authorAvatar", e.target.value);
                    setPreviewAvatar(e.target.value);
                  }}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {formData.authorAvatar && (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={formData.authorAvatar}
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
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
