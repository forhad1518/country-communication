"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  HelpCircle,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Tag,
  Upload,
  User,
  Wrench,
  X,
} from "lucide-react";
import Heading1 from "@/components/Heading1";
import uploadFiles from "@/helpers/upload.image";

// Preset booth dimensions
const BOOTH_SIZES = [
  "3x3m (9 sqm)",
  "4x3m (12 sqm)",
  "5x3m (15 sqm)",
  "6x3m (18 sqm)",
  "6x4m (24 sqm)",
  "6x6m (36 sqm)",
  "8x6m (48 sqm)",
  "9x6m (54 sqm)",
  "10x10m (100 sqm)",
  "Custom Size",
];

// Preset booth configurations
const BOOTH_TYPES = [
  { label: "1 Side Open (Inline / Standard)", desc: "Flanked by neighboring stalls on two sides and back wall" },
  { label: "2 Sides Open (Corner Booth)", desc: "Located at the junction of two aisles with dual open visibility" },
  { label: "3 Sides Open (Peninsula Booth)", desc: "Open to 3 aisles, ideal for prime brand exposure" },
  { label: "4 Sides Open (Island Pavilion)", desc: "Freestanding pavilion completely open to all aisles" },
];

// Budget tiers
const BUDGET_TIERS = [
  "Under 3 Lakh BDT (< $3,000)",
  "3 - 7 Lakh BDT ($3,000 - $7,000)",
  "7 - 15 Lakh BDT ($7,000 - $15,000)",
  "15+ Lakh BDT ($15,000+)",
  "Flexible / To Be Discussed",
];

// Exhibition services options
const AVAILABLE_SERVICES = [
  "3D Stand Design & Photorealistic Renders",
  "Custom Carpentry & Structure Fabrication",
  "Electrical, Trussing & Accent Spotlighting",
  "Audio-Visual Setup & Seamless LED Screens",
  "Raised Wooden Platform Flooring & Carpet",
  "High-Resolution Graphics, UV & Vinyl Branding",
  "Reception Counter & Furniture Rental",
  "On-site Stand Assembly & 24h Expo Handover",
  "Post-Event Dismantling & Warehousing",
];

export default function QuoteClient() {
  const [exhibitions, setExhibitions] = useState<{ _id: string; exhibitionName: string; location: string }[]>([]);
  const [loadingExhibitions, setLoadingExhibitions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    country: "Bangladesh",
    city: "",
    exhibitionName: "",
    customExhibition: "",
    stallNumber: "",
    boothSize: "6x3m (18 sqm)",
    customBoothSize: "",
    boothType: "2 Sides Open (Corner Booth)",
    budget: "3 - 7 Lakh BDT ($3,000 - $7,000)",
    eventDate: "",
    message: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([
    "3D Stand Design & Photorealistic Renders",
    "Custom Carpentry & Structure Fabrication",
    "Raised Wooden Platform Flooring & Carpet",
  ]);

  const [attachment, setAttachment] = useState<{ url: string; publicId: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch exhibitions for dropdown
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const res = await axios.get("/api/exhibition");
        setExhibitions(res.data.data || []);
      } catch (err) {
        console.error("Failed to load exhibitions:", err);
      } finally {
        setLoadingExhibitions(false);
      }
    };
    fetchExhibitions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const slug = `quote_${Date.now()}`;
      const result = await uploadFiles({
        type: "single",
        files: file,
        slug,
        api: "/api/upload/image",
      });

      const imgObj = result?.data || result;
      if (imgObj?.url) {
        setAttachment({ url: imgObj.url, publicId: imgObj.publicId || "" });
      }
    } catch (err) {
      console.error("Attachment upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload attachment. You can still submit the form without it.",
        background: "#111827",
        color: "#ffffff",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine final exhibition name
    const finalExhibition =
      formData.exhibitionName === "Other" || !formData.exhibitionName
        ? formData.customExhibition
        : formData.exhibitionName;

    // Determine final booth size
    const finalBoothSize =
      formData.boothSize === "Custom Size" ? formData.customBoothSize : formData.boothSize;

    if (!formData.name || !formData.companyName || !formData.email || !formData.phone) {
      Swal.fire({
        icon: "warning",
        title: "Missing Required Fields",
        text: "Please provide your Name, Company, Business Email, and Phone Number.",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#b91c1c",
      });
      return;
    }

    if (!finalExhibition) {
      Swal.fire({
        icon: "warning",
        title: "Exhibition Required",
        text: "Please select or type your target exhibition or trade show.",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#b91c1c",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        exhibitionName: finalExhibition,
        stallNumber: formData.stallNumber,
        boothSize: finalBoothSize || "Not specified",
        boothType: formData.boothType,
        budget: formData.budget,
        services: selectedServices,
        eventDate: formData.eventDate,
        message: formData.message,
        attachment: attachment || { url: "", publicId: "" },
      };

      const res = await axios.post("/api/quote", payload);

      if (res.data.success) {
        // Success Alert (matching user's reference)
        Swal.fire({
          icon: "success",
          title: "Quote Request Sent!",
          html: `
            <p style="font-size:15px;color:#d1d5db;margin-bottom:12px;">
              Thank you, <strong>${formData.name}</strong>! We have received your exhibition booth requirements.
            </p>
            <p style="font-size:14px;color:#9ca3af;">
              A confirmation email has been dispatched to <strong>${formData.email}</strong>. Our engineering and design team will prepare a preliminary concept and get back to you within <strong>24 hours</strong>.
            </p>
          `,
          background: "#111827",
          color: "#ffffff",
          confirmButtonColor: "#b91c1c",
          confirmButtonText: "Great, Thank You!",
        });

        // Reset form
        setFormData({
          name: "",
          companyName: "",
          email: "",
          phone: "",
          country: "Bangladesh",
          city: "",
          exhibitionName: "",
          customExhibition: "",
          stallNumber: "",
          boothSize: "6x3m (18 sqm)",
          customBoothSize: "",
          boothType: "2 Sides Open (Corner Booth)",
          budget: "3 - 7 Lakh BDT ($3,000 - $7,000)",
          eventDate: "",
          message: "",
        });
        setAttachment(null);
      }
    } catch (error: any) {
      console.error("Submission failed:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: error.response?.data?.error || "Could not submit your quote request. Please try again or reach out via WhatsApp.",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#b91c1c",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative bg-black min-h-screen text-white overflow-hidden py-12 md:py-16">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-white font-medium">Get Free Quote</span>
        </div>

        {/* Page Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Heading1 text="Get a Free Exhibition Booth Quote" />
          <p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
            Planning your next exhibition or trade show booth in Bangladesh or internationally? Share your booth specifications below. Our structural architects and fabrication specialists will provide a custom 3D concept and transparent proposal within 24 hours.
          </p>
        </div>

        {/* Grid Layout: Main Form + Trust Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Container (8 Cols) */}
          <div className="lg:col-span-8 bg-linear-to-b from-neutral-900/90 to-black/90 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Contact Information */}
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Contact & Company Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Your Full Name <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Forhad Hossan"
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Company / Brand Name <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Acme Global Ltd"
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Business Email Address <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Phone / WhatsApp Number <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880 1816-756997"
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g. Bangladesh"
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      City / Location
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Dhaka, Chittagong"
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Exhibition Information */}
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Exhibition & Event Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Target Exhibition / Trade Show <span className="text-primary">*</span>
                    </label>
                    <select
                      name="exhibitionName"
                      value={formData.exhibitionName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                      <option value="">-- Select an Upcoming Exhibition or Choose Other --</option>
                      {exhibitions.map((ex) => (
                        <option key={ex._id} value={ex.exhibitionName}>
                          {ex.exhibitionName} {ex.location ? `(${ex.location})` : ""}
                        </option>
                      ))}
                      <option value="Other">+ Other / Enter Custom Exhibition</option>
                    </select>
                  </div>

                  {(formData.exhibitionName === "Other" || !formData.exhibitionName) && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Exhibition / Expo Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="customExhibition"
                        value={formData.customExhibition}
                        onChange={handleChange}
                        placeholder="e.g. BAPA Foodpro Expo, Dhaka Motor Show, DITF"
                        className="w-full px-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Stall / Booth Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="stallNumber"
                      value={formData.stallNumber}
                      onChange={handleChange}
                      placeholder="e.g. Hall-4, Stall B-12"
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Expected Setup / Event Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Booth Size & Architecture */}
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Booth Specifications & Dimensions
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Booth Size Chips */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Booth Size / Area <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {BOOTH_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, boothSize: size }))}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                            formData.boothSize === size
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                              : "bg-neutral-950/60 text-gray-300 border-white/10 hover:border-white/25 hover:bg-white/5"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {formData.boothSize === "Custom Size" && (
                      <div className="mt-3">
                        <input
                          type="text"
                          name="customBoothSize"
                          value={formData.customBoothSize}
                          onChange={handleChange}
                          placeholder="e.g. 15m x 8m (120 sqm) or irregular layout"
                          className="w-full px-4 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* Booth Orientation / Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Booth Orientation / Open Sides
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BOOTH_TYPES.map((type) => (
                        <label
                          key={type.label}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            formData.boothType === type.label
                              ? "bg-primary/10 border-primary shadow-sm"
                              : "bg-neutral-950/50 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="boothType"
                            value={type.label}
                            checked={formData.boothType === type.label}
                            onChange={handleChange}
                            className="mt-1 text-primary focus:ring-primary"
                          />
                          <div>
                            <span className="block text-xs font-bold text-white">
                              {type.label}
                            </span>
                            <span className="block text-[11px] text-gray-400 mt-0.5">
                              {type.desc}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Budget Tier */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Estimated Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                      {BUDGET_TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Required Services */}
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Required Services & Scope
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_SERVICES.map((service) => {
                    const isSelected = selectedServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary/15 border-primary text-white font-medium"
                            : "bg-neutral-950/50 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] shrink-0 ${
                            isSelected
                              ? "bg-primary border-primary text-white"
                              : "border-gray-600 bg-black/40"
                          }`}
                        >
                          {isSelected && "✓"}
                        </span>
                        <span className="leading-snug">{service}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Brief & Attachments */}
              <div>
                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    5
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Project Brief & Reference Files
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Project Notes / Specific Design Ideas
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mention any specific corporate colors, branding guidelines, storage rooms, VIP lounge, demo counters, or custom requirements..."
                      className="w-full px-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-600 resize-none"
                    />
                  </div>

                  {/* Floor Plan Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Upload Floor Plan / Reference Image (Optional)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {attachment ? (
                      <div className="flex items-center justify-between p-3.5 bg-neutral-950 border border-primary/40 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-xs text-white font-medium">Reference file attached successfully</p>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-primary hover:underline"
                            >
                              Preview uploaded file →
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachment(null)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/15 hover:border-primary/50 bg-neutral-950/50 hover:bg-neutral-950 p-5 rounded-xl text-center cursor-pointer transition-all"
                      >
                        {uploadingFile ? (
                          <div className="flex items-center justify-center gap-2 text-primary text-xs">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading reference file...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-300 font-medium">
                              Click to attach floor plan, logo, or design reference
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              Images (JPG, PNG) or layout drawings supported
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-3 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Your Quote Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Request for Free 3D Design & Quote</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-3">
                  🔒 We respect your privacy. Your project details are strictly protected and never shared.
                </p>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Trust & Direct Contact (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Why Country Communication Card */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Why Choose Country Communication?
              </h3>
              <ul className="space-y-3.5 text-xs text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>10+ Years Industry Excellence:</strong> Premier booth fabricator for major expos at ICCB, BICC, and international trade fairs.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>100% In-House Production:</strong> Heavy carpentry, metal framing, CNC acrylic router, and large-format printing in our own factory.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Zero Hassle Turnkey Delivery:</strong> From official hall approvals to 24h pre-expo handover and post-event teardown.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Free 3D Revisions:</strong> We iterate the photorealistic 3D render until your brand is completely satisfied.
                  </span>
                </li>
              </ul>
            </div>

            {/* Urgent / Direct Contact Card */}
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-primary/15 border border-primary/30 rounded-3xl p-6 shadow-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Need Urgent Booth Advice?</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Exhibition deadline approaching? Speak directly with our lead exhibition engineer.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <a
                  href="https://wa.me/8801816756997"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  Chat on WhatsApp Directly →
                </a>
                <a
                  href="tel:+8801816756997"
                  className="block w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition border border-white/10"
                >
                  Call +880 1816-756997
                </a>
              </div>
            </div>

            {/* Office Location Pin */}
            <div className="p-5 bg-neutral-900/60 border border-white/10 rounded-2xl flex items-center gap-3.5 text-xs text-gray-400">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div>
                <strong className="text-white block">Niketan Office:</strong>
                House-30, (Lift-03), Road-07, Block-C, Niketan, Gulshan-1, Dhaka-1212
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
