"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Send, ChevronRight, Copy, Check } from "lucide-react";

// Custom SVG Icons
const PhoneIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.32-1.41c1.48.8 3.15 1.22 4.87 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.9-9.91-9.9z" />
    <path
      d="M17.5 14.5c-.3.85-1.5 1.55-2.45 1.65-.65.07-1.45-.15-3.05-1.05-2.55-1.45-4.2-4.15-4.35-4.35-.15-.2-1.05-1.4-1.05-2.65 0-1.25.65-1.85.9-2.1.25-.25.55-.3.75-.3h.55c.2 0 .4 0 .5.4.2.4.65 1.6.7 1.7.05.1.1.25 0 .4-.1.15-.15.25-.3.4-.15.15-.3.35-.45.45-.15.15-.3.3-.1.55.4.65 1.05 1.35 2 1.85 1.2.65 1.8.85 2.1.75.3-.1.45-.35.6-.6.15-.25.25-.4.4-.35.15.05.95.45 1.1.55.15.1.25.15.3.25.05.1.05.35-.1.7z"
      fill="#ffffff"
    />
  </svg>
);

const WeChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-7 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.64 1.05 5.04 2.76 6.78L4 22l3.22-.76C8.96 21.95 10.36 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

// Social Media Icons
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
    <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    <circle cx="18.406" cy="5.594" r="1.44" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// Contact Data
const contactInfo = {
  phone: [
    { number: "+880 1234 567890", label: "Sales & Inquiry" },
    { number: "+880 9876 543210", label: "Customer Support" },
  ],
  email: [
    { email: "info@countrycomm.com", label: "General Inquiry" },
    { email: "sales@countrycomm.com", label: "Sales Team" },
    { email: "support@countrycomm.com", label: "Customer Support" },
  ],
  address: {
    street: "House 42, Road 12, Gulshan Avenue",
    city: "Dhaka 1212",
    country: "Bangladesh",
    full: "House 42, Road 12, Gulshan Avenue, Dhaka 1212, Bangladesh",
  },
  officeHours: [
    { days: "Saturday - Wednesday", hours: "9:00 AM - 6:00 PM" },
    { days: "Thursday", hours: "9:00 AM - 2:00 PM" },
    { days: "Friday", hours: "Closed" },
  ],
  socialLinks: [
    {
      platform: "Facebook",
      url: "#",
      icon: <FacebookIcon />,
      color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    },
    {
      platform: "Twitter",
      url: "#",
      icon: <TwitterIcon />,
      color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]",
    },
    {
      platform: "LinkedIn",
      url: "#",
      icon: <LinkedinIcon />,
      color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
    },
    {
      platform: "Instagram",
      url: "#",
      icon: <InstagramIcon />,
      color:
        "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent",
    },
    {
      platform: "YouTube",
      url: "#",
      icon: <YoutubeIcon />,
      color: "hover:bg-[#FF0000] hover:border-[#FF0000]",
    },
  ],
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Gulshan%20Avenue%20Dhaka%20Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed",
  whatsapp: "+8801234567890",
  wechat: "CountryComm_Official",
};

// Contact Card Component
const ContactInfoCard = ({
  icon,
  title,
  children,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <div className="p-4 bg-primary rounded-xl transition-colors text-primary-light">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <div className="text-gray-300 text-sm space-y-2">{children}</div>
      </div>
    </div>
  </motion.div>
);

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    budget: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        budget: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl"
    >
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Your message has been received. Our team will get back to you within
            24 hours.
          </p>
        </motion.div>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Send Us a Message
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Fill out the form and we'll get back to you within 24 hours
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXX XXXXXX"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select Subject</option>
                  <option value="exhibition">Exhibition Booth Design</option>
                  <option value="event">Event Management</option>
                  <option value="interior">Interior & Exterior Design</option>
                  <option value="branding">Branding & Promotion</option>
                  <option value="consultation">Free Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select Budget</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us about your project..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <SendIcon />
                </>
              )}
            </motion.button>
          </form>
        </>
      )}
    </motion.div>
  );
};

// Quick Contact Button
const QuickContactButton = ({
  icon,
  label,
  value,
  onClick,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
  bgColor: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3 ${bgColor} text-white rounded-full shadow-lg transition-all duration-300`}
  >
    {icon}
    <div className="text-left">
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </motion.button>
);

// Main Component
export default function ContactPage() {
  const [wechatCopied, setWechatCopied] = useState(false);

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}?text=Hello! I'm interested in your exhibition services.`,
      "_blank",
    );
  };

  const copyWeChat = () => {
    navigator.clipboard?.writeText(contactInfo.wechat);
    setWechatCopied(true);
    setTimeout(() => setWechatCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section className="pt-20 md:pt-28 pb-12">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                  Let's Build Something
                  <br />
                  Remarkable Together
                </span>
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                Have a project in mind? Our team of exhibition experts is ready
                to help you create an unforgettable brand experience. Reach out
                to us today.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== QUICK CONTACT BUTTONS ===== */}
        <section className="pb-12">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              <QuickContactButton
                icon={<WhatsAppIcon />}
                label="Chat on WhatsApp"
                value={contactInfo.whatsapp}
                onClick={openWhatsApp}
                bgColor="bg-[#25D366] hover:bg-[#20bd5a]"
              />
              <QuickContactButton
                icon={<WeChatIcon />}
                label={wechatCopied ? "Copied!" : "WeChat ID"}
                value={wechatCopied ? "✓ Copied!" : contactInfo.wechat}
                onClick={copyWeChat}
                bgColor="bg-[#7BB32E] hover:bg-[#6a9a27]"
              />
              <QuickContactButton
                icon={<PhoneIcon />}
                label="Call Us"
                value={contactInfo.phone[0].number}
                onClick={() =>
                  (window.location.href = `tel:${contactInfo.phone[0].number.replace(/\s/g, "")}`)
                }
                bgColor="bg-primary hover:bg-primary-hover"
              />
            </motion.div>
          </div>
        </section>

        {/* ===== CONTACT INFO CARDS ===== */}
        <section className="pb-16">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Phone Card */}
              <ContactInfoCard icon={<PhoneIcon />} title="Call Us" delay={0.1}>
                {contactInfo.phone.map((phone, i) => (
                  <div key={i} className="pb-2">
                    <p className="text-xs text-gray-500">{phone.label}</p>
                    <a
                      href={`tel:${phone.number.replace(/\s/g, "")}`}
                      className="text-white hover:text-primary-light transition-colors font-medium"
                    >
                      {phone.number}
                    </a>
                  </div>
                ))}
              </ContactInfoCard>

              {/* Email Card */}
              <ContactInfoCard icon={<MailIcon />} title="Email Us" delay={0.2}>
                {contactInfo.email.map((email, i) => (
                  <div key={i} className="pb-2">
                    <p className="text-xs text-gray-500">{email.label}</p>
                    <a
                      href={`mailto:${email.email}`}
                      className="text-white hover:text-primary-light transition-colors font-medium break-all"
                    >
                      {email.email}
                    </a>
                  </div>
                ))}
              </ContactInfoCard>

              {/* Office Hours Card */}
              <ContactInfoCard
                icon={<ClockIcon />}
                title="Office Hours"
                delay={0.3}
              >
                {contactInfo.officeHours.map((schedule, i) => (
                  <div key={i} className="flex justify-between pb-2">
                    <span className="text-gray-400">{schedule.days}</span>
                    <span
                      className={`font-medium ${schedule.hours === "Closed" ? "text-red-400" : "text-white"}`}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </ContactInfoCard>
            </div>
          </div>
        </section>

        {/* ===== ADDRESS + MAP + FORM ===== */}
        <section className="pb-20">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Address Card */}
              <ContactInfoCard
                icon={<MapPinIcon />}
                title="Visit Our Office"
                delay={0.4}
              >
                <p className="text-white leading-relaxed">
                  {contactInfo.address.street}
                  <br />
                  {contactInfo.address.city}
                  <br />
                  {contactInfo.address.country}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address.full)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-primary-light text-sm hover:text-accent transition-colors"
                >
                  Get Directions
                  <ChevronRight className="w-4 h-4" />
                </a>
              </ContactInfoCard>

              {/* Global Reach Card */}
              <ContactInfoCard
                icon={<GlobeIcon />}
                title="Global Reach"
                delay={0.5}
              >
                <p className="text-gray-300 text-sm leading-relaxed">
                  While headquartered in Dhaka, we serve clients across 15+
                  countries including:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "UAE",
                    "Saudi Arabia",
                    "Qatar",
                    "Germany",
                    "UK",
                    "USA",
                    "Singapore",
                    "Malaysia",
                  ].map((country) => (
                    <span
                      key={country}
                      className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </ContactInfoCard>
            </div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[400px] md:h-[500px] bg-gray-900 mb-8"
            >
              <iframe
                src={contactInfo.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Country Communication Office - Gulshan, Dhaka"
              />
            </motion.div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </section>

        {/* ===== SOCIAL MEDIA ===== */}
        <section className="py-12 border-t border-white/10">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  Follow Us
                </h3>
                <p className="text-gray-400 text-sm">
                  Stay updated with our latest projects
                </p>
              </div>

              <div className="flex gap-3">
                {contactInfo.socialLinks.map((social) => (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 transition-all duration-300 ${social.color} hover:text-white`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="py-16 border-t border-white/10">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Get the latest exhibition tips, trends, and company updates
              </p>
              <form
                className="flex gap-3 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-full transition-colors"
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
