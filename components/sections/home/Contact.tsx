"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Heading1 from "@/components/Heading1";

// Custom SVG Icons
const PhoneIcon = () => (
  <svg
    width="24"
    height="24"
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
    width="24"
    height="24"
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
    width="24"
    height="24"
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
    width="24"
    height="24"
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
const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
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

// Types
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

// Contact Card
const ContactCard = ({
  icon,
  title,
  content,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="group bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <div className="text-gray-300 text-sm space-y-1">{content}</div>
      </div>
    </div>
  </motion.div>
);

// Social Icon
const SocialIcon = ({
  platform,
  url,
  icon,
}: {
  platform: string;
  url: string;
  icon: React.ReactNode;
}) => {
  const colors: Record<string, string> = {
    Facebook: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    Twitter: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]",
    LinkedIn: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
    Instagram:
      "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent",
    YouTube: "hover:bg-[#FF0000] hover:border-[#FF0000]",
  };
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
      className={`p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 transition-all duration-300 ${colors[platform] || ""} hover:text-white`}
    >
      {icon}
    </motion.a>
  );
};

// ===== MAIN COMPONENT =====
export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfoType>({
    whatsapp: "",
    wechat: "",
    primaryEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
  });
  const [officeInfo, setOfficeInfo] = useState<OfficeInfoType>({
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
    googleMapUrl: "",
    officeHours: [],
  });

  const socialLinks = [
    {
      platform: "Facebook",
      url: "https://facebook.com/countrycommunication",
      icon: <FacebookIcon />,
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/countrycomm",
      icon: <TwitterIcon />,
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/countrycommunication",
      icon: <LinkedinIcon />,
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/countrycommunication",
      icon: <InstagramIcon />,
    },
    {
      platform: "YouTube",
      url: "https://youtube.com/@countrycommunication",
      icon: <YoutubeIcon />,
    },
  ];

  useEffect(() => {
    fetchContactInfo();
    fetchOfficeInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await axios.get("/api/contact-info");
      if (res.data.data) setContactInfo(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchOfficeInfo = async () => {
    try {
      const res = await axios.get("/api/office-info");
      if (res.data.data) setOfficeInfo(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const phoneNumbers = [
    contactInfo.primaryPhone,
    contactInfo.secondaryPhone,
  ].filter(Boolean);
  const emails = [contactInfo.primaryEmail].filter(Boolean);

  const fullAddress = [
    officeInfo.streetAddress,
    officeInfo.city,
    officeInfo.country,
    officeInfo.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="relative py-16 md:py-20 bg-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Heading1 text="Contact With Us" />
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base mt-3">
            Have questions about our exhibition services? We're here to help.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ContactCard
            icon={<PhoneIcon />}
            title="Call Us"
            delay={0.1}
            content={
              phoneNumbers.length > 0 ? (
                phoneNumbers.map((p, i) => (
                  <a
                    key={i}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="block hover:text-primary transition-colors"
                  >
                    {p}
                  </a>
                ))
              ) : (
                <span className="text-gray-500">No phone set</span>
              )
            }
          />
          <ContactCard
            icon={<MailIcon />}
            title="Email Us"
            delay={0.2}
            content={
              emails.length > 0 ? (
                emails.map((e, i) => (
                  <a
                    key={i}
                    href={`mailto:${e}`}
                    className="block hover:text-primary transition-colors"
                  >
                    {e}
                  </a>
                ))
              ) : (
                <span className="text-gray-500">No email set</span>
              )
            }
          />
          <ContactCard
            icon={<ClockIcon />}
            title="Office Hours"
            delay={0.3}
            content={
              officeInfo.officeHours.length > 0 ? (
                officeInfo.officeHours.map((oh, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{oh.days}</span>
                    <span
                      className={
                        oh.hours === "Closed"
                          ? "text-red-400"
                          : "text-primary"
                      }
                    >
                      {oh.hours}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No hours set</span>
              )
            }
          />
        </div>

        {/* Location Card */}
        {fullAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="group bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 hover:border-primary/30 shadow-lg transition-all duration-300 mb-12"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors text-primary">
                <MapPinIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Visit Us
                </h3>
                <p className="text-gray-300 text-sm">{fullAddress}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 mb-12 h-100 md:h-125"
        >
          <iframe
            src={officeInfo.googleMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location - Gulshan, Dhaka"
          />
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-8 border-t border-white/10 text-center"
        >
          <span className="text-gray-400 text-sm mb-4 block">Follow Us</span>
          <div className="flex gap-3 justify-center">
            {socialLinks.map((social) => (
              <SocialIcon
                key={social.platform}
                platform={social.platform}
                url={social.url}
                icon={social.icon}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
