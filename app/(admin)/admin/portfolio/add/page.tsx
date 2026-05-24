"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import slugify from "@/utils/slugify";
import axios from "axios";
import uploadFiles from "@/helpers/upload.image";
import SubmitLoading from "@/components/skeleton/SubmitLoading";
import {
  Upload,
  X,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Palette,
  Wrench,
  Target,
  BarChart3,
  Search,
  ArrowLeft,
  Send,
  Tag,
} from "lucide-react";

// Types
type PreviewState = {
  renders: string[];
  real: string[];
  mood: string[];
  client: string | null;
};

type Exhibition = {
  _id: string;
  exhibitionName: string;
  location: string;
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

// Tag Input Component
const TagInput = ({
  tags,
  setTags,
  placeholder = "Add tag and press Enter",
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");
  const addTag = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setInput("");
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));
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
          placeholder={placeholder}
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
                className="hover:text-red-500 transition cursor-pointer"
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

// Checkbox Group Component
const CheckboxGroup = ({
  label,
  options,
  selected,
  setSelected,
}: {
  label: string;
  name: string;
  options: string[];
  selected: string[];
  setSelected: (items: string[]) => void;
}) => {
  const [customInput, setCustomInput] = useState("");
  const toggleOption = (o: string) =>
    selected.includes(o)
      ? setSelected(selected.filter((s) => s !== o))
      : setSelected([...selected, o]);
  const addCustomItem = () => {
    const t = customInput.trim();
    if (t && !selected.includes(t)) {
      setSelected([...selected, t]);
      setCustomInput("");
    }
  };
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {options.map((o) => (
          <label
            key={o}
            className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="checkbox"
              checked={selected.includes(o)}
              onChange={() => toggleOption(o)}
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">{o}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomItem();
            }
          }}
          placeholder="Add custom item..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <button
          type="button"
          onClick={addCustomItem}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {selected.filter((s) => !options.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected
            .filter((s) => !options.includes(s))
            .map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
              >
                ✦ {item}
                <button
                  onClick={() => toggleOption(item)}
                  className="hover:text-red-500 transition cursor-pointer"
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

// File Upload Component
const FileUpload = ({
  label,
  preview,
  name,
  previewList,
  multiple = false,
  required = false,
  onChange,
  onRemove,
  error,
}: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && onChange) onChange({ target: { files } });
  };
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging ? "border-primary bg-primary/5" : error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-primary hover:bg-gray-50"}`}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
        <Upload
          className={`w-8 h-8 mx-auto mb-2 ${error ? "text-red-400" : "text-gray-400"}`}
        />
        <p className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}>
          {isDragging ? "Drop files here..." : "Click or drag files to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {multiple ? "Multiple files supported" : "Single file"}
        </p>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {preview && (
        <div className="relative inline-block mt-3">
          <Image
            src={preview}
            alt="Preview"
            width={120}
            height={90}
            className="rounded-lg object-cover border border-gray-200"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
      {previewList && previewList.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previewList.map((img: string, i: number) => (
            <div key={i} className="relative">
              <Image
                src={img}
                alt=""
                width={100}
                height={75}
                className="rounded-lg object-cover border border-gray-200"
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== MAIN COMPONENT =====
export default function AddPortfolio() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState("basic");
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic"]);

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  const [preview, setPreview] = useState<PreviewState>({
    renders: [],
    real: [],
    mood: [],
    client: null,
  });

  const sections = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "brief", label: "Brief", icon: Target },
    { id: "process", label: "Process", icon: Palette },
    { id: "materials", label: "Materials", icon: Wrench },
    { id: "execution", label: "Execution", icon: Search },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "seo", label: "SEO", icon: Tag },
  ];

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const res = await axios.get("/api/exhibition");
      setExhibitions(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSection = (id: string) =>
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const expandAll = () => setExpandedSections(sections.map((s) => s.id));
  const collapseAll = () => setExpandedSections([]);

  const handleImage = (e: any, type: keyof PreviewState) => {
    const files = e.target.files;
    if (!files) return;
    if (type === "client")
      setPreview((p) => ({ ...p, [type]: URL.createObjectURL(files[0]) }));
    else
      setPreview((p) => ({
        ...p,
        [type]: Array.from(files).map((f: any) => URL.createObjectURL(f)),
      }));
  };

  const removePreview = (type: keyof PreviewState, index?: number) => {
    if (typeof index === "number")
      setPreview((p) => ({
        ...p,
        [type]: (p[type] as string[]).filter((_, i) => i !== index),
      }));
    else setPreview((p) => ({ ...p, [type]: null }));
  };

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.get("title")) newErrors.title = "Title is required";
    if (!formData.get("exhibition"))
      newErrors.exhibition = "Exhibition is required";
    if (!formData.get("clientName"))
      newErrors.clientName = "Client name is required";
    if (!formData.get("boothSize"))
      newErrors.boothSize = "Booth size is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: "draft" | "published" = "published") => {
    const form = document.getElementById("portfolio-form") as HTMLFormElement;
    if (!form) return;
    const formData = new FormData(form);
    if (!validateForm(formData)) {
      setToast({ message: "Please fill all required fields", type: "error" });
      return;
    }
    setLoading(true);

    try {
      const slug = slugify(formData.get("title") as string);

      const rendersImages = await uploadFiles({
        type: "multiple",
        files: formData.getAll("renders") as File[],
        slug: `${slug}_renders`,
        api: "/api/upload/image",
      });
      const realImages = await uploadFiles({
        type: "multiple",
        files: formData.getAll("realImages") as File[],
        slug: `${slug}_real`,
        api: "/api/upload/image",
      });
      const moodboardImages = await uploadFiles({
        type: "multiple",
        files: formData.getAll("moodboard") as File[],
        slug: `${slug}_moodboard`,
        api: "/api/upload/image",
      });
      const clientImage = await uploadFiles({
        type: "single",
        files: formData.get("clientImage") as unknown as File[],
        slug: `${slug}_client`,
        api: "/api/upload/image",
      });

      const data = {
        title: formData.get("title"),
        exhibition_name: formData.get("exhibition"),
        projectInfo: {
          clientName: formData.get("clientName"),
          boothSize: formData.get("boothSize"),
          location: formData.get("location"),
          buildTime: formData.get("buildTime"),
          overview: formData.get("overview"),
        },
        objective: formData.get("objective"),
        challenges: formData.get("challenges"),
        process: {
          rendersImages: rendersImages,
          realImages: realImages,
          moodboardImages: moodboardImages,
          processText: formData.get("processText"),
        },
        materials: materials,
        technologies: technologies,
        execution: formData.get("execution"),
        results: {
          visitors: formData.get("visitors"),
          engagement: formData.get("engagement"),
          testimonial: formData.get("testimonial"),
          clientName: formData.get("testimonialName"),
          clientImage: clientImage,
        },
        keywords,
        status,
        slug,
      };

      await axios.post("/api/portfolio", data);
      setToast({
        message: `Portfolio ${status === "published" ? "published" : "saved as draft"} successfully!`,
        type: "success",
      });
      setTimeout(() => router.push("/admin/portfolio"), 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to add portfolio", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SubmitLoading />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
              Add New Portfolio
            </h1>
            <p className="text-sm text-gray-500">
              Create a new exhibition portfolio entry
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm flex items-center gap-2 shadow-md shadow-primary/20 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1 border shadow-sm overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${activeSection === s.id ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <s.icon className="w-4 h-4" /> {s.label}
          </button>
        ))}
      </div>

      {/* Expand/Collapse */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="text-xs text-primary hover:text-primary-hover transition cursor-pointer"
        >
          Expand All
        </button>
        <span className="text-gray-300">|</span>
        <button
          type="button"
          onClick={collapseAll}
          className="text-xs text-primary hover:text-primary-hover transition cursor-pointer"
        >
          Collapse All
        </button>
      </div>

      {/* Form */}
      <form
        id="portfolio-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("published");
        }}
      >
        <div className="bg-white rounded-xl border shadow-sm divide-y divide-gray-100">
          {/* ===== 1. BASIC INFO ===== */}
          <div
            className={`p-6 transition-all ${activeSection === "basic" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("basic")}
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Basic Information
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("basic") ? "▼" : "▶"}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections.includes("basic") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Enter portfolio title"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.title ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Exhibition <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="exhibition"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.exhibition ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                      >
                        <option value="">Select Exhibition</option>
                        {exhibitions.map((ex) => (
                          <option key={ex._id} value={ex.exhibitionName}>
                            {ex.exhibitionName}
                            {ex.location ? ` (${ex.location})` : ""}
                          </option>
                        ))}
                      </select>
                      {errors.exhibition && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.exhibition}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        placeholder="Enter client name"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.clientName ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                      />
                      {errors.clientName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.clientName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Booth Size (sqm) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="boothSize"
                        placeholder="e.g., 200 sqm"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.boothSize ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                      />
                      {errors.boothSize && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.boothSize}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder="e.g., Dubai, UAE"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Build Time (Hours)
                      </label>
                      <input
                        type="number"
                        name="buildTime"
                        placeholder="e.g., 72"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Project Overview
                    </label>
                    <textarea
                      name="overview"
                      rows={4}
                      placeholder="Brief description of the project..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== 2. BRIEF ===== */}
          <div
            className={`p-6 transition-all ${activeSection === "brief" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("brief")}
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Brief & Challenge
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("brief") ? "▼" : "▶"}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections.includes("brief") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Client Objective
                    </label>
                    <textarea
                      name="objective"
                      rows={3}
                      placeholder="What did the client want to achieve?"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Challenges
                    </label>
                    <textarea
                      name="challenges"
                      rows={3}
                      placeholder="What challenges did you face?"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== 3. PROCESS ===== */}
          <div
            className={`p-6 transition-all ${activeSection === "process" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("process")}
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Design Process
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("process") ? "▼" : "▶"}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections.includes("process") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <FileUpload
                    label="3D Renders"
                    name="renders"
                    multiple
                    onChange={(e: any) => handleImage(e, "renders")}
                    previewList={preview.renders}
                    onRemove={(i: number) => removePreview("renders", i)}
                  />
                  <FileUpload
                    label="Real Images"
                    name="realImages"
                    multiple
                    onChange={(e: any) => handleImage(e, "real")}
                    previewList={preview.real}
                    onRemove={(i: number) => removePreview("real", i)}
                  />
                  <FileUpload
                    label="Moodboard / Sketches"
                    name="moodboard"
                    multiple
                    onChange={(e: any) => handleImage(e, "mood")}
                    previewList={preview.mood}
                    onRemove={(i: number) => removePreview("mood", i)}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Process Description
                    </label>
                    <textarea
                      name="processText"
                      rows={4}
                      placeholder="Describe your design process..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== 4. MATERIALS ===== */}
          <div
            className={`p-6 transition-all ${activeSection === "materials" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("materials")}
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Materials & Technology
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("materials") ? "▼" : "▶"}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections.includes("materials") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <CheckboxGroup
                    label="Materials Used"
                    name="materials"
                    options={[
                      "Wood",
                      "Metal",
                      "Fabric",
                      "Glass",
                      "Acrylic",
                      "LED Panels",
                      "Carpet",
                      "Vinyl",
                    ]}
                    selected={materials}
                    setSelected={setMaterials}
                  />
                  <CheckboxGroup
                    label="Technologies Used"
                    name="technologies"
                    options={[
                      "LED Screens",
                      "VR Experience",
                      "Interactive Kiosks",
                      "AR",
                      "Projection Mapping",
                      "Touch Screens",
                      "Sound System",
                      "Lighting Control",
                    ]}
                    selected={technologies}
                    setSelected={setTechnologies}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== 5. EXECUTION ===== */}
          <div
            className={`p-6 transition-all ${activeSection === "execution" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("execution")}
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Execution
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("execution") ? "▼" : "▶"}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections.includes("execution") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      On-site Execution Details
                    </label>
                    <textarea
                      name="execution"
                      rows={4}
                      placeholder="Describe the installation process..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== 6. RESULTS ===== */}
          <div
            className={`p-6 transition-all ${activeSection === "results" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("results")}
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Results & Testimonials
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("results") ? "▼" : "▶"}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections.includes("results") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Number of Visitors
                      </label>
                      <input
                        type="number"
                        name="visitors"
                        placeholder="e.g., 5000"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Engagement Data
                      </label>
                      <input
                        type="text"
                        name="engagement"
                        placeholder="e.g., 85% interaction rate"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Client Testimonial
                    </label>
                    <textarea
                      name="testimonial"
                      rows={3}
                      placeholder="What did the client say?"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Client Name (for testimonial)
                      </label>
                      <input
                        type="text"
                        name="testimonialName"
                        placeholder="e.g., John Doe"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <FileUpload
                      label="Client Photo"
                      name="clientImage"
                      onChange={(e: any) => handleImage(e, "client")}
                      preview={preview.client}
                      onRemove={() => removePreview("client")}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== 7. SEO ===== */}
          <div
            className={`p-6 transition-all ${activeSection === "seo" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("seo")}
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  SEO Settings
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("seo") ? "▼" : "▶"}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections.includes("seo") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <TagInput
                    tags={keywords}
                    setTags={setKeywords}
                    placeholder="Add keyword and press Enter..."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 shadow-md shadow-primary/20 text-sm cursor-pointer"
            >
              <span>Publish Portfolio</span> <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
