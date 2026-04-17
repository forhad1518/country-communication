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
  ChevronDown,
  ChevronUp,
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
  ArrowLeft
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

type FormSection = {
  id: string;
  title: string;
  icon: any;
  completed: boolean;
};

// Toast Component
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
  error
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
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragging
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

        <Upload className={`w-8 h-8 mx-auto mb-2 ${error ? "text-red-400" : "text-gray-400"}`} />
        <p className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}>
          {isDragging ? "Drop files here..." : "Click or drag files to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {multiple ? "Multiple files supported" : "Single file"}
        </p>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Preview */}
      {preview && (
        <div className="relative inline-block mt-2">
          <Image src={preview} alt="Preview" width={100} height={80} className="rounded object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {previewList && previewList.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {previewList.map((img: string, i: number) => (
            <div key={i} className="relative">
              <Image src={img} alt="" width={80} height={60} className="rounded object-cover" />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const [preview, setPreview] = useState<PreviewState>({
    design: null,
    live: null,
    gallery: [],
    renders: [],
    real: [],
    mood: [],
    client: null,
  });

  const sections: FormSection[] = [
    { id: "basic", title: "Basic Information", icon: FileText, completed: false },
    { id: "brief", title: "Brief & Challenge", icon: Target, completed: false },
    { id: "process", title: "Design Process", icon: Palette, completed: false },
    { id: "materials", title: "Materials & Tech", icon: Wrench, completed: false },
    { id: "execution", title: "Execution", icon: Search, completed: false },
    { id: "results", title: "Results", icon: BarChart3, completed: false },
    { id: "images", title: "Images", icon: ImageIcon, completed: false },
  ];

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleImage = (e: any, type: keyof PreviewState) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "design" || type === "live" || type === "client") {
      setPreview(p => ({
        ...p,
        [type]: URL.createObjectURL(files[0]),
      }));
    } else {
      const imgs = Array.from(files).map((f: any) => URL.createObjectURL(f));
      setPreview(p => ({ ...p, [type]: imgs }));
    }
  };

  const removePreview = (type: keyof PreviewState, index?: number) => {
    if (typeof index === "number") {
      setPreview(p => ({
        ...p,
        [type]: (p[type] as string[]).filter((_, i) => i !== index)
      }));
    } else {
      setPreview(p => ({ ...p, [type]: null }));
    }
  };

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.get("title")) newErrors.title = "Title is required";
    if (!formData.get("exhibition")) newErrors.exhibition = "Exhibition is required";
    if (!formData.get("clientName")) newErrors.clientName = "Client name is required";
    if (!formData.get("boothSize")) newErrors.boothSize = "Booth size is required";
    if (!formData.get("designImage")) newErrors.designImage = "Design image is required";
    if (!formData.get("liveImage")) newErrors.liveImage = "Live image is required";

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

      // Upload images
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

      const gallery = formData.getAll("galleryImages").length > 0
        ? await uploadFiles({
          type: "multiple",
          files: formData.getAll("galleryImages") as File[],
          slug: `${slug}_gallery`,
          api: "/api/upload/image",
        }) : [];

      const renders = formData.getAll("renders").length > 0
        ? await uploadFiles({
          type: "multiple",
          files: formData.getAll("renders") as File[],
          slug: `${slug}_renders`,
          api: "/api/upload/image",
        }) : [];

      const realImages = formData.getAll("realImages").length > 0
        ? await uploadFiles({
          type: "multiple",
          files: formData.getAll("realImages") as File[],
          slug: `${slug}_real`,
          api: "/api/upload/image",
        }) : [];

      const moodboard = formData.getAll("moodboard").length > 0
        ? await uploadFiles({
          type: "multiple",
          files: formData.getAll("moodboard") as File[],
          slug: `${slug}_mood`,
          api: "/api/upload/image",
        }) : [];

      const clientImage = formData.get("clientImage")
        ? await uploadFiles({
          type: "single",
          files: formData.get("clientImage") as File,
          slug: `${slug}_client`,
          api: "/api/upload/image",
        }) : null;

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
        materials: formData.getAll("materials").filter(v => v),
        technologies: formData.getAll("technologies").filter(v => v),
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
        slug
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
    <div className="max-w-7xl mx-auto">
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Add New Portfolio</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new exhibition portfolio entry</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border shadow-sm divide-y divide-gray-100">

          {/* BASIC INFORMATION */}
          <SectionWrapper
            title="Basic Information"
            icon={FileText}
            isCollapsed={collapsedSections.includes("basic")}
            onToggle={() => toggleSection("basic")}
          >
            <Grid>
              <Input
                name="title"
                label="Title"
                required
                error={errors.title}
              />
              <Select name="exhibition" label="Exhibition" required error={errors.exhibition}>
                <option value="">Select Exhibition</option>
                <option value="dubai-expo-2024">Dubai Expo 2024</option>
                <option value="ces-2024">CES 2024</option>
                <option value="mwc-barcelona-2024">MWC Barcelona 2024</option>
                <option value="ifa-berlin-2024">IFA Berlin 2024</option>
              </Select>
              <Input name="clientName" label="Client Name" required error={errors.clientName} />
              <Input name="boothSize" label="Booth Size (sqm)" required error={errors.boothSize} />
              <Input name="location" label="Location" placeholder="e.g., Dubai, UAE" />
              <Input name="buildTime" label="Build Time (Hours)" type="number" />
            </Grid>
            <Textarea name="overview" label="Project Overview" placeholder="Brief description of the project..." />
          </SectionWrapper>

          {/* BRIEF & CHALLENGE */}
          <SectionWrapper
            title="Brief & Challenge"
            icon={Target}
            isCollapsed={collapsedSections.includes("brief")}
            onToggle={() => toggleSection("brief")}

          >
            <Textarea name="objective" label="Client Objective" placeholder="What did the client want to achieve?" />
            <Textarea name="challenges" label="Challenges" placeholder="What challenges did you face?" />
          </SectionWrapper>

          {/* DESIGN PROCESS */}
          <SectionWrapper
            title="Design Process"
            icon={Palette}
            isCollapsed={collapsedSections.includes("process")}
            onToggle={() => toggleSection("process")}

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
            <Textarea name="processText" label="Process Description" placeholder="Describe your design process..." />
          </SectionWrapper>

          {/* MATERIALS & TECHNOLOGY */}
          <SectionWrapper
            title="Materials & Technology"
            icon={Wrench}
            isCollapsed={collapsedSections.includes("materials")}
            onToggle={() => toggleSection("materials")}

          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Materials Used</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Wood", "Metal", "Fabric", "Glass", "Acrylic", "LED Panels", "Carpet", "Vinyl"].map(material => (
                    <label key={material} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" name="materials" value={material} className="rounded text-primary focus:ring-primary" />
                      <span className="text-sm">{material}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Technologies Used</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["LED Screens", "VR Experience", "Interactive Kiosks", "AR", "Projection Mapping", "Touch Screens", "Sound System", "Lighting Control"].map(tech => (
                    <label key={tech} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" name="technologies" value={tech} className="rounded text-primary focus:ring-primary" />
                      <span className="text-sm">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* EXECUTION */}
          <SectionWrapper
            title="Execution"
            icon={Search}
            isCollapsed={collapsedSections.includes("execution")}
            onToggle={() => toggleSection("execution")}

          >
            <Textarea name="execution" label="On-site Execution Details" placeholder="Describe the installation process..." />
          </SectionWrapper>

          {/* RESULTS */}
          <SectionWrapper
            title="Results & Testimonials"
            icon={BarChart3}
            isCollapsed={collapsedSections.includes("results")}
            onToggle={() => toggleSection("results")}

          >
            <Grid>
              <Input name="visitors" label="Number of Visitors" type="number" placeholder="e.g., 5000" />
              <Input name="engagement" label="Engagement Data" placeholder="e.g., 85% interaction rate" />
            </Grid>
            <Textarea name="testimonial" label="Client Testimonial" placeholder="What did the client say?" />
            <Grid>
              <Input name="testimonialName" label="Client Name (for testimonial)" placeholder="e.g., John Doe, Marketing Director" />
              <FileUpload
                label="Client Photo"
                name="clientImage"
                onChange={(e: any) => handleImage(e, "client")}
                preview={preview.client}
                onRemove={() => removePreview("client")}
              />
            </Grid>
          </SectionWrapper>

          {/* IMAGES */}
          <SectionWrapper
            title="Main Images"
            icon={ImageIcon}
            isCollapsed={collapsedSections.includes("images")}
            onToggle={() => toggleSection("images")}

          >
            <Grid>
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
            </Grid>
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
              <h3 className="text-sm font-semibold text-gray-700 mb-4">SEO Settings</h3>
              <Input name="keywords" label="Keywords" placeholder="exhibition, booth design, trade show..." />
            </div>
          </SectionWrapper>
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
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 shadow-md shadow-primary/20"
            >
              <span>Publish Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Section Wrapper Component
const SectionWrapper = ({ title, icon: Icon, isCollapsed, onToggle, isActive, children }: any) => {
  return (
    <div
      className={`p-6 transition-all ${isActive ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
      id={title.toLowerCase().replace(/\s+/g, '-')}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        {isCollapsed ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronUp className="w-5 h-5 text-gray-400" />}
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable Components
const Grid = ({ children }: any) => (
  <div className="grid md:grid-cols-2 gap-5">{children}</div>
);

const Input = ({ label, error, required, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all ${error ? "border-red-300 bg-red-50" : "border-gray-300"
        }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, required, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <textarea {...props} rows={4} className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
  </div>
);

const Select = ({ label, children, error, required, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all ${error ? "border-red-300 bg-red-50" : "border-gray-300"
        }`}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);