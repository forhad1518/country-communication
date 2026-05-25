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

type ExhibitionEventType = {
  running: {
    exhibitionName: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  next: {
    exhibitionName: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
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

  // ===== EXHIBITION EVENT STATE =====
  const [exhibitionEvent, setExhibitionEvent] = useState<ExhibitionEventType>({
    running: {
      exhibitionName: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
    next: {
      exhibitionName: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });
  const [eventSaving, setEventSaving] = useState(false);

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
    fetchExhibitionEvents();
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

  // ===== EXHIBITION EVENT API =====
  const fetchExhibitionEvents = async () => {
    try {
      const res = await axios.get("/api/exhibition-event");
      if (res.data.data) {
        setExhibitionEvent({
          running: {
            exhibitionName: res.data.data.running?.exhibitionName || "",
            location: res.data.data.running?.location || "",
            description: res.data.data.running?.description || "",
            startDate: res.data.data.running?.startDate
              ? res.data.data.running.startDate.split("T")[0]
              : "",
            endDate: res.data.data.running?.endDate
              ? res.data.data.running.endDate.split("T")[0]
              : "",
            isActive:
              res.data.data.running?.isActive !== undefined
                ? res.data.data.running.isActive
                : true,
          },
          next: {
            exhibitionName: res.data.data.next?.exhibitionName || "",
            location: res.data.data.next?.location || "",
            description: res.data.data.next?.description || "",
            startDate: res.data.data.next?.startDate
              ? res.data.data.next.startDate.split("T")[0]
              : "",
            endDate: res.data.data.next?.endDate
              ? res.data.data.next.endDate.split("T")[0]
              : "",
            isActive:
              res.data.data.next?.isActive !== undefined
                ? res.data.data.next.isActive
                : true,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEvents = async () => {
    setEventSaving(true);
    try {
      await axios.put("/api/exhibition-event", exhibitionEvent);
      setToast({ message: "Events saved!", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to save",
        type: "error",
      });
    } finally {
      setEventSaving(false);
    }
  };

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

  const tabs = [
    { id: "slider", label: "Hero Slider", icon: ImageIcon },
    { id: "events", label: "Events", icon: Calendar },
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

        {/* ===== EVENTS ===== */}
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Exhibition Events
                </h3>
                <p className="text-sm text-gray-500">
                  Manage running & next events
                </p>
              </div>
              <button
                onClick={handleSaveEvents}
                disabled={eventSaving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm cursor-pointer disabled:opacity-50"
              >
                {eventSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 inline mr-1" /> Save
                  </>
                )}
              </button>
            </div>
            <div className="border rounded-xl p-5 space-y-3">
              <h4 className="font-semibold text-gray-700">Running Event</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={exhibitionEvent.running.exhibitionName}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      running: {
                        ...prev.running,
                        exhibitionName: e.target.value,
                      },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={exhibitionEvent.running.location}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      running: { ...prev.running, location: e.target.value },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={exhibitionEvent.running.startDate}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      running: { ...prev.running, startDate: e.target.value },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={exhibitionEvent.running.endDate}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      running: { ...prev.running, endDate: e.target.value },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <textarea
                placeholder="Description"
                value={exhibitionEvent.running.description}
                onChange={(e) =>
                  setExhibitionEvent((prev) => ({
                    ...prev,
                    running: { ...prev.running, description: e.target.value },
                  }))
                }
                rows={2}
                className="w-full border rounded px-3 py-2 text-sm resize-none"
              />
            </div>
            <div className="border rounded-xl p-5 space-y-3">
              <h4 className="font-semibold text-gray-700">Next Event</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={exhibitionEvent.next.exhibitionName}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      next: { ...prev.next, exhibitionName: e.target.value },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={exhibitionEvent.next.location}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      next: { ...prev.next, location: e.target.value },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={exhibitionEvent.next.startDate}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      next: { ...prev.next, startDate: e.target.value },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={exhibitionEvent.next.endDate}
                  onChange={(e) =>
                    setExhibitionEvent((prev) => ({
                      ...prev,
                      next: { ...prev.next, endDate: e.target.value },
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <textarea
                placeholder="Description"
                value={exhibitionEvent.next.description}
                onChange={(e) =>
                  setExhibitionEvent((prev) => ({
                    ...prev,
                    next: { ...prev.next, description: e.target.value },
                  }))
                }
                rows={2}
                className="w-full border rounded px-3 py-2 text-sm resize-none"
              />
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
