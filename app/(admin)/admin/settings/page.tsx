"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Key,
  Building2,
  MessageCircle,
  Plus,
  Trash2,
  ArrowLeft,
  Users,
  Edit,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUpload, {
  UploadedImage,
} from "@/components/imageUpload/uploadImage";

// Types
type SliderItem = {
  _id?: string;
  image: { url: string; publicId: string };
  comment: string;
  isActive: boolean;
  order: number;
};

type TeamMemberItem = {
  _id?: string;
  name: string;
  photo: { url: string; publicId: string };
  designation: string;
  experienceComment: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
};

type ContactInfoType = {
  whatsapp: string;
  wechat: string;
  primaryEmail: string;
  primaryPhone: string;
  secondaryPhone: string;
};

type OfficeInfoType = {
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
  googleMapUrl: string;
  officeHours: { days: string; hours: string }[];
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

export default function SettingsPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activeTab, setActiveTab] = useState("slider");

  // ===== SLIDER STATE =====
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [sliderLoading, setSliderLoading] = useState(true);
  const [sliderSaving, setSliderSaving] = useState(false);

  // ===== CONTACT INFO STATE =====
  const [contactInfo, setContactInfo] = useState<ContactInfoType>({
    whatsapp: "",
    wechat: "",
    primaryEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
  });
  const [contactSaving, setContactSaving] = useState(false);

  // ===== OFFICE INFO STATE =====
  const [officeInfo, setOfficeInfo] = useState<OfficeInfoType>({
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
    googleMapUrl: "",
    officeHours: [],
  });
  const [officeSaving, setOfficeSaving] = useState(false);


  // ===== TEAM MEMBERS STATE =====
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamSubmitting, setTeamSubmitting] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    photo: { url: "", publicId: "" },
    designation: "",
    experienceComment: "",
  });
  const [teamFormError, setTeamFormError] = useState("");

  // ===== PASSWORD STATE =====
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // ===== FETCH ALL DATA =====
  useEffect(() => {
    fetchSliders();
    fetchContactInfo();
    fetchOfficeInfo();
    fetchTeamMembers();
  }, []);

  // ===== SLIDER API =====
  const fetchSliders = async () => {
    setSliderLoading(true);
    try {
      const res = await axios.get("/api/slider?admin=true");
      setSliders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSliderLoading(false);
    }
  };

  const handleSaveSliders = async () => {
    setSliderSaving(true);
    try {
      for (const slider of sliders) {
        if (slider._id) {
          await axios.put(`/api/slider/${slider._id}`, slider);
        } else {
          await axios.post("/api/slider", slider);
        }
      }
      await fetchSliders();
      setToast({ message: "Sliders saved successfully!", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to save sliders",
        type: "error",
      });
    } finally {
      setSliderSaving(false);
    }
  };

  const handleAddSlide = () => {
    setSliders((prev) => [
      ...prev,
      {
        image: { url: "", publicId: "" },
        comment: "",
        isActive: true,
        order: prev.length,
      },
    ]);
  };

  const handleDeleteSlide = async (index: number) => {
    const slider = sliders[index];
    if (slider._id) {
      try {
        await axios.delete(`/api/slider/${slider._id}`);
      } catch (err) {
        console.error(err);
      }
    }
    setSliders((prev) => prev.filter((_, i) => i !== index));
    setToast({ message: "Slide deleted", type: "success" });
  };

  const handleSliderChange = (index: number, field: string, value: any) => {
    setSliders((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleToggleSlide = (index: number) => {
    setSliders((prev) =>
      prev.map((s, i) => (i === index ? { ...s, isActive: !s.isActive } : s)),
    );
  };

  // ===== SLIDER IMAGE UPLOAD HANDLER =====
  const handleSliderImageUpload = (index: number, images: UploadedImage[]) => {
    if (images.length > 0) {
      handleSliderChange(index, "image", {
        url: images[0].url,
        publicId: images[0].publicId,
      });
    } else {
      handleSliderChange(index, "image", { url: "", publicId: "" });
    }
  };

  // ===== CONTACT INFO API =====
  const fetchContactInfo = async () => {
    try {
      const res = await axios.get("/api/contact-info");
      if (res.data.data) {
        setContactInfo({
          whatsapp: res.data.data.whatsapp || "",
          wechat: res.data.data.wechat || "",
          primaryEmail: res.data.data.primaryEmail || "",
          primaryPhone: res.data.data.primaryPhone || "",
          secondaryPhone: res.data.data.secondaryPhone || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveContact = async () => {
    setContactSaving(true);
    try {
      await axios.put("/api/contact-info", contactInfo);
      setToast({ message: "Contact info saved!", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to save",
        type: "error",
      });
    } finally {
      setContactSaving(false);
    }
  };

  // ===== OFFICE INFO API =====
  const fetchOfficeInfo = async () => {
    try {
      const res = await axios.get("/api/office-info");
      if (res.data.data) {
        setOfficeInfo({
          streetAddress: res.data.data.streetAddress || "",
          city: res.data.data.city || "",
          country: res.data.data.country || "",
          postalCode: res.data.data.postalCode || "",
          googleMapUrl: res.data.data.googleMapUrl || "",
          officeHours: res.data.data.officeHours || [],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveOffice = async () => {
    setOfficeSaving(true);
    try {
      await axios.put("/api/office-info", officeInfo);
      setToast({ message: "Office info saved!", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to save",
        type: "error",
      });
    } finally {
      setOfficeSaving(false);
    }
  };

  const addOfficeHours = () =>
    setOfficeInfo((prev) => ({
      ...prev,
      officeHours: [...prev.officeHours, { days: "", hours: "" }],
    }));
  const removeOfficeHours = (index: number) =>
    setOfficeInfo((prev) => ({
      ...prev,
      officeHours: prev.officeHours.filter((_, i) => i !== index),
    }));

  // ===== PASSWORD API =====
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await axios.put("/api/auth/change-password", passwordForm);
      setPasswordSuccess(res.data.message || "Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setToast({
        message: "Password updated! Please login again.",
        type: "success",
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // ===== TEAM MEMBERS API =====
  const fetchTeamMembers = async () => {
    setTeamLoading(true);
    try {
      const res = await axios.get("/api/team?admin=true");
      if (res.data?.data) {
        setTeamMembers(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch team members:", err);
      setToast({
        message: err.response?.data?.error || "Failed to load team members",
        type: "error",
      });
    } finally {
      setTeamLoading(false);
    }
  };

  const handleTeamPhotoUpload = (images: UploadedImage[]) => {
    if (images.length > 0) {
      setTeamForm((prev) => ({
        ...prev,
        photo: {
          url: images[0].url,
          publicId: images[0].publicId,
        },
      }));
    } else {
      setTeamForm((prev) => ({
        ...prev,
        photo: { url: "", publicId: "" },
      }));
    }
  };

  const handleTeamFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTeamFormError("");

    if (!teamForm.name.trim()) {
      setTeamFormError("Member name is required");
      return;
    }

    if (!teamForm.photo.url) {
      setTeamFormError("Member photo is required. Please upload an image.");
      return;
    }

    if (!teamForm.designation.trim()) {
      setTeamFormError("Member designation is required");
      return;
    }

    setTeamSubmitting(true);
    try {
      if (editingMemberId) {
        const res = await axios.put(`/api/team/${editingMemberId}`, teamForm);
        setToast({
          message: res.data?.message || "Team member updated successfully!",
          type: "success",
        });
        setEditingMemberId(null);
      } else {
        const res = await axios.post("/api/team", teamForm);
        setToast({
          message: res.data?.message || "Team member added successfully!",
          type: "success",
        });
      }

      setTeamForm({
        name: "",
        photo: { url: "", publicId: "" },
        designation: "",
        experienceComment: "",
      });
      fetchTeamMembers();
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || "Failed to save team member";
      setTeamFormError(errMsg);
      setToast({
        message: errMsg,
        type: "error",
      });
    } finally {
      setTeamSubmitting(false);
    }
  };

  const handleEditMember = (member: TeamMemberItem) => {
    setEditingMemberId(member._id || null);
    setTeamForm({
      name: member.name,
      photo: {
        url: member.photo?.url || "",
        publicId: member.photo?.publicId || "",
      },
      designation: member.designation,
      experienceComment: member.experienceComment || "",
    });
    setTeamFormError("");
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setTeamForm({
      name: "",
      photo: { url: "", publicId: "" },
      designation: "",
      experienceComment: "",
    });
    setTeamFormError("");
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const res = await axios.delete(`/api/team/${id}`);
      setToast({
        message: res.data?.message || "Team member deleted successfully",
        type: "success",
      });
      if (editingMemberId === id) {
        handleCancelEdit();
      }
      setTeamMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to delete team member",
        type: "error",
      });
    }
  };

  const tabs = [
    { id: "slider", label: "Hero Slider", icon: ImageIcon },
    { id: "team", label: "Team Members", icon: Users },
    { id: "contact", label: "Contact Info", icon: Phone },
    { id: "office", label: "Office Info", icon: Building2 },
    { id: "password", label: "Password", icon: Lock },
  ];

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

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500">Manage site configuration</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white rounded-xl p-1 border shadow-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        {/* ===== SLIDER WITH IMAGE UPLOAD ===== */}
        {activeTab === "slider" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Hero Slider
                </h3>
                <p className="text-sm text-gray-500">Manage homepage slider</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSlide}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add
                </button>
                <button
                  onClick={handleSaveSliders}
                  disabled={sliderSaving}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm cursor-pointer disabled:opacity-50"
                >
                  {sliderSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 inline mr-1" /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {sliderLoading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : sliders.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No slides. Click Add to create.
                </p>
              ) : (
                sliders.map((slide, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      {/* ===== IMAGE UPLOAD ===== */}
                      <div className="w-40 shrink-0">
                        <ImageUpload
                          mode="single"
                          label=""
                          existingImages={
                            slide.image?.url
                              ? [
                                  {
                                    url: slide.image.url,
                                    publicId: slide.image.publicId,
                                  },
                                ]
                              : []
                          }
                          onChange={(images) =>
                            handleSliderImageUpload(index, images)
                          }
                          onRemove={(publicId) =>
                            handleSliderChange(index, "image", {
                              url: "",
                              publicId: "",
                            })
                          }
                          maxFileSize={5}
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={slide.comment}
                          onChange={(e) =>
                            handleSliderChange(index, "comment", e.target.value)
                          }
                          placeholder="Slider comment / title"
                          className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slide.isActive}
                              onChange={() => handleToggleSlide(index)}
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-600">
                              Active
                            </span>
                          </label>
                          <span className="text-xs text-gray-400">
                            Order: {slide.order}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSlide(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* ===== TEAM MEMBERS MANAGEMENT ===== */}
        {activeTab === "team" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Team Members Management
              </h3>
              <p className="text-sm text-gray-500">
                Add, update, and manage your company team members
              </p>
            </div>

            {/* Form Section */}
            <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-5 md:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-800 text-base">
                    {editingMemberId ? "Edit Team Member" : "Add New Team Member"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {editingMemberId
                      ? "Update the team member's details below"
                      : "Fill in the details and upload a photo to add a new member"}
                  </p>
                </div>
                {editingMemberId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleTeamFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Photo Upload Column */}
                  <div className="lg:col-span-1">
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Member Photo <span className="text-red-500">*</span>
                    </label>
                    <ImageUpload
                      mode="single"
                      label=""
                      existingImages={
                        teamForm.photo.url
                          ? [
                              {
                                url: teamForm.photo.url,
                                publicId: teamForm.photo.publicId,
                              },
                            ]
                          : []
                      }
                      onChange={handleTeamPhotoUpload}
                      onRemove={() =>
                        setTeamForm((prev) => ({
                          ...prev,
                          photo: { url: "", publicId: "" },
                        }))
                      }
                      maxFileSize={5}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Upload portrait or square photo (max 5MB).
                    </p>
                  </div>

                  {/* Form Details Column */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={teamForm.name}
                        onChange={(e) =>
                          setTeamForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g. Engr. Forhad Hossain"
                        className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={teamForm.designation}
                        onChange={(e) =>
                          setTeamForm((prev) => ({
                            ...prev,
                            designation: e.target.value,
                          }))
                        }
                        placeholder="e.g. CEO & Managing Director / Chief Architect"
                        className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Experience Comment / Bio
                      </label>
                      <textarea
                        rows={3}
                        value={teamForm.experienceComment}
                        onChange={(e) =>
                          setTeamForm((prev) => ({
                            ...prev,
                            experienceComment: e.target.value,
                          }))
                        }
                        placeholder="e.g. 15+ years experience in exhibition booth design and fabrication"
                        className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    {teamFormError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{teamFormError}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={teamSubmitting}
                        className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-sm transition"
                      >
                        {teamSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {editingMemberId ? "Updating..." : "Adding..."}
                          </>
                        ) : editingMemberId ? (
                          <>
                            <CheckCircle className="w-4 h-4" /> Update Member
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Add Team Member
                          </>
                        )}
                      </button>

                      {editingMemberId && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm cursor-pointer transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Members Table Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                  Team Members List
                  <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                    {teamMembers.length}
                  </span>
                </h4>
              </div>

              {teamLoading ? (
                <div className="py-12 text-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm">Loading team members...</p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50">
                  <Users className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-medium text-gray-600">
                    No team members added yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Fill in the form above to add your first team member.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="py-3 px-4 w-12 text-center">#</th>
                        <th className="py-3 px-4">Photo</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4">Experience Comment</th>
                        <th className="py-3 px-4 text-center w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {teamMembers.map((member, idx) => (
                        <tr
                          key={member._id || idx}
                          className={`hover:bg-gray-50/60 transition ${
                            editingMemberId === member._id ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-center text-xs text-gray-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                              {member.photo?.url ? (
                                <Image
                                  src={member.photo.url}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Users className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                            {member.name}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-block bg-primary/10 text-primary font-medium text-xs px-2.5 py-1 rounded-md">
                              {member.designation}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-600 max-w-xs truncate">
                            {member.experienceComment || (
                              <span className="text-gray-400 italic">
                                No comment
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditMember(member)}
                                title="Edit Member"
                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteMember(member._id!, member.name)
                                }
                                title="Delete Member"
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== CONTACT INFO ===== */}
        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Contact Information
                </h3>
              </div>
              <button
                onClick={handleSaveContact}
                disabled={contactSaving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm cursor-pointer disabled:opacity-50"
              >
                {contactSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 inline mr-1" /> Save
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <MessageCircle className="w-4 h-4 inline mr-1 text-green-500" />
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={contactInfo.whatsapp}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      whatsapp: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <MessageCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  WeChat
                </label>
                <input
                  type="text"
                  value={contactInfo.wechat}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      wechat: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Primary Email
                </label>
                <input
                  type="email"
                  value={contactInfo.primaryEmail}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      primaryEmail: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Primary Phone
                </label>
                <input
                  type="text"
                  value={contactInfo.primaryPhone}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      primaryPhone: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Secondary Phone
                </label>
                <input
                  type="text"
                  value={contactInfo.secondaryPhone}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      secondaryPhone: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== OFFICE INFO ===== */}
        {activeTab === "office" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Office Information
                </h3>
              </div>
              <button
                onClick={handleSaveOffice}
                disabled={officeSaving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm cursor-pointer disabled:opacity-50"
              >
                {officeSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 inline mr-1" /> Save
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Street Address
                </label>
                <input
                  type="text"
                  value={officeInfo.streetAddress}
                  onChange={(e) =>
                    setOfficeInfo((prev) => ({
                      ...prev,
                      streetAddress: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  City
                </label>
                <input
                  type="text"
                  value={officeInfo.city}
                  onChange={(e) =>
                    setOfficeInfo((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Country
                </label>
                <input
                  type="text"
                  value={officeInfo.country}
                  onChange={(e) =>
                    setOfficeInfo((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={officeInfo.postalCode}
                  onChange={(e) =>
                    setOfficeInfo((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Google Map URL
                </label>
                <input
                  type="text"
                  value={officeInfo.googleMapUrl}
                  onChange={(e) =>
                    setOfficeInfo((prev) => ({
                      ...prev,
                      googleMapUrl: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Office Hours
                </label>
                <button
                  onClick={addOfficeHours}
                  className="text-xs text-primary cursor-pointer"
                >
                  <Plus className="w-3 h-3 inline" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {officeInfo.officeHours.map((oh, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={oh.days}
                      onChange={(e) => {
                        const nh = [...officeInfo.officeHours];
                        nh[i].days = e.target.value;
                        setOfficeInfo((prev) => ({ ...prev, officeHours: nh }));
                      }}
                      placeholder="Days"
                      className="flex-1 border rounded-lg px-4 py-2.5 text-sm"
                    />
                    <input
                      type="text"
                      value={oh.hours}
                      onChange={(e) => {
                        const nh = [...officeInfo.officeHours];
                        nh[i].hours = e.target.value;
                        setOfficeInfo((prev) => ({ ...prev, officeHours: nh }));
                      }}
                      placeholder="Hours"
                      className="flex-1 border rounded-lg px-4 py-2.5 text-sm"
                    />
                    <button
                      onClick={() => removeOfficeHours(i)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== PASSWORD ===== */}
        {activeTab === "password" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-700">{passwordSuccess}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm cursor-pointer disabled:opacity-50"
              >
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
