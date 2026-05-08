"use client";

import Image from "next/image";
import { FormEvent, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import slugify from "@/utils/slugify";
import axios from "axios";
import uploadFiles from "@/helpers/upload.image";
import SubmitLoading from "@/components/skeleton/SubmitLoading";
import parseKeywords from "@/utils/parseKeyword";
import {
  Upload,
  X,
  Plus,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Palette,
  Wrench,
  Target,
  BarChart3,
  Search,
  ArrowRight,
  ArrowLeft,
  Send,
} from "lucide-react";

// Types
type PreviewState = {
  design: string | null;
  live: string | null;
  gallery: string[];
  renders: string[];
  real: string[];
  mood: string[];
  client: string | null;
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

// Drag & Drop File Upload Component
const FileUpload = ({
  label,
  preview,
  previewList,
  multiple = false,
  required = false,
  accept = "image/*",
  onChange,
  onRemove,
  error,
}: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (files && onChange) {
      onChange({ target: { files } });
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
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

      {/* Single Preview */}
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
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Multiple Preview */}
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
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
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

// Main Component
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

  const [preview, setPreview] = useState<PreviewState>({
    design: null,
    live: null,
    gallery: [],
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
    { id: "images", label: "Images", icon: ImageIcon },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const expandAll = () => {
    setExpandedSections(sections.map((s) => s.id));
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  const handleImage = (e: any, type: keyof PreviewState) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "design" || type === "live" || type === "client") {
      setPreview((p) => ({
        ...p,
        [type]: URL.createObjectURL(files[0]),
      }));
    } else {
      const imgs = Array.from(files).map((f: any) => URL.createObjectURL(f));
      setPreview((p) => ({ ...p, [type]: imgs }));
    }
  };

  const removePreview = (type: keyof PreviewState, index?: number) => {
    if (typeof index === "number") {
      setPreview((p) => ({
        ...p,
        [type]: (p[type] as string[]).filter((_, i) => i !== index),
      }));
    } else {
      setPreview((p) => ({ ...p, [type]: null }));
    }
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
    if (!formData.get("designImage"))
      newErrors.designImage = "Design image is required";
    if (!formData.get("liveImage"))
      newErrors.liveImage = "Live image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!validateForm(formData)) {
      setToast({ message: "Please fill all required fields", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const slug = slugify(formData.get("title") as string);
      const keyword = parseKeywords(formData.get("keywords") as string);

      const designImage = await uploadFiles({
        type: "single",
        files: formData.get("designImage") as File,
        slug: `${slug}_design`,
        api: "/api/upload/image",
      });

      const liveImage = await uploadFiles({
        type: "single",
        files: formData.get("liveImage") as File,
        slug: `${slug}_live`,
        api: "/api/upload/image",
      });

      const gallery =
        formData.getAll("galleryImages").length > 0
          ? await uploadFiles({
              type: "multiple",
              files: formData.getAll("galleryImages") as File[],
              slug: `${slug}_gallery`,
              api: "/api/upload/image",
            })
          : [];

      const renders =
        formData.getAll("renders").length > 0
          ? await uploadFiles({
              type: "multiple",
              files: formData.getAll("renders") as File[],
              slug: `${slug}_renders`,
              api: "/api/upload/image",
            })
          : [];

      const realImages =
        formData.getAll("realImages").length > 0
          ? await uploadFiles({
              type: "multiple",
              files: formData.getAll("realImages") as File[],
              slug: `${slug}_real`,
              api: "/api/upload/image",
            })
          : [];

      const moodboard =
        formData.getAll("moodboard").length > 0
          ? await uploadFiles({
              type: "multiple",
              files: formData.getAll("moodboard") as File[],
              slug: `${slug}_mood`,
              api: "/api/upload/image",
            })
          : [];

      const clientImage = formData.get("clientImage")
        ? await uploadFiles({
            type: "single",
            files: formData.get("clientImage") as File,
            slug: `${slug}_client`,
            api: "/api/upload/image",
          })
        : null;

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
          renders,
          realImages,
          moodboard,
          processText: formData.get("processText"),
        },
        materials: formData.getAll("materials").filter((v) => v),
        technologies: formData.getAll("technologies").filter((v) => v),
        execution: formData.get("execution"),
        results: {
          visitors: formData.get("visitors"),
          engagement: formData.get("engagement"),
          testimonial: formData.get("testimonial"),
          clientName: formData.get("testimonialName"),
          clientImage,
        },
        keywords: keyword,
        designImage,
        liveImage,
        gallery,
        slug,
      };

      await axios.post("/api/portfolio", data);

      setToast({ message: "Portfolio added successfully!", type: "success" });

      setTimeout(() => {
        router.push("/admin/portfolio");
      }, 1500);
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
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            type="submit"
            form="portfolio-form"
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm flex items-center gap-2 shadow-md shadow-primary/20"
          >
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1 border shadow-sm overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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

      {/* Expand/Collapse All */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="text-xs text-primary hover:text-primary-hover transition"
        >
          Expand All
        </button>
        <span className="text-gray-300">|</span>
        <button
          type="button"
          onClick={collapseAll}
          className="text-xs text-primary hover:text-primary-hover transition"
        >
          Collapse All
        </button>
      </div>

      {/* Form */}
      <form id="portfolio-form" onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border shadow-sm divide-y divide-gray-100">
          {/* BASIC INFORMATION */}
          <div
            className={`p-6 transition-all ${activeSection === "basic" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("basic")}
              className="w-full flex items-center justify-between mb-4"
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
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.title
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
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
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.exhibition
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Exhibition</option>
                        <option value="dubai-expo-2024">Dubai Expo 2024</option>
                        <option value="ces-2024">CES 2024</option>
                        <option value="mwc-barcelona-2024">
                          MWC Barcelona 2024
                        </option>
                        <option value="ifa-berlin-2024">IFA Berlin 2024</option>
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
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.clientName
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
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
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                          errors.boothSize
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
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

          {/* BRIEF & CHALLENGE */}
          <div
            className={`p-6 transition-all ${activeSection === "brief" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("brief")}
              className="w-full flex items-center justify-between mb-4"
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

          {/* DESIGN PROCESS */}
          <div
            className={`p-6 transition-all ${activeSection === "process" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("process")}
              className="w-full flex items-center justify-between mb-4"
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

          {/* MATERIALS & TECHNOLOGY */}
          <div
            className={`p-6 transition-all ${activeSection === "materials" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("materials")}
              className="w-full flex items-center justify-between mb-4"
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
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Materials Used
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "Wood",
                        "Metal",
                        "Fabric",
                        "Glass",
                        "Acrylic",
                        "LED Panels",
                        "Carpet",
                        "Vinyl",
                      ].map((material) => (
                        <label
                          key={material}
                          className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        >
                          <input
                            type="checkbox"
                            name="materials"
                            value={material}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">
                            {material}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Technologies Used
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "LED Screens",
                        "VR Experience",
                        "Interactive Kiosks",
                        "AR",
                        "Projection Mapping",
                        "Touch Screens",
                        "Sound System",
                        "Lighting Control",
                      ].map((tech) => (
                        <label
                          key={tech}
                          className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        >
                          <input
                            type="checkbox"
                            name="technologies"
                            value={tech}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{tech}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* EXECUTION */}
          <div
            className={`p-6 transition-all ${activeSection === "execution" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("execution")}
              className="w-full flex items-center justify-between mb-4"
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

          {/* RESULTS */}
          <div
            className={`p-6 transition-all ${activeSection === "results" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("results")}
              className="w-full flex items-center justify-between mb-4"
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
                        placeholder="e.g., John Doe, Marketing Director"
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

          {/* IMAGES */}
          <div
            className={`p-6 transition-all ${activeSection === "images" ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
          >
            <button
              type="button"
              onClick={() => toggleSection("images")}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Main Images
                </h2>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedSections.includes("images") ? "▼" : "▶"}
              </span>
            </button>

            <AnimatePresence>
              {expandedSections.includes("images") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <FileUpload
                      label="Design Image"
                      name="designImage"
                      required
                      onChange={(e: any) => handleImage(e, "design")}
                      preview={preview.design}
                      onRemove={() => removePreview("design")}
                      error={errors.designImage}
                    />
                    <FileUpload
                      label="Live Image"
                      name="liveImage"
                      required
                      onChange={(e: any) => handleImage(e, "live")}
                      preview={preview.live}
                      onRemove={() => removePreview("live")}
                      error={errors.liveImage}
                    />
                  </div>
                  <FileUpload
                    label="Gallery Images"
                    name="galleryImages"
                    multiple
                    onChange={(e: any) => handleImage(e, "gallery")}
                    previewList={preview.gallery}
                    onRemove={(i: number) => removePreview("gallery", i)}
                  />

                  {/* SEO */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      SEO Settings
                    </h3>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Keywords
                      </label>
                      <input
                        type="text"
                        name="keywords"
                        placeholder="exhibition, booth design, trade show..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
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
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 shadow-md shadow-primary/20 text-sm"
            >
              <span>Publish Portfolio</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
