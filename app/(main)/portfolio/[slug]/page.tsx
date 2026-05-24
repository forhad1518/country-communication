"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Heart,
  Share2,
  ChevronLeft,
  Eye,
  ArrowUp,
  CheckCircle,
  Link2,
  TrendingUp,
  Users,
  Target,
  Building2,
  Wrench,
  Quote,
  BookOpen,
  Search,
  ChevronRight,
  X,
} from "lucide-react";

// Custom Social Icons
const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-blue-500"
  >
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);
const TwitterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-sky-500"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-blue-600"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-green-500"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.32-1.41c1.48.8 3.15 1.22 4.87 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.9-9.91-9.9z" />
    <path
      d="M17.5 14.5c-.3.85-1.5 1.55-2.45 1.65-.65.07-1.45-.15-3.05-1.05-2.55-1.45-4.2-4.15-4.35-4.35-.15-.2-1.05-1.4-1.05-2.65 0-1.25.65-1.85.9-2.1.25-.25.55-.3.75-.3h.55c.2 0 .4 0 .5.4.2.4.65 1.6.7 1.7.05.1.1.25 0 .4-.1.15-.15.25-.3.4-.15.15-.3.35-.45.45-.15.15-.3.3-.1.55.4.65 1.05 1.35 2 1.85 1.2.65 1.8.85 2.1.75.3-.1.45-.35.6-.6.15-.25.25-.4.4-.35.15.05.95.45 1.1.55.15.1.25.15.3.25.05.1.05.35-.1.7z"
      fill="#ffffff"
    />
  </svg>
);

// Types
type ImageItem = { url: string; publicId: string; _id?: string };
type PortfolioType = {
  _id: string;
  title: string;
  exhibition_name: string;
  slug: string;
  projectInfo?: {
    clientName?: string;
    boothSize?: string;
    location?: string;
    buildTime?: string;
    overview?: string;
  };
  process?: {
    rendersImages?: ImageItem[];
    realImages?: ImageItem[];
    moodboardImages?: ImageItem[];
    processText?: string;
  };
  materials?: string[];
  technologies?: string[];
  execution?: string;
  objective?: string;
  challenges?: string;
  results?: {
    visitors?: string;
    engagement?: string;
    testimonial?: string;
    clientName?: string;
    clientImage?: ImageItem;
  };
  keywords?: string[];
  views?: number;
  likes?: number;
  createdAt?: string;
};

// Helpers
const getOptimizedUrl = (url: string, w = 800, h = 600): string => {
  if (!url) return "";
  if (url.includes("cloudinary.com"))
    return url.replace(
      "/upload/",
      `/upload/w_${w},h_${h},c_fill,q_auto,f_auto/`,
    );
  return url;
};
const formatDate = (d?: string): string =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

// ===== BEFORE/AFTER SLIDER =====
const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
}: {
  beforeImage: string;
  afterImage: string;
}) => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos(
      Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
    );
  };
  return (
    <div
      ref={containerRef}
      className="relative w-full h-100 md:h-125 rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={(e) => dragging && handleMove(e.clientX)}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => dragging && handleMove(e.touches[0].clientX)}
      onTouchStart={() => setDragging(true)}
      onTouchEnd={() => setDragging(false)}
    >
      <div className="absolute inset-0">
        <Image src={beforeImage} alt="Design" fill className="object-cover" />
        <span className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs z-10">
          DESIGN
        </span>
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image src={afterImage} alt="Real" fill className="object-cover" />
        <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs z-10">
          REALITY
        </span>
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-gray-400 rounded-full" />
            <div className="w-1 h-3 bg-gray-400 rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1.5 rounded-full text-xs">
        ← Drag to compare →
      </div>
    </div>
  );
};

// ===== LIGHTBOX MODAL =====
const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: ImageItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition z-10"
    >
      <X className="w-6 h-6 text-white" />
    </button>
    {images.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
    )}
    <div
      className="relative w-[90%] h-[80vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <Image
        src={getOptimizedUrl(images[currentIndex]?.url, 1200, 900)}
        alt=""
        fill
        className="object-contain"
      />
    </div>
    {images.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    )}
    <div className="absolute bottom-4 text-white text-sm">
      {currentIndex + 1} / {images.length}
    </div>
  </motion.div>
);

// Share Button
const ShareButton = ({ title, url }: { title: string; url: string }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  };
  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-primary/50 transition-colors cursor-pointer"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-12 bg-gray-900 border border-white/10 rounded-xl p-2 shadow-xl z-20 min-w-48"
          >
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <FacebookIcon /> Facebook
            </a>
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <TwitterIcon /> Twitter
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <LinkedinIcon /> LinkedIn
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => {
                navigator.clipboard?.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" /> Copied!
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 text-gray-400" /> Copy Link
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Table of Contents
const TableOfContents = ({
  portfolio,
  isSticky,
}: {
  portfolio: PortfolioType;
  isSticky: boolean;
}) => {
  const [activeId, setActiveId] = useState("");
  const sections = [
    { id: "overview", label: "Project Overview" },
    { id: "objective", label: "Client Objective" },
    { id: "slider", label: "Design vs Reality" },
    { id: "design-process", label: "Design Process" },
    { id: "moodboard", label: "Moodboard" },
    { id: "challenges", label: "Challenges" },
    { id: "materials", label: "Materials & Tech" },
    { id: "execution", label: "Execution" },
    { id: "gallery", label: "Image Gallery" },
    { id: "results", label: "Results" },
  ].filter((s) => {
    if (s.id === "overview") return !!portfolio.projectInfo?.overview;
    if (s.id === "objective") return !!portfolio.objective;
    if (s.id === "slider")
      return !!(
        portfolio.process?.rendersImages?.[0] &&
        portfolio.process?.realImages?.[0]
      );
    if (s.id === "design-process") return !!portfolio.process?.processText;
    if (s.id === "moodboard")
      return !!portfolio.process?.moodboardImages?.length;
    if (s.id === "challenges") return !!portfolio.challenges;
    if (s.id === "execution") return !!portfolio.execution;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll("[data-section]");
      let current = "";
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200) current = el.getAttribute("data-section") || "";
      });
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={isSticky ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5"
    >
      <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" /> Contents
      </h3>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(s.id)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`block text-xs py-1.5 px-3 rounded-lg transition-all cursor-pointer ${activeId === s.id ? "bg-primary/20 text-primary border-l-2 border-primary" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          {s.label}
        </a>
      ))}
    </motion.div>
  );
};

// Image Grid with Click to View
const ImageGrid = ({
  images,
  title,
  id,
}: {
  images: ImageItem[];
  title: string;
  id: string;
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div id={id} data-section={id}>
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => {
              setCurrentIndex(i);
              setLightboxOpen(true);
            }}
            className="relative h-40 md:h-52 rounded-xl overflow-hidden group cursor-pointer"
          >
            <Image
              src={getOptimizedUrl(img.url, 400, 300)}
              alt={`${title} ${i + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={currentIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() =>
              setCurrentIndex((p) => (p > 0 ? p - 1 : images.length - 1))
            }
            onNext={() =>
              setCurrentIndex((p) => (p < images.length - 1 ? p + 1 : 0))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Skeleton
const DetailSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-100 bg-gray-800 rounded-3xl" />
    <div className="space-y-4">
      <div className="h-8 bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-800 rounded w-1/2" />
    </div>
  </div>
);

// ===== MAIN COMPONENT =====
export default function PortfolioDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTocSticky, setIsTocSticky] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const tocContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) fetchPortfolio(slug);
  }, [slug]);

  const fetchPortfolio = async (s: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/portfolio/${s}`);
      const data = res.data.data;
      setPortfolio(data);
      setLikesCount(data.likes || 0);
      const liked = JSON.parse(localStorage.getItem("likedPortfolios") || "{}");
      if (liked[data.slug]) setIsLiked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Track view (only once)
  useEffect(() => {
    if (portfolio?.slug) {
      const viewed = sessionStorage.getItem(`viewed_${portfolio.slug}`);
      if (!viewed) {
        axios
          .post(`/api/portfolio/${portfolio.slug}/like`, { action: "view" })
          .catch(console.error);
        sessionStorage.setItem(`viewed_${portfolio.slug}`, "true");
      }
    }
  }, [portfolio?.slug]);

  // Reading progress + TOC sticky
  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      setShowScrollTop(window.scrollY > 500);

      // TOC sticky logic
      if (tocContainerRef.current) {
        const containerRect = tocContainerRef.current.getBoundingClientRect();
        const containerBottom =
          containerRect.top + tocContainerRef.current.offsetHeight;
        if (
          containerRect.top <= -300 &&
          containerBottom > window.innerHeight - 200
        ) {
          setIsTocSticky(true);
        } else {
          setIsTocSticky(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = async () => {
    if (!portfolio) return;
    const action = isLiked ? "unlike" : "like";
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount((prev) =>
      action === "like" ? prev + 1 : Math.max(0, prev - 1),
    );
    try {
      const res = await axios.post(`/api/portfolio/${portfolio.slug}/like`, {
        action,
      });
      setLikesCount(res.data.likes);
      const liked = JSON.parse(localStorage.getItem("likedPortfolios") || "{}");
      isLiked ? delete liked[portfolio.slug] : (liked[portfolio.slug] = true);
      localStorage.setItem("likedPortfolios", JSON.stringify(liked));
    } catch (err) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(portfolio.likes || 0);
    }
  };

  if (loading)
    return (
      <div className="relative min-h-screen bg-black">
        <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto pt-24">
          <DetailSkeleton />
        </div>
      </div>
    );
  if (!portfolio)
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Not found</h2>
          <Link href="/portfolio" className="text-primary">
            ← Back
          </Link>
        </div>
      </div>
    );

  const heroImage =
    portfolio.process?.rendersImages?.[0]?.url ||
    portfolio.process?.realImages?.[0]?.url ||
    "";
  const beforeImage = portfolio.process?.rendersImages?.[0]?.url || "";
  const afterImage = portfolio.process?.realImages?.[0]?.url || "";

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        style={{ width: `${progress}%` }}
        className="fixed top-0 left-0 h-1 bg-linear-to-r from-primary to-accent z-50"
      />
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 p-3 bg-primary text-white rounded-full shadow-lg cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-[90%] sm:w-[85%] lg:w-[80%] max-w-400 mx-auto">
        {/* Nav */}
        <div className="pt-8 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <Link
            href="/portfolio"
            className="text-gray-400 hover:text-primary transition-colors"
          >
            All Projects
          </Link>
        </div>

        {/* Hero */}
        <section className="pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden h-100 md:h-125 lg:h-150"
          >
            {heroImage ? (
              <Image
                src={getOptimizedUrl(heroImage, 1200, 600)}
                alt={portfolio.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-8xl">🏢</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
              <span className="inline-block px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-4">
                {portfolio.exhibition_name}
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
                {portfolio.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(portfolio.createdAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {portfolio.views || 0} views
                </span>
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {likesCount} likes
                </span>
                {portfolio.projectInfo?.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {portfolio.projectInfo.location}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Content + Sidebar */}
        <section className="py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Like & Share */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all cursor-pointer ${isLiked ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50"}`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {likesCount}
                </button>
                <ShareButton
                  title={portfolio.title}
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
              </div>

              {/* Project Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.projectInfo?.clientName && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                  >
                    <Building2 className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Client</p>
                    <p className="text-white font-medium text-sm">
                      {portfolio.projectInfo.clientName}
                    </p>
                  </motion.div>
                )}
                {portfolio.projectInfo?.boothSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                  >
                    <Target className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Booth Size</p>
                    <p className="text-white font-medium text-sm">
                      {portfolio.projectInfo.boothSize}
                    </p>
                  </motion.div>
                )}
                {portfolio.projectInfo?.location && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                  >
                    <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-white font-medium text-sm">
                      {portfolio.projectInfo.location}
                    </p>
                  </motion.div>
                )}
                {portfolio.projectInfo?.buildTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                  >
                    <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Build Time</p>
                    <p className="text-white font-medium text-sm">
                      {portfolio.projectInfo.buildTime} hrs
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Project Overview */}
              {portfolio.projectInfo?.overview && (
                <div id="overview" data-section="overview">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Project Overview
                  </h2>
                  <p className="text-gray-300 text-justify leading-relaxed">
                    {portfolio.projectInfo.overview}
                  </p>
                </div>
              )}

              {/* Client Objective */}
              {portfolio.objective && (
                <div
                  id="objective"
                  data-section="objective"
                  className="bg-linear-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" /> Client
                    Objective
                  </h2>
                  <p className="text-gray-300 text-justify leading-relaxed">
                    {portfolio.objective}
                  </p>
                </div>
              )}

              {/* Before/After Slider */}
              {(beforeImage || afterImage) && (
                <div id="slider" data-section="slider">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Design vs Reality
                  </h2>
                  <BeforeAfterSlider
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                  />
                </div>
              )}

              {/* Design Process */}
              {portfolio.process?.processText && (
                <div id="design-process" data-section="design-process">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Design Process
                  </h2>
                  <p className="text-gray-300 text-justify leading-relaxed">
                    {portfolio.process.processText}
                  </p>
                </div>
              )}

              {/* Moodboard */}
              {portfolio.process?.moodboardImages &&
                portfolio.process.moodboardImages.length > 0 && (
                  <ImageGrid
                    images={portfolio.process.moodboardImages}
                    title="Moodboard / Sketches"
                    id="moodboard"
                  />
                )}

              {/* Challenges */}
              {portfolio.challenges && (
                <div
                  id="challenges"
                  data-section="challenges"
                  className="bg-linear-to-br from-red-500/5 to-orange-500/5 rounded-2xl p-8 border border-red-500/10"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-accent" /> Challenges
                  </h2>
                  <p className="text-gray-300 text-justify leading-relaxed">
                    {portfolio.challenges}
                  </p>
                </div>
              )}

              {/* Materials & Technologies */}
              <div id="materials" data-section="materials">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Materials & Technologies
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {portfolio.materials && portfolio.materials.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-primary" />{" "}
                        Materials
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {portfolio.materials.map((m, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {portfolio.technologies &&
                    portfolio.technologies.length > 0 && (
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-accent" />{" "}
                          Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {portfolio.technologies.map((t, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Execution */}
              {portfolio.execution && (
                <div id="execution" data-section="execution">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    On-site Execution
                  </h2>
                  <p className="text-gray-300 text-justify leading-relaxed">
                    {portfolio.execution}
                  </p>
                </div>
              )}

              {/* Renders Gallery */}
              {portfolio.process?.rendersImages &&
                portfolio.process.rendersImages.length > 0 && (
                  <ImageGrid
                    images={portfolio.process.rendersImages}
                    title="3D Renders Gallery"
                    id="gallery"
                  />
                )}

              {/* Real Images Gallery */}
              {portfolio.process?.realImages &&
                portfolio.process.realImages.length > 0 && (
                  <ImageGrid
                    images={portfolio.process.realImages}
                    title="Real Images Gallery"
                    id="real-gallery"
                  />
                )}

              {/* Results */}
              <div id="results" data-section="results">
                <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
                {(portfolio.results?.visitors ||
                  portfolio.results?.engagement) && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {portfolio.results.visitors && (
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                        <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-white">
                          {portfolio.results.visitors}+
                        </p>
                        <p className="text-gray-400 text-sm mt-1">Visitors</p>
                      </div>
                    )}
                    {portfolio.results.engagement && (
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                        <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                        <p className="text-3xl font-bold text-white">
                          {portfolio.results.engagement}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">Engagement</p>
                      </div>
                    )}
                  </div>
                )}
                {(portfolio.results?.testimonial ||
                  portfolio.results?.clientName) && (
                  <div className="bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 relative">
                    <Quote className="w-12 h-12 text-primary/30 absolute top-4 left-4" />
                    {portfolio.results.clientImage?.url && (
                      <div className="flex justify-center mb-4">
                        <Image
                          src={getOptimizedUrl(
                            portfolio.results.clientImage.url,
                            80,
                            80,
                          )}
                          alt=""
                          width={80}
                          height={80}
                          className="rounded-full object-cover border-2 border-primary/30"
                        />
                      </div>
                    )}
                    {portfolio.results.testimonial && (
                      <p className="text-white text-lg italic text-center leading-relaxed mb-4">
                        "{portfolio.results.testimonial}"
                      </p>
                    )}
                    {portfolio.results.clientName && (
                      <p className="text-primary font-semibold text-center">
                        — {portfolio.results.clientName}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Keywords */}
              {portfolio.keywords && portfolio.keywords.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" /> SEO Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with Sticky TOC */}
            <div className="lg:col-span-1" ref={tocContainerRef}>
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    Quick Stats
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Views</span>
                    <span className="text-white font-medium">
                      {portfolio.views || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Likes</span>
                    <span className="text-white font-medium">{likesCount}</span>
                  </div>
                  {portfolio.projectInfo?.boothSize && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Booth</span>
                      <span className="text-white font-medium">
                        {portfolio.projectInfo.boothSize}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="bg-linear-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Want a similar booth?
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Let's build your dream exhibition booth.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors text-sm cursor-pointer"
                  >
                    Get Free Consultation <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                {/* TOC - becomes sticky when scrolled past */}
                <div
                  ref={tocRef}
                  className={`bg-linear-to-br from-gray-900/50 to-black/50 rounded-2xl p-6 border border-white/10 transition-all duration-300 ${isTocSticky ? "lg:fixed lg:top-24 lg:w-[calc(25%-2rem)] lg:max-w-87.5" : ""}`}
                >
                  <TableOfContents
                    portfolio={portfolio}
                    isSticky={isTocSticky}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
