"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  Cookie,
  Share2,
  Globe,
  Mail,
  Calendar,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { useState, useEffect } from "react";

// Custom SVG Icons (same as before for consistency)
const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
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
    width="18"
    height="18"
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

// Policy Section Component
const PolicySection = ({
  id,
  title,
  icon: Icon,
  children,
  delay,
}: {
  id: string;
  title: string;
  icon: any;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="scroll-mt-24"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="p-3 bg-primary rounded-xl text-primary-light flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
    </div>

    <div className="pl-0 md:pl-16 text-gray-300 leading-relaxed space-y-4">
      {children}
    </div>
  </motion.section>
);

// Table of Contents Item
const TocItem = ({
  id,
  title,
  icon: Icon,
}: {
  id: string;
  title: string;
  icon: any;
}) => (
  <li>
    <a
      href={`#${id}`}
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary-light transition-colors" />
      {title}
    </a>
  </li>
);

export default function PrivacyPolicyPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastUpdated] = useState("January 15, 2025");
  const [effectiveDate] = useState("February 1, 2025");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section className="pt-20 md:pt-28 pb-12 border-b border-white/10">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary rounded-2xl text-primary-light">
                  <Shield className="w-12 h-12" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
                Your privacy is important to us. This policy explains how
                Country Communication collects, uses, and protects your personal
                information.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last Updated: {lastUpdated}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Effective Date: {effectiveDate}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== MAIN CONTENT ===== */}
        <section className="py-16 md:py-20">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-[1600px] mx-auto">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Table of Contents - Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-light" />
                    Contents
                  </h3>
                  <nav>
                    <ul className="space-y-1">
                      <TocItem
                        id="introduction"
                        title="Introduction"
                        icon={Shield}
                      />
                      <TocItem
                        id="information-we-collect"
                        title="Information We Collect"
                        icon={Eye}
                      />
                      <TocItem
                        id="how-we-use"
                        title="How We Use Information"
                        icon={Share2}
                      />
                      <TocItem
                        id="cookies"
                        title="Cookies & Tracking"
                        icon={Cookie}
                      />
                      <TocItem
                        id="data-sharing"
                        title="Data Sharing"
                        icon={Share2}
                      />
                      <TocItem
                        id="data-security"
                        title="Data Security"
                        icon={Lock}
                      />
                      <TocItem
                        id="international"
                        title="International Transfers"
                        icon={Globe}
                      />
                      <TocItem
                        id="your-rights"
                        title="Your Rights"
                        icon={Shield}
                      />
                      <TocItem
                        id="children"
                        title="Children's Privacy"
                        icon={Lock}
                      />
                      <TocItem
                        id="changes"
                        title="Changes to Policy"
                        icon={Calendar}
                      />
                      <TocItem id="contact-us" title="Contact Us" icon={Mail} />
                    </ul>
                  </nav>
                </div>
              </motion.aside>

              {/* Policy Content */}
              <div className="lg:col-span-3 space-y-16">
                {/* Introduction */}
                <PolicySection
                  id="introduction"
                  title="1. Introduction"
                  icon={Shield}
                  delay={0.1}
                >
                  <p>
                    Country Communication ("we," "our," or "us") is committed to
                    protecting your privacy. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when
                    you visit our website{" "}
                    <Link
                      href="/"
                      className="text-primary-light hover:text-accent transition-colors"
                    >
                      www.countrycomm.com
                    </Link>
                    , use our services, or interact with us.
                  </p>
                  <p>
                    By accessing or using our website and services, you agree to
                    the collection and use of information in accordance with
                    this policy. If you do not agree with this policy, please do
                    not use our website or services.
                  </p>
                  <p>
                    This policy applies to all users, including visitors,
                    clients, and partners of Country Communication, based in
                    Dhaka, Bangladesh.
                  </p>
                </PolicySection>

                {/* Information We Collect */}
                <PolicySection
                  id="information-we-collect"
                  title="2. Information We Collect"
                  icon={Eye}
                  delay={0.15}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    2.1 Personal Information
                  </h3>
                  <p>
                    We may collect personal information that you voluntarily
                    provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>Fill out a contact form or inquiry form</li>
                    <li>Request a quote or consultation</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Register for an event or exhibition</li>
                    <li>Apply for a job position</li>
                    <li>
                      Communicate with us via email, phone, or social media
                    </li>
                  </ul>
                  <p className="mt-4">This information may include:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Company name and designation</li>
                    <li>Billing and payment information</li>
                    <li>Project requirements and specifications</li>
                  </ul>
                  <p className="mt-4">This information may include:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>Full name, email address, phone number</li>
                    <li>Company name and designation</li>
                    <li>Project requirements and specifications</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                    2.2 Automatically Collected Information
                  </h3>
                  <p>
                    When you visit our website, we automatically collect certain
                    information:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>IP address and browser type</li>
                    <li>Device information (desktop, mobile, tablet)</li>
                    <li>Operating system and version</li>
                    <li>Pages visited and time spent on each page</li>
                    <li>Referring website or source</li>
                    <li>Geographic location (country/city level)</li>
                  </ul>
                </PolicySection>

                {/* How We Use Information */}
                <PolicySection
                  id="how-we-use"
                  title="3. How We Use Your Information"
                  icon={Share2}
                  delay={0.2}
                >
                  <p>
                    We use the collected information for the following purposes:
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    3.1 Service Delivery
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>
                      To provide exhibition booth design and management services
                    </li>
                    <li>To process your inquiries and requests</li>
                    <li>To communicate with you about your projects</li>
                    <li>To send quotes, invoices, and project updates</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    3.2 Marketing & Communication
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>
                      To send newsletters and promotional materials (with your
                      consent)
                    </li>
                    <li>To inform you about upcoming exhibitions and events</li>
                    <li>To share case studies and portfolio updates</li>
                    <li>To personalize your experience on our website</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    3.3 Legal & Security
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>To comply with legal obligations and regulations</li>
                    <li>To prevent fraud and protect our business interests</li>
                    <li>To enforce our terms and conditions</li>
                  </ul>
                </PolicySection>

                {/* Cookies */}
                <PolicySection
                  id="cookies"
                  title="4. Cookies & Tracking Technologies"
                  icon={Cookie}
                  delay={0.25}
                >
                  <p>
                    Our website uses cookies and similar tracking technologies
                    to enhance your browsing experience and analyze website
                    traffic.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-4">
                    4.1 Types of Cookies We Use
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-1">
                        Essential Cookies
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Required for the website to function properly. These
                        cannot be disabled.
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-1">
                        Analytics Cookies
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Help us understand how visitors interact with our
                        website (Google Analytics).
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-1">
                        Marketing Cookies
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Used to deliver relevant advertisements and track
                        campaign performance.
                      </p>
                    </div>
                  </div>

                  <p className="mt-4">
                    You can manage your cookie preferences through your browser
                    settings. Disabling cookies may affect website
                    functionality.
                  </p>
                </PolicySection>

                {/* Data Sharing */}
                <PolicySection
                  id="data-sharing"
                  title="5. Data Sharing & Disclosure"
                  icon={Share2}
                  delay={0.3}
                >
                  <p>
                    We do not sell, trade, or rent your personal information to
                    third parties. We may share your information in the
                    following circumstances:
                  </p>

                  <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4 mt-3">
                    <li>
                      <span className="text-white font-medium">
                        Service Providers:
                      </span>{" "}
                      With trusted third-party vendors who assist us in
                      operating our website and business (hosting, email,
                      analytics)
                    </li>
                    <li>
                      <span className="text-white font-medium">
                        Legal Requirements:
                      </span>{" "}
                      When required by law, court order, or government
                      regulation
                    </li>
                    <li>
                      <span className="text-white font-medium">
                        Business Transfers:
                      </span>{" "}
                      In connection with a merger, acquisition, or sale of
                      assets
                    </li>
                    <li>
                      <span className="text-white font-medium">
                        With Your Consent:
                      </span>{" "}
                      When you explicitly permit us to share your information
                    </li>
                  </ul>
                </PolicySection>

                {/* Data Security */}
                <PolicySection
                  id="data-security"
                  title="6. Data Security"
                  icon={Lock}
                  delay={0.35}
                >
                  <p>
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4 mt-3">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Secure servers with firewall protection</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication protocols</li>
                    <li>Staff training on data protection</li>
                  </ul>

                  <p className="mt-4">
                    However, no method of transmission over the Internet is 100%
                    secure. While we strive to protect your data, we cannot
                    guarantee absolute security.
                  </p>
                </PolicySection>

                {/* International Transfers */}
                <PolicySection
                  id="international"
                  title="7. International Data Transfers"
                  icon={Globe}
                  delay={0.4}
                >
                  <p>
                    Country Communication is based in Bangladesh. If you are
                    accessing our services from outside Bangladesh, your
                    information may be transferred to and processed in
                    Bangladesh where our servers are located.
                  </p>
                  <p>
                    By using our services, you consent to the transfer of your
                    information to Bangladesh and other countries where we
                    operate, which may have different data protection laws than
                    your country of residence.
                  </p>
                </PolicySection>

                {/* Your Rights */}
                <PolicySection
                  id="your-rights"
                  title="8. Your Rights"
                  icon={Shield}
                  delay={0.45}
                >
                  <p>
                    Depending on your location, you may have the following
                    rights regarding your personal information:
                  </p>

                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    {[
                      "Access your personal data",
                      "Correct inaccurate data",
                      "Delete your personal data",
                      "Restrict processing",
                      "Data portability",
                      "Withdraw consent",
                      "Object to processing",
                      "Lodge a complaint",
                    ].map((right, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white/5 rounded-lg p-3 border border-white/10"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{right}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4">
                    To exercise any of these rights, please contact us using the
                    information provided in the Contact Us section.
                  </p>
                </PolicySection>

                {/* Children's Privacy */}
                <PolicySection
                  id="children"
                  title="9. Children's Privacy"
                  icon={Lock}
                  delay={0.5}
                >
                  <p>
                    Our services are not directed to individuals under the age
                    of 18. We do not knowingly collect personal information from
                    children. If you believe that a child has provided us with
                    personal information, please contact us immediately, and we
                    will take steps to delete such information.
                  </p>
                </PolicySection>

                {/* Changes to Policy */}
                <PolicySection
                  id="changes"
                  title="10. Changes to This Privacy Policy"
                  icon={Calendar}
                  delay={0.55}
                >
                  <p>
                    We may update this Privacy Policy from time to time to
                    reflect changes in our practices or for other operational,
                    legal, or regulatory reasons.
                  </p>
                  <p>We will notify you of any material changes by:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4 mt-2">
                    <li>Posting the updated policy on this page</li>
                    <li>Updating the "Last Updated" date at the top</li>
                    <li>
                      Sending an email notification (for significant changes)
                    </li>
                  </ul>
                  <p className="mt-4">
                    We encourage you to review this Privacy Policy periodically
                    to stay informed about how we protect your information.
                  </p>
                </PolicySection>

                {/* Contact Us */}
                <PolicySection
                  id="contact-us"
                  title="11. Contact Us"
                  icon={Mail}
                  delay={0.6}
                >
                  <p>
                    If you have any questions, concerns, or requests regarding
                    this Privacy Policy or our data practices, please contact
                    us:
                  </p>

                  <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                          <MailIcon />
                        </div>
                        <div>
                          <p className="text-white font-medium">Email</p>
                          <a
                            href="mailto:privacy@countrycomm.com"
                            className="text-gray-400 hover:text-primary-light transition-colors text-sm"
                          >
                            privacy@countrycomm.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                          <PhoneIcon />
                        </div>
                        <div>
                          <p className="text-white font-medium">Phone</p>
                          <a
                            href="tel:+8801234567890"
                            className="text-gray-400 hover:text-primary-light transition-colors text-sm"
                          >
                            +880 1234 567890
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                          <Globe className="w-[18px] h-[18px]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Address</p>
                          <p className="text-gray-400 text-sm">
                            House 42, Road 12, Gulshan Avenue
                            <br />
                            Dhaka 1212, Bangladesh
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-500">
                    We will respond to your inquiry within 30 days as required
                    by applicable data protection laws.
                  </p>
                </PolicySection>

                {/* Footer Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="pt-8 border-t border-white/10 text-center"
                >
                  <p className="text-gray-500 text-sm">
                    This Privacy Policy was last updated on {lastUpdated} and is
                    effective from {effectiveDate}.
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    © {new Date().getFullYear()} Country Communication. All
                    rights reserved.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
