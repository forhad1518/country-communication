"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Cookie,
  Shield,
  Settings,
  Clock,
  BarChart3,
  Target,
  Mail,
  Calendar,
  ArrowUp,
  CheckCircle,
  Info,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";

// Custom SVG Icons
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

// Cookie Section Component
const CookieSection = ({
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
      <div className="p-3 bg-primary rounded-xl text-primary-light shrink-0">
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

// Cookie Type Card Component
const CookieTypeCard = ({
  name,
  icon: Icon,
  description,
  examples,
  duration,
  required,
}: {
  name: string;
  icon: any;
  description: string;
  examples: string[];
  duration: string;
  required?: boolean;
}) => (
  <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-primary/30 transition-all duration-300">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
      </div>
      {required ? (
        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
          Required
        </span>
      ) : (
        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20">
          Optional
        </span>
      )}
    </div>

    <p className="text-gray-400 text-sm mb-4">{description}</p>

    <div className="space-y-2">
      <div>
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Examples
        </h4>
        <div className="flex flex-wrap gap-1">
          {examples.map((example, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-md border border-white/10"
            >
              {example}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Duration
        </h4>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-gray-500" />
          <span className="text-gray-400 text-xs">{duration}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function CookiePolicyPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastUpdated] = useState("January 15, 2025");

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

  const cookieTypes = [
    {
      name: "Essential Cookies",
      icon: Shield,
      description:
        "These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the website functions.",
      examples: [
        "Session ID",
        "CSRF Token",
        "Authentication",
        "Load Balancing",
      ],
      duration: "Session to 1 year",
      required: true,
    },
    {
      name: "Performance & Analytics Cookies",
      icon: BarChart3,
      description:
        "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve our website's performance and user experience.",
      examples: [
        "Google Analytics",
        "Page Views",
        "Time on Site",
        "Bounce Rate",
      ],
      duration: "1 day to 2 years",
      required: false,
    },
    {
      name: "Functional Cookies",
      icon: Settings,
      description:
        "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
      examples: [
        "Language Preference",
        "Form Data",
        "Video Players",
        "Live Chat",
      ],
      duration: "Session to 1 year",
      required: false,
    },
    {
      name: "Marketing & Targeting Cookies",
      icon: Target,
      description:
        "These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.",
      examples: [
        "Facebook Pixel",
        "Google Ads",
        "LinkedIn Insights",
        "Retargeting",
      ],
      duration: "30 days to 2 years",
      required: false,
    },
    {
      name: "Social Media Cookies",
      icon: Globe,
      description:
        "These cookies are set by social media services that we have added to the site to enable you to share our content with your friends and networks. They are capable of tracking your browser across other sites.",
      examples: [
        "Facebook Share",
        "Twitter Widget",
        "LinkedIn Follow",
        "YouTube Embed",
      ],
      duration: "Session to 2 years",
      required: false,
    },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-125 h-125 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-accent/10 rounded-full blur-3xl" />
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
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="p-4 bg-primary rounded-2xl text-primary-light">
                    <Cookie className="w-12 h-12" />
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                  />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                  Cookie Policy
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
                We use cookies to enhance your browsing experience, analyze site
                traffic, and personalize content. This policy explains how and
                why we use cookies.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last Updated: {lastUpdated}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== MAIN CONTENT ===== */}
        <section className="py-16 md:py-20">
          <div className="w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Table of Contents - Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 bg-linear-to-br from-gray-900/80 to-black/80 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-primary-light" />
                    Contents
                  </h3>
                  <nav>
                    <ul className="space-y-1">
                      <TocItem
                        id="what-are-cookies"
                        title="What Are Cookies"
                        icon={Info}
                      />
                      <TocItem
                        id="how-we-use"
                        title="How We Use Cookies"
                        icon={Settings}
                      />
                      <TocItem
                        id="types-of-cookies"
                        title="Types of Cookies"
                        icon={Cookie}
                      />
                      <TocItem
                        id="third-party"
                        title="Third-Party Cookies"
                        icon={Globe}
                      />
                      <TocItem
                        id="manage-cookies"
                        title="Managing Cookies"
                        icon={Settings}
                      />
                      <TocItem
                        id="consent"
                        title="Your Consent"
                        icon={CheckCircle}
                      />
                      <TocItem
                        id="updates"
                        title="Policy Updates"
                        icon={Calendar}
                      />
                      <TocItem id="contact" title="Contact Us" icon={Mail} />
                    </ul>
                  </nav>
                </div>
              </motion.aside>

              {/* Cookie Policy Content */}
              <div className="lg:col-span-3 space-y-16">
                {/* 1. What Are Cookies */}
                <CookieSection
                  id="what-are-cookies"
                  title="1. What Are Cookies?"
                  icon={Info}
                  delay={0.1}
                >
                  <p>
                    Cookies are small text files that are placed on your device
                    (computer, tablet, or mobile phone) when you visit a
                    website. They are widely used to make websites work more
                    efficiently and provide information to the website owners.
                  </p>

                  <div className="bg-linear-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20 mt-4">
                    <div className="flex items-start gap-4">
                      <Cookie className="w-8 h-8 text-primary-light shrink-0 mt-1" />
                      <div>
                        <h3 className="text-white font-semibold mb-2">
                          How Cookies Work
                        </h3>
                        <p className="text-gray-400 text-sm">
                          When you visit our website, we send a small file
                          (cookie) to your browser. Your browser stores this
                          file, and when you return to our site, your browser
                          sends the cookie back to us. This helps us recognize
                          you and remember your preferences.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                    Types of Cookie Storage
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-2">
                        Session Cookies
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Temporary cookies that are deleted when you close your
                        browser.
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-2">
                        Persistent Cookies
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Remain on your device for a set period or until manually
                        deleted.
                      </p>
                    </div>
                  </div>
                </CookieSection>

                {/* 2. How We Use Cookies */}
                <CookieSection
                  id="how-we-use"
                  title="2. How We Use Cookies"
                  icon={Settings}
                  delay={0.15}
                >
                  <p>
                    Country Communication uses cookies for the following
                    purposes:
                  </p>

                  <div className="space-y-3 mt-4">
                    {[
                      {
                        title: "Essential Website Functions",
                        description:
                          "To enable core functionality like page navigation, secure areas access, and form submissions.",
                      },
                      {
                        title: "Performance Monitoring",
                        description:
                          "To analyze how visitors use our website, identify errors, and improve site performance.",
                      },
                      {
                        title: "User Preferences",
                        description:
                          "To remember your language choices, display preferences, and form data for a better experience.",
                      },
                      {
                        title: "Analytics & Insights",
                        description:
                          "To understand visitor behavior, track page views, and measure the effectiveness of our content.",
                      },
                      {
                        title: "Marketing & Advertising",
                        description:
                          "To deliver relevant ads, measure campaign performance, and avoid showing duplicate ads.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CookieSection>

                {/* 3. Types of Cookies We Use */}
                <CookieSection
                  id="types-of-cookies"
                  title="3. Types of Cookies We Use"
                  icon={Cookie}
                  delay={0.2}
                >
                  <p>
                    Below is a detailed list of the cookies we use on our
                    website, organized by category:
                  </p>

                  <div className="space-y-4 mt-4">
                    {cookieTypes.map((type, i) => (
                      <CookieTypeCard key={i} {...type} />
                    ))}
                  </div>
                </CookieSection>

                {/* 4. Third-Party Cookies */}
                <CookieSection
                  id="third-party"
                  title="4. Third-Party Cookies"
                  icon={Globe}
                  delay={0.25}
                >
                  <p>
                    In addition to our own cookies, we work with trusted
                    third-party service providers who may also set cookies on
                    your device when you visit our website. These third parties
                    include:
                  </p>

                  <div className="space-y-4 mt-4">
                    {[
                      {
                        name: "Google Analytics",
                        purpose: "Web analytics and visitor behavior tracking",
                        policy: "https://policies.google.com/privacy",
                        cookies: ["_ga", "_gid", "_gat"],
                      },
                      {
                        name: "Google Ads",
                        purpose: "Advertising and conversion tracking",
                        policy: "https://policies.google.com/privacy",
                        cookies: ["_gcl_au", "IDE", "test_cookie"],
                      },
                      {
                        name: "Facebook Pixel",
                        purpose: "Social media advertising and retargeting",
                        policy: "https://www.facebook.com/policy.php",
                        cookies: ["_fbp", "fr"],
                      },
                      {
                        name: "LinkedIn Insights",
                        purpose: "B2B marketing and analytics",
                        policy: "https://www.linkedin.com/legal/privacy-policy",
                        cookies: ["li_gc", "lidc", "bcookie"],
                      },
                    ].map((thirdParty, i) => (
                      <div
                        key={i}
                        className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-primary/20 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">
                            {thirdParty.name}
                          </h3>
                          <Link
                            href={thirdParty.policy}
                            target="_blank"
                            className="text-primary-light text-xs hover:text-accent transition-colors"
                          >
                            Privacy Policy ↗
                          </Link>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">
                          {thirdParty.purpose}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {thirdParty.cookies.map((cookie, j) => (
                            <code
                              key={j}
                              className="px-2 py-1 bg-black/30 text-gray-300 text-xs rounded border border-white/10 font-mono"
                            >
                              {cookie}
                            </code>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                    <p className="text-gray-300 text-sm flex items-start gap-2">
                      <Info className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
                      <span>
                        We do not have control over cookies set by third
                        parties. Please review their respective privacy policies
                        for more information about their data practices.
                      </span>
                    </p>
                  </div>
                </CookieSection>

                {/* 5. Managing Cookies */}
                <CookieSection
                  id="manage-cookies"
                  title="5. How to Manage Cookies"
                  icon={Settings}
                  delay={0.3}
                >
                  <p>
                    You have the right to accept or reject cookies. You can
                    manage your cookie preferences in several ways:
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                    5.1 Browser Settings
                  </h3>
                  <p>
                    Most web browsers allow you to control cookies through their
                    settings. You can usually find these settings in the
                    "Options" or "Preferences" menu. Below are links to cookie
                    management guides for popular browsers:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                      {
                        name: "Google Chrome",
                        url: "https://support.google.com/chrome/answer/95647",
                      },
                      {
                        name: "Mozilla Firefox",
                        url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer",
                      },
                      {
                        name: "Safari",
                        url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
                      },
                      {
                        name: "Microsoft Edge",
                        url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
                      },
                      {
                        name: "Opera",
                        url: "https://help.opera.com/en/latest/web-preferences/#cookies",
                      },
                      {
                        name: "Brave",
                        url: "https://support.brave.com/hc/en-us/articles/360022602172-How-do-I-manage-cookies-and-site-data-in-Brave",
                      },
                    ].map((browser, i) => (
                      <Link
                        key={i}
                        href={browser.url}
                        target="_blank"
                        className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10 hover:border-primary/30 transition-all group"
                      >
                        <Globe className="w-4 h-4 text-gray-400 group-hover:text-primary-light transition-colors" />
                        <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                          {browser.name} →
                        </span>
                      </Link>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                    5.2 Opt-Out Tools
                  </h3>
                  <p>
                    You can also opt out of specific third-party cookies using
                    these tools:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4 mt-2">
                    <li>
                      <Link
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        className="text-primary-light hover:text-accent transition-colors"
                      >
                        Google Analytics Opt-out Browser Add-on
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.youronlinechoices.com/"
                        target="_blank"
                        className="text-primary-light hover:text-accent transition-colors"
                      >
                        European Interactive Digital Advertising Alliance (EDAA)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://optout.networkadvertising.org/"
                        target="_blank"
                        className="text-primary-light hover:text-accent transition-colors"
                      >
                        Network Advertising Initiative (NAI) Opt-Out
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://optout.aboutads.info/"
                        target="_blank"
                        className="text-primary-light hover:text-accent transition-colors"
                      >
                        Digital Advertising Alliance (DAA) Opt-Out
                      </Link>
                    </li>
                  </ul>

                  <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mt-4">
                    <p className="text-gray-300 text-sm flex items-start gap-2">
                      <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>
                        <span className="text-white font-medium">
                          Important:
                        </span>{" "}
                        Disabling certain cookies may affect the functionality
                        and features of our website. Essential cookies cannot be
                        disabled as they are required for website operation.
                      </span>
                    </p>
                  </div>
                </CookieSection>

                {/* 6. Your Consent */}
                <CookieSection
                  id="consent"
                  title="6. Your Consent"
                  icon={CheckCircle}
                  delay={0.35}
                >
                  <p>
                    When you first visit our website, you will see a cookie
                    consent banner that allows you to accept or manage your
                    cookie preferences. By clicking "Accept All Cookies," you
                    consent to our use of all cookies as described in this
                    policy.
                  </p>

                  <div className="bg-linear-to-br from-gray-900/80 to-black/80 rounded-2xl p-6 border border-white/10 mt-4">
                    <h3 className="text-white font-semibold mb-4">
                      Cookie Consent Options
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          option: "Accept All Cookies",
                          description:
                            "All categories of cookies will be placed on your device for the best browsing experience.",
                          icon: CheckCircle,
                          color: "text-green-500",
                        },
                        {
                          option: "Customize Settings",
                          description:
                            "Choose which categories of cookies you want to allow. Essential cookies cannot be disabled.",
                          icon: Settings,
                          color: "text-primary-light",
                        },
                        {
                          option: "Reject All (Except Essential)",
                          description:
                            "Only essential cookies will be placed. Some features may not function properly.",
                          icon: Info,
                          color: "text-accent",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-3 bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <item.icon
                            className={`w-5 h-5 ${item.color} shrink-0 mt-0.5`}
                          />
                          <div>
                            <h4 className="text-white font-medium text-sm mb-1">
                              {item.option}
                            </h4>
                            <p className="text-gray-400 text-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4">
                    You can withdraw your consent at any time by clearing your
                    browser cookies or adjusting your cookie preferences through
                    our cookie settings panel.
                  </p>
                </CookieSection>

                {/* 7. Updates to Cookie Policy */}
                <CookieSection
                  id="updates"
                  title="7. Updates to This Cookie Policy"
                  icon={Calendar}
                  delay={0.4}
                >
                  <p>
                    We may update this Cookie Policy from time to time to
                    reflect changes in our cookie practices, technology, or
                    legal requirements. When we make changes, we will update the
                    "Last Updated" date at the top of this page.
                  </p>
                  <p>
                    We encourage you to review this Cookie Policy periodically
                    to stay informed about how we use cookies and your choices
                    regarding them.
                  </p>
                  <p>
                    For significant changes, we may provide additional notice
                    through our website or by other means.
                  </p>
                </CookieSection>

                {/* 8. Contact Us */}
                <CookieSection
                  id="contact"
                  title="8. Contact Us"
                  icon={Mail}
                  delay={0.45}
                >
                  <p>
                    If you have any questions, concerns, or requests regarding
                    this Cookie Policy or our use of cookies, please contact us:
                  </p>

                  <div className="bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg text-primary-light">
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
                        <div className="p-2 bg-primary rounded-lg text-primary-light">
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
                        <div className="p-2 bg-primary  rounded-lg text-primary-light">
                          <Globe className="w-4.5 h-4.5" />
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
                    We will respond to your inquiry as soon as possible,
                    typically within 5 business days.
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <span>Also see our:</span>
                    <Link
                      href="/privacy-policy"
                      className="text-primary-light hover:text-accent transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link
                      href="/terms-conditions"
                      className="text-primary-light hover:text-accent transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </div>
                </CookieSection>

                {/* Footer Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 border-t border-white/10 text-center"
                >
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                    <p className="text-gray-300 text-sm">
                      <span className="text-primary-light font-semibold">
                        Cookie-Free Alternative:
                      </span>{" "}
                      You can also browse our website in your browser's
                      private/incognito mode, which automatically deletes
                      cookies when you close the window.
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    This Cookie Policy was last updated on {lastUpdated}.
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
