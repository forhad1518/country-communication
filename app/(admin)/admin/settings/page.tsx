"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Settings,
  Shield,
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
  User,
  Building2,
  MessageCircle,
  Plus,
  Trash2,
  Edit,
  X,
  Upload,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type SiteSettings = {
  // Hero Slider
  heroSlides: {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    link: string;
    isActive: boolean;
  }[];

  // Events
  runningEvent: {
    id: string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    isActive: boolean;
  } | null;
  nextEvent: {
    id: string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    isActive: boolean;
  } | null;

  // Contact Info
  contactInfo: {
    whatsapp: string;
    wechat: string;
    email: string;
    phone: string;
    secondaryPhone: string;
  };

  // Office Info
  officeInfo: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    googleMapUrl: string;
    officeHours: {
      days: string;
      hours: string;
    }[];
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

// Initial Settings Data
const initialSettings: SiteSettings = {
  heroSlides: [
    {
      id: "1",
      image: "https://picsum.photos/800/400?slide1",
      title: "Creative Design",
      subtitle: "Innovative exhibition booth designs",
      link: "/portfolio",
      isActive: true,
    },
    {
      id: "2",
      image: "https://picsum.photos/800/400?slide2",
      title: "Modern Booth",
      subtitle: "Contemporary designs for maximum impact",
      link: "/services",
      isActive: true,
    },
    {
      id: "3",
      image: "https://picsum.photos/800/400?slide3",
      title: "Exhibition Setup",
      subtitle: "Flawless execution and installation",
      link: "/portfolio",
      isActive: true,
    },
  ],
  runningEvent: {
    id: "evt1",
    name: "Dubai Expo 2024",
    location: "Dubai World Trade Centre, UAE",
    startDate: "2024-11-15",
    endDate: "2024-11-20",
    description: "World's largest exhibition showcase",
    isActive: true,
  },
  nextEvent: {
    id: "evt2",
    name: "CES Las Vegas 2025",
    location: "Las Vegas Convention Center, USA",
    startDate: "2025-01-07",
    endDate: "2025-01-10",
    description: "The most influential tech event",
    isActive: true,
  },
  contactInfo: {
    whatsapp: "+8801234567890",
    wechat: "CountryComm_Official",
    email: "info@countrycomm.com",
    phone: "+8801234567890",
    secondaryPhone: "+8809876543210",
  },
  officeInfo: {
    address: "House 42, Road 12, Gulshan Avenue",
    city: "Dhaka",
    country: "Bangladesh",
    postalCode: "1212",
    googleMapUrl:
      "https://maps.google.com/maps?q=Gulshan%20Avenue%20Dhaka%20Bangladesh",
    officeHours: [
      { days: "Saturday - Wednesday", hours: "9:00 AM - 6:00 PM" },
      { days: "Thursday", hours: "9:00 AM - 2:00 PM" },
      { days: "Friday", hours: "Closed" },
    ],
  },
};

// Main Component
export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState("slider");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Password Change State
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

  // Slider Edit Modal
  const [sliderEditModal, setSliderEditModal] = useState<{
    isOpen: boolean;
    slide: any | null;
  }>({
    isOpen: false,
    slide: null,
  });

  // Event Edit Modal
  const [eventEditModal, setEventEditModal] = useState<{
    isOpen: boolean;
    type: "running" | "next";
    event: any | null;
  }>({
    isOpen: false,
    type: "running",
    event: null,
  });

  // Save all settings
  const handleSaveAll = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({
        message: "All settings saved successfully!",
        type: "success",
      });
    }, 1000);
  };

  // Password change handler
  const handlePasswordChange = (e: React.FormEvent) => {
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

    // Simulate API call
    setTimeout(() => {
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setToast({ message: "Password updated successfully", type: "success" });
    }, 1000);
  };

  // Slider handlers
  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now().toString(),
      image: "https://picsum.photos/800/400?new",
      title: "New Slide",
      subtitle: "Slide description",
      link: "/",
      isActive: true,
    };
    setSettings((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide],
    }));
  };

  const handleDeleteSlide = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((s) => s.id !== id),
    }));
  };

  const handleToggleSlide = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s,
      ),
    }));
  };

  // Contact info handlers
  const handleContactChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  };

  // Office info handlers
  const handleOfficeChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      officeInfo: { ...prev.officeInfo, [field]: value },
    }));
  };

  // Office hours handler
  const handleOfficeHoursChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setSettings((prev) => {
      const newHours = [...prev.officeInfo.officeHours];
      newHours[index] = { ...newHours[index], [field]: value };
      return {
        ...prev,
        officeInfo: { ...prev.officeInfo, officeHours: newHours },
      };
    });
  };

  const addOfficeHours = () => {
    setSettings((prev) => ({
      ...prev,
      officeInfo: {
        ...prev.officeInfo,
        officeHours: [...prev.officeInfo.officeHours, { days: "", hours: "" }],
      },
    }));
  };

  const removeOfficeHours = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      officeInfo: {
        ...prev.officeInfo,
        officeHours: prev.officeInfo.officeHours.filter((_, i) => i !== index),
      },
    }));
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
            <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage site configuration and preferences
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1 border shadow-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        {/* ===== HERO SLIDER SETTINGS ===== */}
        {activeTab === "slider" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Hero Slider Images
                </h3>
                <p className="text-sm text-gray-500">
                  Manage the main slider on the homepage
                </p>
              </div>
              <button
                onClick={handleAddSlide}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Slide
              </button>
            </div>

            <div className="space-y-4">
              {settings.heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="border rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const newSlides = [...settings.heroSlides];
                            newSlides[index].title = e.target.value;
                            setSettings((prev) => ({
                              ...prev,
                              heroSlides: newSlides,
                            }));
                          }}
                          className="font-semibold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none px-1"
                        />
                        <span className="text-xs text-gray-400">
                          Slide #{index + 1}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const newSlides = [...settings.heroSlides];
                          newSlides[index].subtitle = e.target.value;
                          setSettings((prev) => ({
                            ...prev,
                            heroSlides: newSlides,
                          }));
                        }}
                        className="text-sm text-gray-500 w-full border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none px-1 mb-2"
                      />
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => {
                            const newSlides = [...settings.heroSlides];
                            newSlides[index].image = e.target.value;
                            setSettings((prev) => ({
                              ...prev,
                              heroSlides: newSlides,
                            }));
                          }}
                          className="text-xs text-gray-400 flex-1 border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none px-1"
                          placeholder="Image URL"
                        />
                        <input
                          type="text"
                          value={slide.link}
                          onChange={(e) => {
                            const newSlides = [...settings.heroSlides];
                            newSlides[index].link = e.target.value;
                            setSettings((prev) => ({
                              ...prev,
                              heroSlides: newSlides,
                            }));
                          }}
                          className="text-xs text-gray-400 w-32 border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none px-1"
                          placeholder="Link URL"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slide.isActive}
                          onChange={() => handleToggleSlide(slide.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                      </label>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== EVENTS SETTINGS ===== */}
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Running Event */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Running Event
              </h3>
              {settings.runningEvent ? (
                <div className="border rounded-xl p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Event Name
                      </label>
                      <input
                        type="text"
                        value={settings.runningEvent.name}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            runningEvent: {
                              ...prev.runningEvent!,
                              name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Location
                      </label>
                      <input
                        type="text"
                        value={settings.runningEvent.location}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            runningEvent: {
                              ...prev.runningEvent!,
                              location: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={settings.runningEvent.startDate}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            runningEvent: {
                              ...prev.runningEvent!,
                              startDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={settings.runningEvent.endDate}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            runningEvent: {
                              ...prev.runningEvent!,
                              endDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Description
                    </label>
                    <textarea
                      value={settings.runningEvent.description}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          runningEvent: {
                            ...prev.runningEvent!,
                            description: e.target.value,
                          },
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.runningEvent.isActive}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            runningEvent: {
                              ...prev.runningEvent!,
                              isActive: e.target.checked,
                            },
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                    </label>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2" />
                  <p>No running event set</p>
                </div>
              )}
            </div>

            {/* Next Event */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Next Event
              </h3>
              {settings.nextEvent ? (
                <div className="border rounded-xl p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Event Name
                      </label>
                      <input
                        type="text"
                        value={settings.nextEvent.name}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            nextEvent: {
                              ...prev.nextEvent!,
                              name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Location
                      </label>
                      <input
                        type="text"
                        value={settings.nextEvent.location}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            nextEvent: {
                              ...prev.nextEvent!,
                              location: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={settings.nextEvent.startDate}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            nextEvent: {
                              ...prev.nextEvent!,
                              startDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={settings.nextEvent.endDate}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            nextEvent: {
                              ...prev.nextEvent!,
                              endDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Description
                    </label>
                    <textarea
                      value={settings.nextEvent.description}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          nextEvent: {
                            ...prev.nextEvent!,
                            description: e.target.value,
                          },
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2" />
                  <p>No upcoming event set</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== CONTACT INFO SETTINGS ===== */}
        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <MessageCircle className="w-4 h-4 inline mr-1 text-green-500" />
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={settings.contactInfo.whatsapp}
                  onChange={(e) =>
                    handleContactChange("whatsapp", e.target.value)
                  }
                  placeholder="+880 1XXX XXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <MessageCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  WeChat ID
                </label>
                <input
                  type="text"
                  value={settings.contactInfo.wechat}
                  onChange={(e) =>
                    handleContactChange("wechat", e.target.value)
                  }
                  placeholder="WeChat ID"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Primary Email
                </label>
                <input
                  type="email"
                  value={settings.contactInfo.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  placeholder="info@company.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Primary Phone
                </label>
                <input
                  type="text"
                  value={settings.contactInfo.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  placeholder="+880 1XXX XXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Secondary Phone
                </label>
                <input
                  type="text"
                  value={settings.contactInfo.secondaryPhone}
                  onChange={(e) =>
                    handleContactChange("secondaryPhone", e.target.value)
                  }
                  placeholder="+880 1XXX XXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== OFFICE INFO SETTINGS ===== */}
        {activeTab === "office" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Office Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Street Address
                </label>
                <input
                  type="text"
                  value={settings.officeInfo.address}
                  onChange={(e) =>
                    handleOfficeChange("address", e.target.value)
                  }
                  placeholder="Street address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  City
                </label>
                <input
                  type="text"
                  value={settings.officeInfo.city}
                  onChange={(e) => handleOfficeChange("city", e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Country
                </label>
                <input
                  type="text"
                  value={settings.officeInfo.country}
                  onChange={(e) =>
                    handleOfficeChange("country", e.target.value)
                  }
                  placeholder="Country"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={settings.officeInfo.postalCode}
                  onChange={(e) =>
                    handleOfficeChange("postalCode", e.target.value)
                  }
                  placeholder="Postal Code"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={settings.officeInfo.googleMapUrl}
                  onChange={(e) =>
                    handleOfficeChange("googleMapUrl", e.target.value)
                  }
                  placeholder="Google Maps embed URL"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Office Hours */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Office Hours
                </label>
                <button
                  onClick={addOfficeHours}
                  className="text-xs text-primary hover:text-primary-hover transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Hours
                </button>
              </div>
              <div className="space-y-3">
                {settings.officeInfo.officeHours.map((hours, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={hours.days}
                      onChange={(e) =>
                        handleOfficeHoursChange(index, "days", e.target.value)
                      }
                      placeholder="Days (e.g., Saturday - Wednesday)"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <input
                      type="text"
                      value={hours.hours}
                      onChange={(e) =>
                        handleOfficeHoursChange(index, "hours", e.target.value)
                      }
                      placeholder="Hours (e.g., 9:00 AM - 6:00 PM)"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      onClick={() => removeOfficeHours(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== PASSWORD SETTINGS ===== */}
        {activeTab === "password" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Change Password
            </h3>

            <form
              onSubmit={handlePasswordChange}
              className="max-w-md space-y-5"
            >
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
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  Confirm New Password
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
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm shadow-md shadow-primary/20"
              >
                Update Password
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
