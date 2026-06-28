"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import slugify from "@/utils/slugify";
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
  Loader2,
} from "lucide-react";

// ===== Types =====
type Exhibition = { _id: string; exhibitionName: string; location: string };

// Image type as stored in schema
type ImageObject = {
  url: string;
  publicId: string;
};

type PortfolioData = {
  _id?: string;
  title: string;
  exhibition_name: string;
  projectInfo: {
    clientName: string;
    boothSize: string;
    location: string;
    buildTime: string;
    overview: string;
  };
  objective: string;
  challenges: string;
  process: {
    rendersImages: ImageObject[];
    realImages: ImageObject[];
    moodboardImages: ImageObject[];
    processText: string;
  };
  materials: string[];
  technologies: string[];
  execution: string;
  results: {
    visitors: string;
    engagement: string;
    testimonial: string;
    clientName: string;
    clientImage: ImageObject | null;
  };
  keywords: string[];
  status: "draft" | "published";
  slug: string;
};

// ===== Toast (unchanged) =====
const Toast = ({ message, type, onClose }: any) => {
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

// ===== TagInput (unchanged) =====
const TagInput = ({
  tags,
  setTags,
  placeholder = "Add tag and press Enter",
}: any) => {
  const [input, setInput] = useState("");
  const addTag = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setInput("");
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter((t: string) => t !== tag));
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
          {tags.map((tag: string) => (
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

// ===== CheckboxGroup (unchanged) =====
const CheckboxGroup = ({ label, options, selected, setSelected }: any) => {
  const [customInput, setCustomInput] = useState("");
  const toggleOption = (o: string) =>
    selected.includes(o)
      ? setSelected(selected.filter((s: string) => s !== o))
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
        {options.map((o: string) => (
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
      {selected.filter((s: string) => !options.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected
            .filter((s: string) => !options.includes(s))
            .map((item: string) => (
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

// ===== FIXED: Multi‑Image Upload (uses type: "multiple") =====
const MultiImageUpload = ({
  label,
  value = [], // Array of ImageObject { url, publicId }
  onChange,
  onRemove,
  uploading,
  slug,
}: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !slug) return;

    const fileArray = Array.from(files);

    try {
      // Use uploadFiles with type: "multiple" - it returns array of { url, publicId }
      const result = await uploadFiles({
        type: "multiple",
        files: fileArray,
        slug: slug,
        api: "/api/upload/image",
      });

      // result should be array of image objects
      if (result && Array.isArray(result)) {
        onChange([...value, ...result]);
      } else if (result?.data && Array.isArray(result.data)) {
        onChange([...value, ...result.data]);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
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
        className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {isDragging ? "Drop files here..." : "Click or drag files to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Multiple files supported</p>
        {uploading && (
          <div className="flex items-center justify-center gap-2 mt-2 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>
      {value && value.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {value.map((item: ImageObject, i: number) => (
            <div key={i} className="relative">
              <Image
                src={item.url}
                alt=""
                width={100}
                height={75}
                className="rounded-lg object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={() => onRemove && onRemove(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== FIXED: Single Image Upload (returns { url, publicId }) =====
const SingleImageUpload = ({
  label,
  value, // ImageObject | null
  onChange,
  onRemove,
  uploading,
  slug,
}: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!slug) return;
    try {
      const result = await uploadFiles({
        type: "single",
        files: file,
        slug: slug,
        api: "/api/upload/image",
      });

      // result should be { url, publicId }
      const imageObj = result?.data || result;
      if (imageObj?.url) {
        onChange(imageObj);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
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
        className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {isDragging ? "Drop file here..." : "Click or drag a file to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Single file</p>
        {uploading && (
          <div className="flex items-center justify-center gap-2 mt-2 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>
      {value && (
        <div className="relative inline-block mt-3">
          <Image
            src={value.url}
            alt=""
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
    </div>
  );
};

// ===== MAIN COMPONENT =====
export default function EditPortfolio() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState("basic");
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic"]);

  // Form state - all fields as per schema
  const [title, setTitle] = useState("");
  const [exhibition, setExhibition] = useState("");
  const [clientName, setClientName] = useState("");
  const [boothSize, setBoothSize] = useState("");
  const [location, setLocation] = useState("");
  const [buildTime, setBuildTime] = useState("");
  const [overview, setOverview] = useState("");
  const [objective, setObjective] = useState("");
  const [challenges, setChallenges] = useState("");
  const [processText, setProcessText] = useState("");
  const [execution, setExecution] = useState("");
  const [visitors, setVisitors] = useState("");
  const [engagement, setEngagement] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [testimonialName, setTestimonialName] = useState("");

  // Arrays - store ImageObject arrays
  const [materials, setMaterials] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [renders, setRenders] = useState<ImageObject[]>([]);
  const [realImages, setRealImages] = useState<ImageObject[]>([]);
  const [moodImages, setMoodImages] = useState<ImageObject[]>([]);
  const [clientImage, setClientImage] = useState<ImageObject | null>(null);

  // Uploading status
  const [uploading, setUploading] = useState(false);

  // Exhibition list
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  const sections = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "brief", label: "Brief", icon: Target },
    { id: "process", label: "Process", icon: Palette },
    { id: "materials", label: "Materials", icon: Wrench },
    { id: "execution", label: "Execution", icon: Search },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "seo", label: "SEO", icon: Tag },
  ];

  // Fetch exhibitions
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const res = await axios.get("/api/exhibition");
        setExhibitions(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExhibitions();
  }, []);

  // Fetch portfolio data
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/portfolio/${slug}`);
        const data: PortfolioData = res.data.data;

        // Populate state
        setTitle(data.title);
        setExhibition(data.exhibition_name);
        setClientName(data.projectInfo.clientName);
        setBoothSize(data.projectInfo.boothSize);
        setLocation(data.projectInfo.location || "");
        setBuildTime(data.projectInfo.buildTime || "");
        setOverview(data.projectInfo.overview || "");
        setObjective(data.objective || "");
        setChallenges(data.challenges || "");
        setProcessText(data.process.processText || "");
        setExecution(data.execution || "");
        setVisitors(data.results.visitors || "");
        setEngagement(data.results.engagement || "");
        setTestimonial(data.results.testimonial || "");
        setTestimonialName(data.results.clientName || "");
        setMaterials(data.materials || []);
        setTechnologies(data.technologies || []);
        setKeywords(data.keywords || []);
        setRenders(data.process.rendersImages || []);
        setRealImages(data.process.realImages || []);
        setMoodImages(data.process.moodboardImages || []);
        setClientImage(data.results.clientImage || null);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load portfolio data", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const toggleSection = (id: string) =>
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const expandAll = () => setExpandedSections(sections.map((s) => s.id));
  const collapseAll = () => setExpandedSections([]);

  // Remove image from array
  const removeImage = (
    index: number,
    setter: (items: ImageObject[]) => void,
    current: ImageObject[],
  ) => {
    const updated = current.filter((_, i) => i !== index);
    setter(updated);
  };

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title) newErrors.title = "Title is required";
    if (!exhibition) newErrors.exhibition = "Exhibition is required";
    if (!clientName) newErrors.clientName = "Client name is required";
    if (!boothSize) newErrors.boothSize = "Booth size is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (status: "draft" | "published") => {
    if (!validate()) {
      setToast({ message: "Please fill all required fields", type: "error" });
      return;
    }
    setSubmitting(true);

    const payload = {
      title,
      exhibition_name: exhibition,
      projectInfo: {
        clientName,
        boothSize,
        location,
        buildTime,
        overview,
      },
      objective,
      challenges,
      process: {
        rendersImages: renders,
        realImages: realImages,
        moodboardImages: moodImages,
        processText,
      },
      materials,
      technologies,
      execution,
      results: {
        visitors,
        engagement,
        testimonial,
        clientName: testimonialName,
        clientImage,
      },
      keywords,
      status,
      slug,
    };

    try {
      await axios.put(`/api/portfolio/${slug}`, payload);
      setToast({
        message: `Portfolio ${status === "published" ? "updated and published" : "updated as draft"} successfully!`,
        type: "success",
      });
      setTimeout(() => router.push("/admin/portfolio"), 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update portfolio", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SubmitLoading />;

  // Generate slug for images
  const imageSlug = title ? slugify(title) : `edit_${Date.now()}`;

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
              Edit Portfolio
            </h1>
            <p className="text-sm text-gray-500">
              Update exhibition portfolio entry
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 cursor-pointer"
            disabled={submitting}
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm flex items-center gap-2 shadow-md shadow-primary/20 cursor-pointer"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{submitting ? "Updating..." : "Update & Publish"}</span>
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeSection === s.id
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100"
            }`}
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        value={exhibition}
                        onChange={(e) => setExhibition(e.target.value)}
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
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
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
                        value={boothSize}
                        onChange={(e) => setBoothSize(e.target.value)}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Build Time (Hours)
                      </label>
                      <input
                        type="number"
                        value={buildTime}
                        onChange={(e) => setBuildTime(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Project Overview
                    </label>
                    <textarea
                      rows={4}
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
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
                      rows={3}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Challenges
                    </label>
                    <textarea
                      rows={3}
                      value={challenges}
                      onChange={(e) => setChallenges(e.target.value)}
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
                  <MultiImageUpload
                    label="3D Renders"
                    value={renders}
                    onChange={(items: ImageObject[]) => setRenders(items)}
                    onRemove={(i: number) =>
                      removeImage(i, setRenders, renders)
                    }
                    uploading={uploading}
                    slug={imageSlug}
                  />
                  <MultiImageUpload
                    label="Real Images"
                    value={realImages}
                    onChange={(items: ImageObject[]) => setRealImages(items)}
                    onRemove={(i: number) =>
                      removeImage(i, setRealImages, realImages)
                    }
                    uploading={uploading}
                    slug={imageSlug}
                  />
                  <MultiImageUpload
                    label="Moodboard / Sketches"
                    value={moodImages}
                    onChange={(items: ImageObject[]) => setMoodImages(items)}
                    onRemove={(i: number) =>
                      removeImage(i, setMoodImages, moodImages)
                    }
                    uploading={uploading}
                    slug={imageSlug}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Process Description
                    </label>
                    <textarea
                      rows={4}
                      value={processText}
                      onChange={(e) => setProcessText(e.target.value)}
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
                      rows={4}
                      value={execution}
                      onChange={(e) => setExecution(e.target.value)}
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
                        value={visitors}
                        onChange={(e) => setVisitors(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Engagement Data
                      </label>
                      <input
                        type="text"
                        value={engagement}
                        onChange={(e) => setEngagement(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Client Testimonial
                    </label>
                    <textarea
                      rows={3}
                      value={testimonial}
                      onChange={(e) => setTestimonial(e.target.value)}
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
                        value={testimonialName}
                        onChange={(e) => setTestimonialName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <SingleImageUpload
                      label="Client Photo"
                      value={clientImage}
                      onChange={(item: ImageObject) => setClientImage(item)}
                      onRemove={() => setClientImage(null)}
                      uploading={uploading}
                      slug={imageSlug}
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
              disabled={submitting}
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 shadow-md shadow-primary/20 text-sm cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{submitting ? "Updating..." : "Update & Publish"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}